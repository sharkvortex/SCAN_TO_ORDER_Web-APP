import type { tableType } from "@/types/tableType";
import type { OrderItem } from "@/types/ordersTypes";
import axios from "axios";

interface PrintBillProps {
  data: {
    orders: OrderItem[];
    totalAmount: number;
  };
  table: tableType;
  onSuccess: () => void;
}

export const printBill = async ({ data, table, onSuccess }: PrintBillProps) => {
  const promptpay = import.meta.env.VITE_PROMPT_PAY;
  const { orders, totalAmount } = data;
  const { orderId } = table;

  let qrCode = "";
  try {
    const response = await axios.get(
      `https://www.pp-qr.com/api/${promptpay}/${totalAmount}`,
    );
    if (response.status === 200) {
      qrCode = response.data.qrImage;
    }
  } catch (err) {
    console.error("สร้าง QR Code ไม่สำเร็จ", err);
  }

  const date = new Date().toLocaleString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const printWindow = window.open("", "_blank", "width=400,height=600");

  if (printWindow) {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "PRINT_DONE") {
        onSuccess();
        window.removeEventListener("message", handleMessage);
      }
    };
    window.addEventListener("message", handleMessage);

    printWindow.document.write(`
      <html>
        <head>
          <title>ใบเสร็จ</title>
          <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500&display=swap" rel="stylesheet">
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              font-family: "Kanit", sans-serif;
              width: 80mm;
              margin: 0;
              padding: 5mm;
              text-align: center;
            }
            h2 {
              margin: 0 0 5px 0;
              font-weight: 500;
            }
            .header {
              border-bottom: 1px dashed #000;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              margin-bottom: 10px;
            }
            td {
              padding: 2px 0;
            }
            .right {
              text-align: right;
            }
            .total-box {
              margin: 15px 0;
              padding: 10px;
              font-size: 16px;
              font-weight: bold;
            }
            .qrcode-section {
              margin: 15px 0;
              padding: 10px;
            }
            .qrcode-section img {
              width: 150px;
              height: 150px;
            }
            .qrcode-label {
              font-size: 13px;
              margin-top: 5px;
            }
            .footer {
              margin-top: 10px;
              font-size: 11px;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>ร้าน Example</h2>
            <div>เลขที่บิล: ${orderId}</div>
            <div>โต๊ะ: ${table.tableNumber}</div>
            <div>${date}</div>
          </div>

          <table>
            ${orders
              .map(
                (item) => `
                <tr>
                  <td>${item.foodName} x${item.quantity}</td>
                  <td class="right">${(item.quantity * item.foodPrice).toFixed(2)}</td>
                </tr>
              `,
              )
              .join("")}
          </table>

          <div class="total-box">ยอดชำระทั้งหมด: ${totalAmount.toFixed(2)} บาท</div>

          ${
            qrCode
              ? `
            <div class="qrcode-section">
              <img src="${qrCode}" alt="QR Code PromptPay"/>
              <div class="qrcode-label">สแกนเพื่อชำระเงิน รองรับทุกธนาคาร</div>
            </div>
          `
              : ""
          }

          <div class="footer">ขอบคุณที่ใช้บริการ</div>

          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
              }, 300);
              window.onafterprint = function() {
                // ส่งสัญญาณกลับไปยัง parent
                window.opener.postMessage("PRINT_DONE", "*");
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }
};
