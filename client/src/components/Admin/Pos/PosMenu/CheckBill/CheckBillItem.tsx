import { StickyNote, CircleDollarSign, Hash } from "lucide-react";
import type { OrderItem } from "@/types/ordersTypes";
function CheckBillItem({
  data,
}: {
  data: { orders: OrderItem[]; totalAmount: number };
}) {
  const { orders, totalAmount } = data;

  return (
    <div className="space-y-4 rounded-lg p-4 text-gray-800">
      <div className="space-y-3">
        {orders?.map((item: any) => (
          <div
            key={item.id}
            className="flex justify-between rounded-xl bg-white p-4"
          >
            <div>
              <p className="text-lg font-semibold text-gray-700">
                {item.foodName}
              </p>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Hash className="mr-1 h-4 w-4 text-blue-500" />
                จำนวน:{" "}
                <span className="ml-1 text-blue-600">x{item.quantity}</span>
              </div>
              {item.note && (
                <div className="mt-1 flex items-center text-sm text-orange-600">
                  <StickyNote className="mr-1 h-4 w-4" />
                  <span className="font-medium">{item.note}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end text-right">
              <p className="text-lg font-bold text-green-600">
                ฿ {item.foodPrice * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 flex justify-end pt-4">
        <div className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xl font-semibold text-white shadow-md">
          <CircleDollarSign size={22} className="text-white" />
          ยอดรวม: {totalAmount} บาท
        </div>
      </div>
    </div>
  );
}

export default CheckBillItem;
