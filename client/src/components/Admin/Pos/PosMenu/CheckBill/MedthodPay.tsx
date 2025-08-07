import React from "react";
import { DollarSign, } from "lucide-react";
import { QrCode } from "lucide-react";
interface MethodPayProps {
  onClose: () => void;
  onSelectPayment?: (method: "qr" | "cash") => void; // เพิ่ม callback เวลาคลิกเลือกช่องทางจ่าย
}

function MethodPay({ onClose, onSelectPayment }: MethodPayProps) {
  return (
    <div className="relative flex flex-col max-w-3xl w-full bg-white rounded-xl shadow-2xl p-8 gap-8">
      
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        เลือกวิธีชำระเงิน
      </h2>

      <div className="flex gap-8">

        <button
          type="button"
          onClick={() => onSelectPayment?.("qr")}
          className="flex-1 hover:cursor-pointer flex flex-col items-center gap-6 rounded-xl border border-gray-300 bg-indigo-50 p-8 text-indigo-700 shadow-md active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          <QrCode size={64} />
          <h3 className="text-xl font-semibold">ชำระผ่าน QR Code</h3>
          
          <p className="text-center text-indigo-700">
            สแกน QR Code เพื่อชำระเงินผ่านแอปธนาคาร
          </p>
        </button>

        
        <button
          type="button"
          onClick={() => onSelectPayment?.("cash")}
          className="flex-1 hover:cursor-pointer flex flex-col items-center gap-6 rounded-xl border border-gray-300 bg-green-50 p-8 text-green-700 shadow-md active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          <DollarSign size={64} />
          <h3 className="text-xl font-semibold">ชำระด้วยเงินสด</h3>
          <p className="text-center text-green-700">
            รับเงินสดจากลูกค้าโดยตรง
          </p>
        </button>
      </div>

    
      <button
        onClick={onClose}
        className=" mt-4 hover:cursor-pointer  rounded-full bg-gray-100 px-6 py-3 text-gray-600 font-semibold transition hover:bg-gray-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-300"
      >
        ปิดเมนู
      </button>
    </div>
  );
}

export default MethodPay;
