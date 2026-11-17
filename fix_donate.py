import re
F = "src/config/donate.ts"
with open(F, encoding="utf-8") as f:
    t = f.read()

old_str = 'const str = (value: string | undefined): string => (typeof value === "string" ? value.trim() : "")'
new_str = '''const str = (value: string | undefined): string => (typeof value === "string" ? value.trim() : "")

/**
 * Th\u00f4ng tin nh\u1eadn \u00f9ng h\u1ed3 m\u1ea5c \u0111\u1ecbnh c\u1ee7a ch\u1ee7 d\u1ef1 \u00e1n. Env NEXT_PUBLIC_DONATE_* v\u1eadn
 * override \u0111\u01b0\u1ee3c (v\u00ed d\u1ee5 khi deploy b\u1ea3n fork), nh\u01b0ng b\u1ea3n ch\u00ednh th\u1ee9c lu\u00f4n hi\u1ec3n th\u1ecb
 * \u0111\u00fang t\u00e0i kho\u1ea3n d\u00f9 m\u00f4i tr\u01b0\u1eddi\u1ecng build kh\u00f4ng set bi\u1ebfn n\u00e0o.
 * Sacombank BIN theo NAPAS 123: 970403 \u2014 d\u00f9ng \u0111\u1ec3 sinh \u1ea3nh VietQR.
 */
const DEFAULT_BANK: DonateBank = {
  bankId: "970403",
  bankName: "Sacombank",
  accountName: "DANG DUC TY",
  accountNumber: "0501 1897 2306",
  qrImage: "",
  transferNote: "UNG HO PROMPT VIET",
}'''
t = t.replace(old_str, new_str)

old_bank = '''const rawBank: DonateBank = {
  bankId: str(ENV.bankId),
  bankName: str(ENV.bankName),
  accountName: str(ENV.accountName),
  accountNumber: str(ENV.accountNumber),
  qrImage: str(ENV.bankQr),
  transferNote: str(ENV.transferNote) || "UNG HO PROMPT VIET",
}'''
new_bank = '''const rawBank: DonateBank = {
  bankId: str(ENV.bankId) || DEFAULT_BANK.bankId,
  bankName: str(ENV.bankName) || DEFAULT_BANK.bankName,
  accountName: str(ENV.accountName) || DEFAULT_BANK.accountName,
  accountNumber: str(ENV.accountNumber) || DEFAULT_BANK.accountNumber,
  qrImage: str(ENV.bankQr),
  transferNote: str(ENV.transferNote) || DEFAULT_BANK.transferNote,
}'''
t = t.replace(old_bank, new_bank)

with open(F, "w", encoding="utf-8") as f:
    f.write(t)
print("done")
