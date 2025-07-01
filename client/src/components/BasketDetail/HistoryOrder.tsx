import { useHistoryFood } from "../../hooks/Food/useHistoryFood";

function HistoryOrder() {
  const { orders, loading } = useHistoryFood();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 p-4">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="space-y-3 rounded-xl bg-white p-4 shadow-sm"
          >
            <div className="h-4 w-1/3 rounded bg-gray-300" />
            <div className="flex items-center justify-between">
              <div className="h-3 w-1/4 rounded bg-gray-200" />
              <div className="h-3 w-1/4 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <div className="mb-4 text-6xl">📋</div>
        <p className="mb-2 text-xl text-gray-400">ยังไม่มีประวัติออเดอร์</p>
        <p>เมื่อคุณสั่งซื้อแล้ว ประวัติจะแสดงที่นี่</p>
      </div>
    );
  }

  const totalPrice = orders.reduce((sum, item) => {
    if (item.status === "CANCELLED") return sum;
    return sum + item.foodPrice * item.quantity;
  }, 0);

  const getStatusBadge = (status: string) => {
    const base = "inline-block px-2 py-0.5 rounded-full text-white text-xs";
    switch (status) {
      case "PENDING":
        return `${base} bg-yellow-500`;
      case "CONFIRMED":
        return `${base} bg-green-500`;
      case "SERVED":
        return `${base} bg-blue-500`;
      case "CANCELLED":
        return `${base} bg-red-400`;
      default:
        return `${base} bg-gray-400`;
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "รอดำเนินการ";
      case "CONFIRMED":
        return "รับออเดอร์แล้ว";
      case "SERVED":
        return "เสิร์ฟแล้ว";
      case "CANCELLED":
        return "ยกเลิก";
      default:
        return "ไม่ทราบสถานะ";
    }
  };

  return (
    <div className="mx-auto space-y-2 p-2">
      <h2 className="text-end text-2xl font-bold text-gray-800">
        📜 ประวัติการสั่งอาหาร
      </h2>

      {orders.map((item, index) => (
        <div key={index} className="border-b border-blue-300 p-2 transition">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-800">
              {item.foodName}
            </div>
            <div className="text-sm text-gray-500">
              ฿{item.foodPrice.toFixed(2)} × {item.quantity}
            </div>
          </div>
          {item.note && (
            <div className="mb-2 rounded-md border-l-4 border-orange-400 bg-orange-100 p-2 text-sm break-words whitespace-pre-wrap text-orange-800">
              📝 <span className="font-medium">หมายเหตุ:</span> {item.note}
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              สถานะ:{" "}
              <span className={getStatusBadge(item.status)}>
                {getStatusText(item.status)}
              </span>
            </div>
            <div className="font-semibold text-gray-800">
              รวม: ฿{(item.foodPrice * item.quantity).toFixed(2)}
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6 pt-4 text-right">
        <div className="text-lg font-semibold text-gray-700">
          ยอดรวมทั้งหมด: ฿{totalPrice.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default HistoryOrder;
