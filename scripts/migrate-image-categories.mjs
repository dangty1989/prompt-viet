// Tách nhóm prompt ảnh (GPT Image / Nano Banana / ASMR) + merge bộ Nano Banana mới
// Chạy: node scripts/migrate-image-categories.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dataFile = path.join(root, "src/data/prompts.json");
const nanoFile = path.join(root, "scripts/data/nano-banana.vi.json");

const CAT_GPT = "Ảnh - GPT Image";
const CAT_NANO = "Ảnh - Nano Banana";
const CAT_ASMR = "Video - ASMR";

const prompts = JSON.parse(fs.readFileSync(dataFile, "utf8"));
const nano = JSON.parse(fs.readFileSync(nanoFile, "utf8"));

const stats = { gpt: 0, nanoExisting: 0, asmr: 0, misc: 0 };

for (const p of prompts) {
  if (p.id.startsWith("gptimg-")) {
    p.category = CAT_GPT;
    stats.gpt++;
    continue;
  }
  const isAsmr = (p.tags || []).some((t) => /asmr/i.test(t));
  if (p.id.startsWith("vn-") && isAsmr) {
    p.category = CAT_ASMR;
    stats.asmr++;
    continue;
  }
  // Prompt ảnh/chỉnh ảnh của Gemini (figurine, diorama, studio, isometric, ảnh thẻ...)
  const isGeminiImage =
    p.platform === "Gemini" &&
    !isAsmr &&
    (p.category === "Sản xuất" || (p.tags || []).some((t) => /ảnh|3d|diorama|avatar|sticker/i.test(t)));
  if (p.id.startsWith("vn-") && isGeminiImage) {
    p.category = CAT_NANO;
    if (!p.tags.includes("nano-banana")) p.tags.push("nano-banana");
    stats.nanoExisting++;
    continue;
  }
  if (p.id === "workspace-gemini-meeting-notes") {
    p.category = "Công việc";
    stats.misc++;
  }
}

// Merge bộ Nano Banana tiếng Việt mới (không trùng id)
const existingIds = new Set(prompts.map((p) => p.id));
const added = nano.filter((p) => !existingIds.has(p.id));
const merged = prompts.filter((p) => p.category !== "Sản xuất").concat(added);

// Nhóm ảnh lên đầu, xen kẽ GPT Image / Nano Banana để cả hai đều thấy ở trang 1
const gptList = merged.filter((p) => p.category === CAT_GPT);
const nanoList = merged.filter((p) => p.category === CAT_NANO);
const head = [];
for (let i = 0; i < Math.max(gptList.length, nanoList.length); i++) {
  if (gptList[i]) head.push(gptList[i]);
  if (nanoList[i]) head.push(nanoList[i]);
}
head.push(...merged.filter((p) => p.category === CAT_ASMR));
const tail = merged.filter((p) => ![CAT_GPT, CAT_NANO, CAT_ASMR].includes(p.category));

const out = head.concat(tail);
fs.writeFileSync(dataFile, JSON.stringify(out, null, 2) + "\n", "utf8");

console.log("đã gán GPT Image:", stats.gpt);
console.log("Gemini image -> Nano Banana:", stats.nanoExisting);
console.log("ASMR:", stats.asmr);
console.log("thêm mới Nano Banana:", added.length);
console.log("tổng prompt:", out.length);
const cats = {};
for (const p of out) cats[p.category] = (cats[p.category] || 0) + 1;
console.log("categories:", cats);
