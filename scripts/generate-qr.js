const QRCode = require('qrcode');

async function generateQR(text, filename) {
  const svg = await QRCode.toString(text, {
    type: 'svg',
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
  require('fs').writeFileSync(filename, svg);
  console.log(`Generated ${filename}`);
}

generateQR('VIETCOMBANK|1234567890|NGUYEN VAN A|UNG HO PROMPT VIET', 'public/images/qr-vietcombank.svg');
generateQR('MOMO|0901234567|NGUYEN VAN A|UNG HO PROMPT VIET', 'public/images/qr-momo.svg');