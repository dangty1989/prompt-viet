const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const failedRequests = [];
  page.on('response', resp => {
    if (resp.status() >= 400) failedRequests.push(`${resp.status()} ${resp.url()}`);
  });

  console.log('Navigating to http://localhost:3000...');
  const response = await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`Main page status: ${response.status()}`);

  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'playwright-home.png', fullPage: true });
  console.log('\nScreenshot saved to playwright-home.png');

  console.log(`\nConsole errors (${consoleErrors.length}):`);
  consoleErrors.forEach(e => console.log(`  ${e}`));

  console.log(`\nFailed requests (${failedRequests.length}):`);
  failedRequests.slice(0, 10).forEach(f => console.log(`  ${f}`));

  await browser.close();
})();