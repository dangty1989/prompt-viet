import { QRCodeItem } from "@/components/QRCodeItem"
import { donateBank, donateNotice, bankInfoLines, bankQrSrc, walletInfoLines, walletQrSrc, hasBankInfo, hasWalletInfo } from "@/config/donate"

export function SupportQRServer() {
  const bankReady = hasBankInfo()
  const walletReady = hasWalletInfo()

  // Chưa cấu hình thông tin nhận ủng hộ: không render gì thay vì hiện ảnh QR vỡ.
  if (!bankReady && !walletReady) {
    return (
      <section className="bg-card py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md rounded-lg border border-dashed border-border bg-muted p-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {donateNotice ||
                "Thông tin nhận ủng hộ (số tài khoản, mã QR) đang được cập nhật. Trong lúc chờ, bạn có thể đóng góp bằng cách chia sẻ hoặc góp ý prompt mới."}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-card py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
          Mã QR chuyển khoản
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-md mx-auto">
          {bankReady && (
            <QRCodeItem title={donateBank.bankName || "Chuyển khoản ngân hàng"} qrSrc={bankQrSrc()} info={bankInfoLines()} />
          )}
          {walletReady && <QRCodeItem title="MoMo / ZaloPay" qrSrc={walletQrSrc()} info={walletInfoLines()} />}
        </div>
      </div>
    </section>
  )
}