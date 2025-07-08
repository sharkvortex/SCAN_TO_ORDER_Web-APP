import type { tableType } from "../../../../../Types/tableType";
import FoodList from "./FoodList";
import { X } from "lucide-react";

interface AddOrderProps {
  table: tableType;
  onClose: () => void;
}

function AddOrder({ table, onClose }: AddOrderProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">
          เพิ่มออเดอร์โต๊ะ <span>{table.tableNumber}</span>
        </h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-500 transition-all hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <FoodList table={table} />
      </div>

      <div className="p-2">
        <button
          onClick={onClose}
          className="w-full rounded-lg bg-gray-300 py-3 font-medium text-white transition-all outline-none hover:cursor-pointer hover:bg-gray-200"
        >
          ปิดเมนู
        </button>
      </div>
    </div>
  );
}

export default AddOrder;
