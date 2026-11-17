const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const results = [];

  // dev server injects CSS via JS -> networkidle is not enough. Poll until Tailwind applies.
  async function waitReady(ms = 25000) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      const ok = await page.evaluate(() => {
        const card = document.querySelector('article.prompt-card');
        const content = document.querySelector('.prompt-card-content');
        if (!card || !content) return false;
        // CSS đã áp dụng
        const styled = getComputedStyle(card).cursor === 'pointer' && getComputedStyle(content).pointerEvents === 'none';
        // React đã hydrate xong (dev mất ~7s với 281 prompt)
        const hydrated = Object.keys(card).some(k => k.startsWith('__reactFiber$'));
        return styled && hydrated;
      }).catch(() => false);
      if (ok) return true;
      await page.waitForTimeout(200);
    }
    return false;
  }

  // poll until the grid count and both live regions agree on a stable value
  async function gridSettled(ms = 15000) {
    const t0 = Date.now();
    let last = null;
    let same = 0;
    while (Date.now() - t0 < ms) {
      const s = await page.evaluate(() => {
        const grid = document.querySelectorAll('#prompt-grid article.prompt-card').length;
        const shown = ([...document.querySelectorAll('[aria-live]')]
          .map(e => e.textContent.trim()).find(t => t.startsWith('Đang hiển thị')) || '');
        return { grid, shown };
      }).catch(() => ({ grid: -1, shown: '' }));
      const key = JSON.stringify(s);
      same = key === last ? same + 1 : 0;
      last = key;
      // cần ổn định >= 3 lần và tối thiểu 1.2s để effect chain (dev chậm) kịp chạy
      if (same >= 3 && Date.now() - t0 > 1200 && s.grid > 0 && s.shown) return s;
      await page.waitForTimeout(400);
    }
    return last ? JSON.parse(last) : { grid: -1, shown: '' };
  }

  async function waitForPromptUrl(ms = 10000) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      if (/\/prompt\//.test(page.url())) return true;
      await page.waitForTimeout(100);
    }
    return false;
  }
  async function clickCardBody(offsetX, offsetYFromBottom) {
    const card = page.locator('article.prompt-card').first();
    await card.waitFor();
    await card.scrollIntoViewIfNeeded();
    const box = await card.boundingBox();
    await page.mouse.click(box.x + offsetX, box.y + box.height - offsetYFromBottom);
  }

  // ---- A. PromptCard click behaviour ----
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  results.push(['A0 page ready (CSS+hydration)', await waitReady(), 'cursor/pointer-events applied']);

  await clickCardBody(60, 30);
  results.push(['A1 click card body opens detail', await waitForPromptUrl(), page.url()]);
  await page.waitForTimeout(600);
  const h1 = (await page.locator('h1').first().textContent() || '').trim();
  results.push(['A2 detail page renders', h1.length > 0 && !/^Thư viện Prompt/.test(h1), h1.slice(0, 45)]);

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await waitReady();
  await clickCardBody(120, 110);
  results.push(['A3 click on excerpt opens detail', await waitForPromptUrl(), page.url()]);

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await waitReady();
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  const btn = page.locator('article.prompt-card [data-action="copy"]').first();
  await btn.click();
  await page.waitForTimeout(700);
  const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
  const label = (await btn.textContent()).trim();
  results.push(['A4 copy does not navigate', !/\/prompt\//.test(page.url()), page.url()]);
  results.push(['A5 copy writes clipboard', clip.length > 20, clip.slice(0, 40) + '…']);
  results.push(['A6 copy shows feedback', label.includes('Đã copy'), label]);

  const card = page.locator('article.prompt-card').first();
  results.push(['A7 cursor pointer', (await card.evaluate(el => getComputedStyle(el).cursor)) === 'pointer', 'pointer']);
  const hint = card.locator('span', { hasText: 'Xem chi tiết' }).first();
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await page.mouse.move(2, 2);
  await page.waitForTimeout(450);
  const o1 = await hint.evaluate(el => getComputedStyle(el).opacity);
  await card.hover();
  await page.waitForTimeout(450);
  const o2 = await hint.evaluate(el => getComputedStyle(el).opacity);
  results.push(['A8 hover reveals "Xem chi tiết"', Number(o1) < 0.2 && Number(o2) > 0.8, `${o1} -> ${o2}`]);
  const shadow = await card.evaluate(el => getComputedStyle(el).boxShadow);
  results.push(['A9 hover elevation', !!shadow && shadow !== 'none', shadow.slice(0, 35) + '…']);

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await waitReady();
  await page.locator('article.prompt-card a.prompt-card-link').first().focus();
  await page.keyboard.press('Enter');
  results.push(['A10 keyboard Enter opens detail', await waitForPromptUrl(), page.url()]);

  // ---- B. Deep links ----
  const cases = [['Ảnh - Nano Banana', 52], ['Ảnh - GPT Image', 198], ['Video - ASMR', 7]];
  for (const [cat, expected] of cases) {
    await page.goto('http://localhost:3000/?category=' + encodeURIComponent(cat), { waitUntil: 'domcontentloaded' });
    await waitReady();
    const s = await gridSettled();
    const shown = parseInt((s.shown.match(/(\d+)/) || [])[1] || '0', 10);
    const badges = await page.evaluate(() => [...new Set([...document.querySelectorAll('#prompt-grid article.prompt-card')]
      .map(el => el.querySelector('div > span')?.textContent?.trim()))]);
    const clean = badges.length === 1 && (badges[0] || '').includes(cat);
    results.push([`B deep link ${cat}`, shown === expected && clean,
      `grid=${s.grid} shown=${shown}/${expected} badges=${JSON.stringify(badges)}`]);
  }

  // ---- C. Interaction still works ----
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await waitReady();
  // Click có thể rơi vào lúc React chưa hydrate xong -> bấm lại (tối đa 4 lần).
  let after = await gridSettled();
  for (let i = 0; i < 4 && after.grid !== 7; i++) {
    await page.getByRole('button', { name: /Video - ASMR/ }).first().click();
    await page.waitForTimeout(800);
    after = await gridSettled();
  }
  results.push(['C1 sidebar click filters', after.grid === 7 && after.shown.includes('7'), JSON.stringify(after)]);
  results.push(['C2 URL param written', /category=Video/.test(await page.evaluate(() => location.search)), await page.evaluate(() => location.search)]);

  await browser.close();

  let pass = 0;
  for (const [n, ok, info] of results) {
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}  ->  ${info}`);
    if (ok) pass++;
  }
  console.log(`\n${pass}/${results.length} passed`);
  process.exit(pass === results.length ? 0 : 1);
})();
