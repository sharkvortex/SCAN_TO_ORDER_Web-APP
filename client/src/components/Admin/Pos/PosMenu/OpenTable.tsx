import { BsQrCode } from "react-icons/bs";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCreateQrcode } from "../../../../hooks/Admin/useCreateQrcode";
import { printTableQRCode } from "./PrintQRCodeForm";

interface OpenTableProps {
  onClose: () => void;
  onSuccess: () => void;
  table: number;
}

function OpenTable({ onClose, table, onSuccess }: OpenTableProps) {
  const { createQrcode } = useCreateQrcode();
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handlerClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handlerCreateQr = async (tableNumber: number) => {
    try {
      const qrUrl = await createQrcode(tableNumber); // ถ้า error จะถูก interceptor แจ้ง toast
      if (qrUrl) {
        onSuccess();
        await printTableQRCode({ qrUrl, table: tableNumber });
        setIsVisible(false);
      }
    } catch (error) {
      console.error("Failed to create QR or print:", error);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
        >
          <motion.div
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 10, opacity: 0 }}
            className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              QR Code สำหรับโต๊ะ {table}
            </h2>

            <button
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-lg font-semibold text-white shadow transition-all duration-200 hover:cursor-pointer"
              onClick={() => handlerCreateQr(table)}
            >
              <BsQrCode className="text-2xl" />
              สร้าง QR Code
            </button>

            <button
              className="w-full rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition hover:cursor-pointer hover:bg-gray-100"
              onClick={handlerClose}
            >
              ยกเลิก
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OpenTable;
