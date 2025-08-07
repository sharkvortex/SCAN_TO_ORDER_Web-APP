import React, { useState, useEffect } from "react";
import { X, Receipt, CheckCircle } from "lucide-react";
import Loader from "@/components/UI/Load/Loading";
import CheckBillItem from "./CheckBillItem";
import type { tableType } from "@/types/tableType";
import { useGetCheckBill } from "@/hooks/Admin/useGetCheckBill";
import MethodPay from "./MedthodPay";

interface CheckBillProps {
  table: tableType;
  onClose: () => void;
}

function CheckBill({ table, onClose }: CheckBillProps) {
  const { loading, checkBillItems, getCheckBill } = useGetCheckBill();
  const [showPayMethod, setShowPayMethod] = useState(false);

  const fetchCheckBill = async () => {
    if (table) {
      await getCheckBill(table.tableNumber);
    }
  };

  useEffect(() => {
    fetchCheckBill();
  }, [table.tableNumber]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
        <Loader />
      </div>
    );
  }

  if (!checkBillItems) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex min-h-screen flex-col justify-between bg-gray-50">
      
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
            onClick={() => setShowPayMethod(true)} 
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 p-4 font-semibold text-white transition hover:cursor-pointer hover:bg-green-700 active:scale-95"
          >
            <CheckCircle size={20} />
            ชำระเงิน / เช็คบิล
          </button>

          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-gray-200 p-4 font-medium text-gray-600 transition hover:cursor-pointer hover:bg-gray-300 active:scale-95"
          >
            ปิดเมนู
          </button>
        </div>
      </div>

     
      {showPayMethod && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 bg-opacity-50 p-4">
          <MethodPay onClose={() => setShowPayMethod(false)} />
        </div>
      )}
    </>
  );
}

export default CheckBill;
