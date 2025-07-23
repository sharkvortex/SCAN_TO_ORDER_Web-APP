type PaperSize = 58 | 76 | 80;

interface PrintTableQRCodeOptions {
  qrUrl: string;
  table: number;
  size?: PaperSize; // default เป็น 80mm
}

export const printTableQRCode = ({
  qrUrl,
  table,
  size = 80,
}: PrintTableQRCodeOptions) => {
  if (!qrUrl || !table) return;

  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = (now.getFullYear() + 543).toString().slice(-2);
  const formattedDate = `${day}/${month}/${year}`;
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const time = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedTime = `${time}:${seconds} น.`;

  const logoUrl =
    "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg";


  const sizeConfig = {
    58: {
      width: 58,
      height: 100,
      fontSize: "8pt",
      qrSize: "34mm",
      logoSize: "20mm",
      tableFontSize: "14pt",
    },
    76: {
      width: 76,
      height: 100,
      fontSize: "9pt",
      qrSize: "42mm",
      logoSize: "22mm",
      tableFontSize: "16pt",
    },
    80: {
      width: 80,
      height: 100,
      fontSize: "10pt",
      qrSize: "46mm",
      logoSize: "24mm",
      tableFontSize: "18pt",
    },
  };

  const config = sizeConfig[size] || sizeConfig[80]; // fallback เป็น 80mm

  const printWindow = window.open("", "_blank", "width=400,height=600");

  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500&family=Noto+Sans+Thai:wght@300;400;500&display=swap" rel="stylesheet">
          <title>QR โต๊ะ ${table}</title>
          <style>
  @page {
    size: ${config.width}mm ${config.height}mm;
    margin: 0;
  }

  html, body {
    width: ${config.width}mm;
    min-height: ${config.height}mm;
    margin: 0;
    padding: 0;
    overflow: hidden;
    page-break-inside: avoid;
    font-family: "Kanit", "Noto Sans Thai", sans-serif;
    text-align: center;
  }

  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 4mm 2mm;
    box-sizing: border-box;
  }

  .logo {
    width: ${config.logoSize};
    height: ${config.logoSize};
    object-fit: contain;
    margin-bottom: 3mm;
  }

  .datetime {
    font-size: ${config.fontSize};
    color: #555;
    margin-bottom: 2mm;
  }

  .qr {
    width: ${config.qrSize};
    height: ${config.qrSize};
    margin-bottom: 3mm;
    image-rendering: pixelated;
    border: 1px solid #eee;
  }

  .table {
    font-size: ${config.tableFontSize};
    font-weight: 500;
    margin-bottom: 3mm;
    color: #111;
  }

  .footer {
    font-size: 7pt;
    color: #666;
    margin-top: auto;
    padding-top: 2mm;
  }

  @media print {
    body {
      padding: 4mm 2mm;
    }
    .no-print {
      display: none !important;
    }
  }
</style>
        </head>
        <body>
          <img src="${logoUrl}" alt="โลโก้ร้าน" class="logo" />
          <div class="datetime">${formattedDate}</div>
          <div class="datetime">${formattedTime}</div>
          <img src="${qrUrl}" alt="QR โต๊ะ ${table}" class="qr" />
          <div class="table">โต๊ะ ${table}</div>
          <p class="footer">สแกน QR เพื่อสั่งอาหาร</p>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 200);

              window.onafterprint = function() {
                setTimeout(function() {
                  window.close();
                }, 300);
              };

              setTimeout(function() {
                if (!document.hidden) {
                  window.close();
                }
              }, 5000);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};
