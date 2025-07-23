import { useState } from "react";
import type { tableType } from "@/types/tableType";
import type { Food } from "@/types/food";
import FoodList from "./FoodList";
import { X } from "lucide-react";
import ListAddOrder from "./ListAddOrder";

type OrderItem = Food & {
  quantity: number;
  note: string;
};

function AddOrder({
  table,
  onClose,
}: {
  table: tableType;
  onClose: () => void;
}) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const handleAddFood = (food: Food) => {
    setOrderItems((prev) => {
      const index = prev.findIndex(
        (item) => item.id === food.id && item.note.trim() === "",
      );

      if (index !== -1) {
        const updated = [...prev];
        updated[index].quantity += 1;
        return updated;
      } else {
        return [...prev, { ...food, quantity: 1, note: "" }];
      }
    });
  };
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-white">
      <ListAddOrder
        orderItems={orderItems}
        table={table}
        onSuccess={onClose}
        onChangeItems={(items) => setOrderItems(items)}
      />

      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">
          เพิ่มออเดอร์โต๊ะ{" "}
          <span className="text-indigo-600">{table.tableNumber}</span>
        </h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-500 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 active:scale-95"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <FoodList onAddFood={handleAddFood} />
      </div>
    </div>
  );
}

export default AddOrder;
