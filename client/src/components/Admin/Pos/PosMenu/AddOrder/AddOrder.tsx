import FloatingIcon from "./FloatingIcon";
import { useState } from "react";
import type { tableType } from "../../../../../Types/tableType";
import type { Food } from "../../../../../Types/food";
import FoodList from "./FoodList";
import { X } from "lucide-react";

function AddOrder({
  table,
  onClose,
}: {
  table: tableType;
  onClose: () => void;
}) {
  const [orderItems, setOrderItems] = useState<Food[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleAddFood = (food: Food) => {
    setOrderItems((prev) => [...prev, food]);
  };

  const handleRemoveFood = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log("ส่งออเดอร์:", orderItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">
          เพิ่มออเดอร์โต๊ะ{" "}
          <span className="text-indigo-600">{table.tableNumber}</span>
        </h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <FoodList onAddFood={handleAddFood} />
      </div>

      {/* Floating Cart Icon */}
      <FloatingIcon onClick={() => setIsPanelOpen(!isPanelOpen)} />

      {/* Floating Panel */}
      {isPanelOpen && (
        <div className="fixed right-4 bottom-24 z-50 flex max-h-[60vh] w-80 flex-col justify-between overflow-hidden rounded-xl border bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">ออเดอร์</h3>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4 flex-1 space-y-2 overflow-y-auto pr-1">
            {orderItems.length === 0 ? (
              <p className="text-sm text-gray-400">ยังไม่ได้เลือกอาหาร</p>
            ) : (
              orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded bg-gray-100 px-3 py-2"
                >
                  <span className="text-sm">{item.name}</span>
                  <button
                    onClick={() => handleRemoveFood(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={orderItems.length === 0}
            className="w-full rounded-lg bg-green-500 py-2 text-white hover:bg-green-600 disabled:opacity-50"
          >
            ✅ ยืนยันออเดอร์
          </button>
        </div>
      )}
    </div>
  );
}

export default AddOrder;
