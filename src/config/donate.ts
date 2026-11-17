/**
 * Single source of truth cho toàn bộ thông tin ủng hộ dự án.
 *
 * Nguyên tắc: KHÔNG hardcode thông tin thanh toán trong component.
 * Mọi giá trị lấy từ biến môi trường NEXT_PUBLIC_DONATE_* (xem .env.example).
 * Giá trị nào chưa cấu hình thì để chuỗi rỗng — component tự ẩn, KHÔNG render
 * dữ liệu giả (tên chủ TK / STK / SĐT mẫu) để tránh người dùng chuyển khoản nhầm.
 */

export interface DonateBank {
  /** Mã BIN ngân hàng theo danh mục NAPAS 123, ví dụ "970436" cho Vietcombank. */
  bankId: string
  bankName: string
  accountName: string
  accountNumber: string
  /** Đường dẫn ảnh QR trong /public, ví dụ "/images/qr-vietcombank.png". */
  qrImage: string
  /** Nội dung chuyển khoản gợi ý, ví dụ "UNG HO PROMPT VIET". */
  transferNote: string
}

export interface DonateWallet {
  name: string
  phone: string
  qrImage: string
}

export interface DonateLinks {
  buyMeACoffee: string
  koFi: string
  githubSponsors: string
}

/**
 * Next.js chỉ inline `process.env.NEXT_PUBLIC_*` khi được truy cập bằng literal
 * (không dùng `process.env[biến]` động) — nếu không, client bundle sẽ luôn rỗng
 * và giao diện hiển thị nhánh "chưa cấu hình" dù đã set env lúc build.
 */
const ENV = {
  bankId: process.env.NEXT_PUBLIC_DONATE_BANK_ID,
  bankName: process.env.NEXT_PUBLIC_DONATE_BANK_NAME,
  accountName: process.env.NEXT_PUBLIC_DONATE_ACCOUNT_NAME,
  accountNumber: process.env.NEXT_PUBLIC_DONATE_ACCOUNT_NUMBER,
  bankQr: process.env.NEXT_PUBLIC_DONATE_BANK_QR,
  transferNote: process.env.NEXT_PUBLIC_DONATE_TRANSFER_NOTE,
  momoName: process.env.NEXT_PUBLIC_DONATE_MOMO_NAME,
  momoPhone: process.env.NEXT_PUBLIC_DONATE_MOMO_PHONE,
  momoQr: process.env.NEXT_PUBLIC_DONATE_MOMO_QR,
  buyMeACoffee: process.env.NEXT_PUBLIC_DONATE_BMAC_URL,
  koFi: process.env.NEXT_PUBLIC_DONATE_KOFI_URL,
  githubSponsors: process.env.NEXT_PUBLIC_DONATE_GITHUB_SPONSORS_URL,
  notice: process.env.NEXT_PUBLIC_DONATE_NOTICE,
}

const str = (value: string | undefined): string => (typeof value === "string" ? value.trim() : "")

/**
 * Thông tin nhận ủng hộ mặc định của chủ dự án. Env NEXT_PUBLIC_DONATE_* vẫn
 * override được (ví dụ khi deploy bản fork), nhưng bản chính thức luôn hiển thị
 * đúng tài khoản dù môi trường build không set biến nào.
 * Sacombank BIN theo NAPAS 123: 970403 — dùng để sinh ảnh VietQR.
 */
const DEFAULT_BANK: DonateBank = {
  bankId: "970403",
  bankName: "Sacombank",
  accountName: "DANG DUC TY",
  accountNumber: "0501 1897 2306",
  qrImage: "",
  transferNote: "UNG HO PROMPT VIET",
}

const rawBank: DonateBank = {
  bankId: str(ENV.bankId) || DEFAULT_BANK.bankId,
  bankName: str(ENV.bankName) || DEFAULT_BANK.bankName,
  accountName: str(ENV.accountName) || DEFAULT_BANK.accountName,
  accountNumber: str(ENV.accountNumber) || DEFAULT_BANK.accountNumber,
  qrImage: str(ENV.bankQr),
  transferNote: str(ENV.transferNote) || DEFAULT_BANK.transferNote,
}

const rawWallet: DonateWallet = {
  name: str(ENV.momoName),
  phone: str(ENV.momoPhone),
  qrImage: str(ENV.momoQr),
}

/** Bỏ khoảng trắng/dấu gạch khi copy STK hoặc SĐT. */
const digits = (value: string): string => value.replace(/[\s.-]/g, "")

/** Link VietQR tạo ảnh QR thật từ STK — chỉ khả dụng khi có đủ STK + mã BIN. */
export const buildVietQRUrl = (bank: DonateBank): string => {
  const id = bank.bankId.trim()
  const account = digits(bank.accountNumber)
  if (!id || !account) return ""
  return `https://img.vietqr.io/image/${id}-${account}-compact2.png`
}

/** Ảnh QR hiển thị: ưu tiên file local trong /public, fallback về VietQR. */
const bankQrImage = (bank: DonateBank): string => {
  if (bank.qrImage) return bank.qrImage
  return buildVietQRUrl(bank)
}

export const donateBank: DonateBank = rawBank

export const donateWallet: DonateWallet = rawWallet

export const donateLinks: DonateLinks = {
  buyMeACoffee: str(ENV.buyMeACoffee),
  koFi: str(ENV.koFi),
  githubSponsors: str(ENV.githubSponsors),
}

export const donateNotice: string = str(ENV.notice)

/** Chỉ coi là đã cấu hình khi có đủ thông tin định danh tài khoản. */
export const hasBankInfo = (): boolean =>
  Boolean(rawBank.bankName && rawBank.accountName && digits(rawBank.accountNumber))

/**
 * Ví điện tử coi là đã cấu hình khi có ảnh QR — hoặc khi có đủ tên + SĐT
 * (trường hợp không dùng ảnh QR mà chỉ chuyển tay theo SĐT).
 * Cho phép cấu hình QR-only: người dùng chỉ muốn hiện mã, không hiện tên/SĐT.
 */
export const hasWalletInfo = (): boolean =>
  Boolean(rawWallet.qrImage || (rawWallet.name && digits(rawWallet.phone)))


export const hasAnyDonationMethod = (): boolean =>
  hasBankInfo() || hasWalletInfo() || Boolean(donateLinks.buyMeACoffee || donateLinks.koFi || donateLinks.githubSponsors)

/** QR ngân hàng: ảnh local nếu có, nếu không thì sinh từ VietQR. */
export const bankQrSrc = (): string => {
  if (!hasBankInfo()) return ""
  return bankQrImage(rawBank)
}

export const walletQrSrc = (): string => {
  if (!hasWalletInfo()) return ""
  return rawWallet.qrImage
}

/** Thông tin in dưới ảnh QR ngân hàng. */
export const bankInfoLines = (): string[] => {
  if (!hasBankInfo()) return []
  return [
    `Chủ TK: ${rawBank.accountName}`,
    `Số TK: ${rawBank.accountNumber}`,
    `Ngân hàng: ${rawBank.bankName}`,
  ]
}

export const walletInfoLines = (): string[] => {
  if (!hasWalletInfo()) return []
  const lines: string[] = []
  if (rawWallet.name) lines.push(`Tên: ${rawWallet.name}`)
  if (digits(rawWallet.phone)) lines.push(`SĐT: ${rawWallet.phone}`)
  return lines
}