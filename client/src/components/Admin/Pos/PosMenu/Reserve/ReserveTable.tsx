import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { isAxiosError } from "axios";
import axios from "@/utils/axios";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";

interface ReserveTableProps {
  tableNumber?: number;
  onClose: () => void;
  onSuccess: () => void;
}

function ReserveTable({ tableNumber, onClose, onSuccess }: ReserveTableProps) {
  const [note, setNote] = useState("");
  const [confirm, setConfirm] = useState<boolean>(false);

  const handleConfirm = async () => {
    if (!note.trim()) {
      return toast.error("กรอกหมายเหตุเพิ่มเติม");
    }
    if (!tableNumber) {
      return toast.error("ไม่ทราบโต๊ะที่จองลองใหม่อีกครั้ง");
    }
    try {
      const response = await axios.patch("/reserve", {
        tableNumber,
        note,
      });
      if (response.status === 200) {
        toast.success(`จองโต๊ะ: ${tableNumber} สำเร็จ`);
        setNote("");
        setConfirm(false);
        onClose();
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        if (error.response?.data.code === "TABLE_NOT_AVAILABLE") {
          return toast.error("โต๊ะไม่ว่างหรือถูกจองแล้ว");
        }
      }
      toast.error("เกิดข้อผิดพลาดการจองลองใหม่ภายหลัง");
    }
  };

  return (
    <>
      {confirm && (
        <ConfirmDialog
          title={`ยืนยันการจองโต๊ะ ${tableNumber}`}
          description="ต้องการจองโต๊ะใช่หรือไม่?"
          type="success"
          cancelText="ยกเลิก"
          confirmText="ยืนยันการจอง"
          onCancel={() => setConfirm(false)}
          onConfirm={() => handleConfirm()}
        />
      )}

      <div className="fixed inset-0 z-49 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="flex min-h-[450px] w-full max-w-md flex-col rounded-2xl bg-white p-6"
        >
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
            จองโต๊ะ: {tableNumber}
          </h2>

          <form className="flex flex-1 flex-col justify-between space-y-6">
            <div className="flex-1">
              <label
                htmlFor="note"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                หมายเหตุเพิ่มเติม
              </label>
              <textarea
                id="note"
                rows={5}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="ชื่อลูกค้า เบอร์มือถือ (ถ้ามี)"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-800 outline-0 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setConfirm(true)}
                className="w-full rounded-xl bg-green-600 py-2.5 font-semibold text-white shadow transition hover:cursor-pointer hover:bg-green-700 active:scale-95"
              >
                จองโต๊ะ
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl py-2.5 font-semibold text-gray-500 shadow transition hover:cursor-pointer hover:bg-gray-100 active:scale-95"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default ReserveTable;
