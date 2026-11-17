This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Cấu hình ủng hộ dự án (donate)

Toàn bộ thông tin thanh toán nằm ở `src/config/donate.ts`, đọc từ biến môi trường
(`NEXT_PUBLIC_DONATE_*`). Xem mẫu ở [.env.example](.env.example).

Quy tắc quan trọng:

- Chưa set env -> khối QR và các card Buy Me a Coffee / Ko-fi / MoMo tự ẩn,
  thay bằng thông báo "đang được cập nhật". Không bao giờ hiện STK/tên giả.
- Đã set env -> QR ngân hàng được sinh tự động từ VietQR bằng STK + bankId
  (`https://img.vietqr.io/image/{bankId}-{soTK}-compact2.png`), không cần upload ảnh.
  Muốn dùng ảnh riêng thì set `NEXT_PUBLIC_DONATE_BANK_QR=/images/qr-bank.png`
  và đặt file vào `public/images/`.
- MoMo: set `NEXT_PUBLIC_DONATE_MOMO_QR` nếu có ảnh QR; nếu chỉ có SĐT thì khối QR
  của MoMo hiện "Chưa có mã QR" và người dùng copy SĐT (không hiện ảnh vỡ).
- Khi deploy lên Cloudflare Pages, khai báo các biến này trong
  Settings > Environment variables (Production/Preview) rồi build lại.

## Cấu hình khác (contact / social / survey)

- `NEXT_PUBLIC_GITHUB_REPO_URL`: thay link github.com mặc định ở footer.
- `NEXT_PUBLIC_CONTACT_EMAIL`: thay `you@example.com`; để trống thì link liên hệ tự ẩn.
- `NEXT_PUBLIC_DONATE_BMAC_URL` / `NEXT_PUBLIC_DONATE_KOFI_URL` / `NEXT_PUBLIC_DONATE_GITHUB_SPONSORS_URL`:
  để trống thì nút tương ứng tự ẩn.
- `NEXT_PUBLIC_SURVEY_FORM_URL`: link Google Form khảo sát prompt (forms.gle/...).
  Để trống hoặc link không hợp lệ thì khối khảo sát không render (tránh iframe trắng).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
