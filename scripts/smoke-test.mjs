// Smoke test bản static export: trang chủ, phân trang, lọc danh mục, detail page ngách, dark mode.
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:4182/";
const b = await chromium.launch();
const fails = [];
const ok = (cond, msg, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${msg}${extra ? " — " + extra : ""}`);
  if (!cond) fails.push(msg);
};

const cardSel = "#prompt-grid a[href^='/prompt/']";

// ---------- Desktop ----------
{
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(BASE, { waitUntil: "networkidle" });
  await p.waitForTimeout(400);

  const cards = await p.$$eval(cardSel, (e) => e.length);
  ok(cards === 50, "trang chủ render 50 card (trang 1)", `cards=${cards}`);
  const stat = await p.textContent("text=Prompt có sẵn >> xpath=..");
  ok(/345/.test(stat ?? ""), "stats bar hiện 345 prompt", (stat ?? "").replace(/\s+/g, " "));

  // load more
  const loadMore = p.locator("button", { hasText: "Xem thêm" }).first();
  await loadMore.click();
  await p.waitForTimeout(300);
  const cards2 = await p.$$eval(cardSel, (e) => e.length);
  ok(cards2 === 100, "Xem thêm -> 100 card", `cards=${cards2}`);

  // lọc theo danh mục mới (Sức khoẻ, 16 prompt)
  const chip = p.locator("aside button").filter({ hasText: "Sức khoẻ" }).first();
  await chip.click();
  await p.waitForTimeout(350);
  const after = await p.$$eval(cardSel, (e) => e.length);
  const counter = (await p.textContent(".search-filter p.body-sm"))?.replace(/\s+/g, " ").trim();
  ok(after === 16, "lọc 'Sức khoẻ' -> 16 card", `cards=${after}`);
  ok(/16 \/ 345/.test(counter ?? ""), "counter hiện 16 / 345", counter);
  ok(new URL(p.url()).searchParams.get("category") === "Sức khoẻ", "URL có ?category=Sức khoẻ");

  // deep link ?category=
  await p.goto(BASE + "?category=" + encodeURIComponent("Bất động sản"), { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  const bds = await p.$$eval(cardSel, (e) => e.length);
  ok(bds === 16, "deep link ?category=Bất động sản -> 16 card", `cards=${bds}`);

  // detail page ngách
  await p.goto(BASE + "prompt/xaydung-vi-1/", { waitUntil: "networkidle" });
  const h1 = (await p.textContent("h1"))?.trim();
  const hasCopy = await p.locator("button", { hasText: /Copy|Sao chép/ }).count();
  ok(h1 && h1 !== "Error response", "detail /prompt/xaydung-vi-1 render đúng", h1);
  ok(hasCopy > 0, "detail page có nút copy", `buttons=${hasCopy}`);

  // dark mode toggle + persist
  await p.goto(BASE, { waitUntil: "networkidle" });
  await p.waitForTimeout(300);
  const before = await p.evaluate(() => document.documentElement.className);
  await p.locator("button[aria-label*='giao diện'], button[aria-label*='theme'], button[aria-label*='Sáng'], button[aria-label*='Tối']").first().click();
  await p.waitForTimeout(250);
  const afterDark = await p.evaluate(() => ({
    cls: document.documentElement.className,
    stored: localStorage.getItem("theme"),
  }));
  ok(before !== afterDark.cls || afterDark.stored, "dark mode toggle đổi theme + lưu localStorage", JSON.stringify(afterDark));

  ok(errs.length === 0, "không có lỗi JS console", errs.join(" | "));

  // Blog link (tyauto.name.vn) phải xuất hiện ở navbar + footer
  const blogLinks = await p.$$eval("a[href='https://tyauto.name.vn']", (els) =>
    els.map((e) => e.textContent?.trim() || e.getAttribute("aria-label") || "")
  );
  ok(blogLinks.length >= 2, "có link Blog tyauto.name.vn (navbar + footer)", JSON.stringify(blogLinks));
  await p.close();
}

// ---------- Mobile ----------
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await p.goto(BASE, { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  const chipVisible = await p.locator("#category-chips").isVisible();
  ok(chipVisible, "mobile: hàng chip danh mục hiển thị");
  const chip = p.locator("#category-chips button").filter({ hasText: "Nội thất" }).first();
  await chip.click();
  await p.waitForTimeout(350);
  const cards = await p.$$eval(cardSel, (e) => e.length);
  ok(cards === 16, "mobile: chip 'Nội thất' -> 16 card", `cards=${cards}`);
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(overflow <= 1, "mobile: không tràn ngang", `overflow=${overflow}px`);
  await p.close();
}

await b.close();
console.log(fails.length ? `\n${fails.length} FAIL` : "\nALL PASS");
process.exit(fails.length ? 1 : 0);
