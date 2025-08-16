import { useState, useEffect } from "react";
import { X, Receipt, CheckCircle } from "lucide-react";
import Loader from "@/components/UI/Load/Loading";
import CheckBillItem from "./CheckBillItem";
import { printBill } from "./printBill";
import type { tableType } from "@/types/tableType";
import { useGetCheckBill } from "@/hooks/Admin/useGetCheckBill";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import { getStatusBill, changeStatusBill } from "@/hooks/Admin/useStatusBill";

import money_sound from "@/assets/sounds/money_sound.aac";
import toast from "react-hot-toast";
interface CheckBillProps {
  table: tableType;
  onClose: () => void;
  onSuccess: () => void;
}

function CheckBill({ table, onClose, onSuccess }: CheckBillProps) {
  const { loading, checkBillItems, getCheckBill } = useGetCheckBill();
  const [checkBill, setCheckBill] = useState<boolean>(false);
  const [onpaid, setOnPaid] = useState<boolean>(false);
  const [billStatus, setBillStatus] = useState<string | null>(null);

  const checkBillStatus = async (orderId: string) => {
    if (!orderId) return;
    try {
      const status = await getStatusBill(orderId);
      setBillStatus(status.status);
    } catch (error) {
      console.error("Error checking bill status:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!table?.tableNumber) return;

      try {
        await getCheckBill(table.tableNumber);

        if (table.orderId) {
          await checkBillStatus(table.orderId);
        }
      } catch (error) {
        console.error("Error fetching bill data:", error);
      }
    };

    fetchData();
  }, [table]);

  if (loading || !checkBillItems) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
        <Loader />
      </div>
    );
  }

  const playSoundMoney = async () => {
    try {
      const soundMoney = new Audio(money_sound);
      await soundMoney.play();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  return (
    <>
      {checkBill && (
        <ConfirmDialog
          title="พิมพ์ใบเสร็จ"
          description="กดยืนยันเพื่อพิมพ์ใบเสร็จ"
          confirmText="ยืนยัน"
          type="success"
          onCancel={() => setCheckBill(false)}
          onConfirm={async () => {
            await printBill({
              data: {
                orders: checkBillItems?.orders ?? [],
                totalAmount: checkBillItems?.totalAmount ?? 0,
              },
              table,
              onSuccess: async () => {
                await changeStatusBill(table.orderId, "PAYING");
                if (table.orderId) checkBillStatus(table.orderId);
              },
            });
            setCheckBill(false);
          }}
        />
      )}

      {onpaid && (
        <ConfirmDialog
          title="ยืนยันการชำระเงิน"
          description="ลูกค้าได้ทำการชำระเงินแล้ว?"
          confirmText="ยืนยัน"
          type="success"
          onCancel={() => setOnPaid(false)}
          onConfirm={async () => {
            await changeStatusBill(table.orderId, "PAID");
            if (table.orderId) checkBillStatus(table.orderId);
            setOnPaid(false);
            playSoundMoney();
            toast.success(`ชำระเงินโต๊ะ ${table.tableNumber} สำเร็จ`);
            onSuccess();
          }}
        />
      )}

      <div className="fixed inset-0 z-49 flex min-h-screen flex-col justify-between bg-gray-50">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-700">
            <Receipt className="text-green-500" size={24} />
            เช็คบิล โต๊ะ {table.tableNumber}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <CheckBillItem data={checkBillItems} />
        </div>

        <div className="space-y-3 bg-white px-6 py-4">
          <button
            onClick={() => setCheckBill(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 p-4 font-semibold text-white transition hover:cursor-pointer hover:bg-green-700 active:scale-95"
          >
            <CheckCircle size={20} />
            {billStatus === "PENDING"
              ? "พิมพ์ใบเสร็จ/ชำระเงิน"
              : "พิมพ์ใบเสร็จอีกครั้ง"}
          </button>

          {billStatus === "PAYING" && (
            <button
              onClick={() => setOnPaid(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 p-4 font-semibold text-white transition hover:cursor-pointer hover:bg-blue-700 active:scale-95"
            >
              <CheckCircle size={20} />
              ยืนยันการชำระเงิน
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-gray-200 p-4 font-medium text-gray-600 transition hover:cursor-pointer hover:bg-gray-300 active:scale-95"
          >
            ปิดเมนู
          </button>
        </div>
      </div>
    </>
  );
}

export default CheckBill;
