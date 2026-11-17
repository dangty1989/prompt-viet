// E2E: category click / toggle / URL / deep link / keyboard / mobile chips
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:4601/";
const b = await chromium.launch();
const fails = [];
const ok = (cond, msg, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${msg}${extra ? " — " + extra : ""}`);
  if (!cond) fails.push(msg);
};

const gridSel = "#prompt-grid a[href^='/prompt/']";
const state = async (p) => ({
  cards: await p.$$eval(gridSel, (e) => e.length),
  counter: (await p.textContent(".search-filter p.body-sm"))?.replace(/\s+/g, " ").trim(),
  url: decodeURIComponent("?" + new URL(p.url()).searchParams.toString()),
  categoryParam: new URL(p.url()).searchParams.get("category"),
  first: await p.$$eval(gridSel, (e) => e[0]?.getAttribute("href")),
});

// ---------- DESKTOP ----------
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(BASE, { waitUntil: "networkidle" });
  await p.waitForTimeout(400);

  const sidebarBtn = (t) => p.locator("aside button").filter({ hasText: t }).first();

  // 1. click category
  await sidebarBtn("Công việc").click();
  await p.waitForTimeout(350);
  let s = await state(p);
  ok(s.counter === "Tìm thấy 2 / 281 prompt", "click 'Công việc' lọc đúng", s.counter);
  ok(s.categoryParam === "Công việc", "URL ghi ?category=", s.url);

  // 2. active visual state
  const pressed = await sidebarBtn("Công việc").getAttribute("aria-pressed");
  ok(pressed === "true", "aria-pressed=true trên danh mục đang chọn");

  // 3. click lại = bỏ lọc
  await sidebarBtn("Công việc").click();
  await p.waitForTimeout(350);
  s = await state(p);
  ok(s.cards === 50 && s.counter.includes("281 / 281"), "click lại danh mục đang chọn = bỏ lọc", s.counter);
  ok(!s.categoryParam, "URL xóa ?category khi bỏ lọc", s.url);

  // 4. keyboard
  await sidebarBtn("Dịch thuật").focus();
  await p.keyboard.press("Enter");
  await p.waitForTimeout(350);
  s = await state(p);
  ok(s.counter === "Tìm thấy 1 / 281 prompt", "Enter trên danh mục kích hoạt filter", s.counter);

  // 5. danh mục ảnh mới
  await sidebarBtn("Ảnh - Nano Banana").click();
  await p.waitForTimeout(350);
  s = await state(p);
  ok(s.counter === "Tìm thấy 52 / 281 prompt", "danh mục 'Ảnh - Nano Banana' lọc đúng", s.counter);
  ok(s.first === "/prompt/vn-1/", "card đầu thuộc nhóm Nano Banana", s.first);
  const icon = await sidebarBtn("Ảnh - Nano Banana").innerText();
  ok(icon.includes("🍌"), "icon riêng cho danh mục mới", icon.split("\n")[0]);

  // 6. không nhảy scroll khi lưới đã trong tầm nhìn
  const yBefore = await p.evaluate(() => Math.round(window.scrollY));
  await sidebarBtn("Học tập").click();
  await p.waitForTimeout(500);
  const yAfter = await p.evaluate(() => Math.round(window.scrollY));
  ok(Math.abs(yAfter - yBefore) < 40, "không giật scroll khi lưới đang hiển thị", `${yBefore} -> ${yAfter}`);

  // 7. kết hợp search + category
  await p.fill("#search", "gia sư");
  await p.waitForTimeout(400);
  s = await state(p);
  ok(s.cards >= 1 && s.cards <= 9, "search + category kết hợp đúng", s.counter);

  ok(errs.length === 0, "không có lỗi runtime", errs.join(" | "));
  await p.close();
}

// ---------- DEEP LINK ----------
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "?category=" + encodeURIComponent("Ảnh - GPT Image"), { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  const s = await state(p);
  ok(s.counter === "Tìm thấy 198 / 281 prompt", "deep link ?category= load đúng filter", s.counter);
  await p.close();
}

// ---------- MOBILE ----------
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await p.goto(BASE, { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  const chip = (t) => p.locator("div.lg\\:hidden button").filter({ hasText: t }).first();

  await chip("Video - ASMR").tap();
  await p.waitForTimeout(350);
  let s = await state(p);
  ok(s.counter === "Tìm thấy 7 / 281 prompt", "mobile: chip 'Video - ASMR' lọc đúng", s.counter);

  await chip("Tất cả").tap();
  await p.waitForTimeout(350);
  s = await state(p);
  ok(s.counter.includes("281 / 281"), "mobile: chip 'Tất cả' reset filter", s.counter);

  await chip("Dịch thuật").tap();
  await p.waitForTimeout(350);
  await chip("Dịch thuật").tap();
  await p.waitForTimeout(350);
  s = await state(p);
  ok(s.counter.includes("281 / 281"), "mobile: tap lại chip đang chọn = bỏ lọc", s.counter);

  // không có tràn ngang
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(overflow <= 1, "mobile: không tràn ngang", `overflowX=${overflow}px`);

  // sau khi tap, hàng chip vẫn phải nằm trong khung nhìn (không bị navbar che)
  const chipsBox = await p.evaluate(() => {
    const el = document.getElementById("category-chips")
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { top: Math.round(r.top), bottom: Math.round(r.bottom) }
  })
  ok(chipsBox && chipsBox.top >= 0 && chipsBox.top < 140, "mobile: hàng chip vẫn trong tầm nhìn sau khi lọc", JSON.stringify(chipsBox));
  await p.close();
}

await b.close();
console.log(fails.length ? `\n${fails.length} FAIL` : "\nTẤT CẢ PASS");
process.exit(fails.length ? 1 : 0);
