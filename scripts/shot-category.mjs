// Chụp màn hình trạng thái active của sidebar (desktop) và chip (mobile)
import { chromium } from "playwright";
const b = await chromium.launch();

const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://127.0.0.1:4601/", { waitUntil: "networkidle" });
await p.locator("aside button").filter({ hasText: "Ảnh - Nano Banana" }).first().click();
await p.waitForTimeout(600);
await p.locator("aside .card").nth(1).screenshot({ path: "shots/cat-sidebar-active.png" });
console.log("sidebar:", await p.evaluate(() => location.search));
await p.close();

const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto("http://127.0.0.1:4601/", { waitUntil: "networkidle" });
await m.locator("div.lg\\:hidden button").filter({ hasText: "Video - ASMR" }).first().click();
await m.waitForTimeout(600);
await m.screenshot({ path: "shots/cat-mobile-chips.png" });
console.log("mobile:", await m.evaluate(() => location.search));
await m.close();
await b.close();
