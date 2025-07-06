import type { tableType } from "../../../../../Types/tableType";
import FoodList from "./FoodList";

interface AddOrderProps {
  table: tableType;
  onClose: () => void;
}

function AddOrder({ table, onClose }: AddOrderProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col border bg-white shadow-xl md:mx-auto md:my-8 md:h-[90vh] md:max-w-3xl md:rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-800">
          เพิ่มออเดอร์สำหรับโต๊ะ {table.tableNumber}
        </h2>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          ✕
        </button>
      </div>

      {/* Food List */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <FoodList />
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-4">
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-800 transition hover:bg-gray-200"
        >
          ปิดเมนู
        </button>
      </div>
    </div>
  );
}

export default AddOrder;
