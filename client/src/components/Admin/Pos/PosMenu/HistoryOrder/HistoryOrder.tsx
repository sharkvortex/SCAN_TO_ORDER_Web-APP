// Icons
import { FiX } from "react-icons/fi";
import { BsClockHistory } from "react-icons/bs";
import { GiHotMeal } from "react-icons/gi";
import { ImCheckmark } from "react-icons/im";
import { IoClose } from "react-icons/io5";
// Components
import ConfirmDialog from "../../../../Dialog/ConfirmDialog";
import HistoryOrderList from "./HistoryOrderList";
// ReactHoos & useHooks
import { useHistoryOrder } from "../../../../../hooks/Admin/useHistoryOrder";
import { useEffect, useState } from "react";
import { useReceiveOrder } from "../../../../../hooks/Admin/useReceiveOrder";
import { useServedOrder } from "../../../../../hooks/Admin/useServedOrder";
// Framework
import socket from "../../../../Sokcet/soket";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
// Types
import type { tableType } from "../../../../../Types/tableType";
interface HistoryOrderTypes {
  onClose: () => void;
  table: tableType;
}
const HistoryOrder = ({ table, onClose }: HistoryOrderTypes) => {
  const { receiveOrder } = useReceiveOrder();
  const { servedOrder } = useServedOrder();
  const { historyOrder, getHistoryOrder, loading } = useHistoryOrder();
  const [isVisible, setIsVisible] = useState(true);

  const handlerClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  useEffect(() => {
    const orderUpdate = () => {
      getHistoryOrder(table?.tableNumber);
      console.log("อัพเดทใหม่");
    };
    getHistoryOrder(table?.tableNumber);
    socket.on("order-update", orderUpdate);
    socket.on("order-notify", orderUpdate);
    return () => {
      socket.off("order-update", orderUpdate);
      socket.off("order-notify", orderUpdate);
    };
  }, [getHistoryOrder, table?.tableNumber]);

  const handleAcceptAll = async (table: number) => {
    try {
      await receiveOrder(table);
      setActionType("");
      toast.success("รับออเดอร์เรียบร้อย");
      socket.emit("update-order", table);
    } catch (error) {
      console.log(error);
      toast.error("เปลี่ยนสถานะล้มเหลว");
    }
  };

  const handleCancelAll = () => {
    toast("ยังไม่ได้เพิ่ม logic ยกเลิกทั้งหมด");
  };

  const handleServedAll = async (table: number) => {
    try {
      await servedOrder(table);
      setActionType("");
      toast.success("เปลี่ยนสถานะว่าเสิร์ฟแล้ว");
      socket.emit("update-order", table);
    } catch (error) {
      console.log(error);
      toast.error("เปลี่ยนสถานะล้มเหลว");
    }
  };

  const statusOrder = ["PENDING", "CONFIRMED", "SERVED", "CANCELLED"];

  const sortedOrders = [...(historyOrder || [])].sort((a, b) => {
    const aStatus = a.status?.trim().toUpperCase() ?? "";
    const bStatus = b.status?.trim().toUpperCase() ?? "";

    const aIndex = statusOrder.indexOf(aStatus);
    const bIndex = statusOrder.indexOf(bStatus);

    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  const validOrders = (sortedOrders || []).filter(
    (order) => order.status !== "CANCELLED",
  );

  const totalAmount = validOrders.reduce(
    (sum, order) => sum + order.foodPrice * order.quantity,
    0,
  );

  const hasPending = sortedOrders.some((order) => order.status === "PENDING");

  type ActionType = "recevice" | "served" | "";
  type DialogType = "info" | "success" | "error" | "confirm";

  const [actionType, setActionType] = useState<ActionType>("");
  const dialogConfig: Record<
    Exclude<ActionType, "">,
    {
      type: DialogType;
      title: string;
      description: string;
      confirmFn: () => void;
    }
  > = {
    recevice: {
      type: "confirm",
      title: "ยืนยันรับออเดอร์ทั้งหมด?",
      description: "ยืนยันรับออเดอร์ที่ลูกค้าสั่งเข้ามาทั้งหมดหรือไม่?",
      confirmFn: () => handleAcceptAll(table.tableNumber),
    },
    served: {
      type: "confirm",
      title: "เปลี่ยนสถานะเป็นเสิร์ฟทั้งหมด?",
      description: "ยืนยันเปลี่ยนสถานะเป็นเสิร์ฟทั้งหมดหรือไม่?",
      confirmFn: () => handleServedAll(table.tableNumber),
    },
  };
  const isValidDialogAction = (
    action: ActionType,
  ): action is Exclude<ActionType, ""> => {
    return action === "recevice" || action === "served";
  };
  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-gray-50 p-4 md:p-6"
          >
            {isValidDialogAction(actionType) && (
              <ConfirmDialog
                type={dialogConfig[actionType].type}
                title={dialogConfig[actionType].title}
                description={dialogConfig[actionType].description}
                cancelText="ยกเลิก"
                confirmText="ยืนยัน"
                onConfirm={dialogConfig[actionType].confirmFn}
                onCancel={() => setActionType("")}
              />
            )}

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <BsClockHistory className="text-xl" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    ประวัติการสั่งอาหาร
                  </h1>
                  <div className="rounded-full bg-blue-500">
                    <p className="text-center text-lg font-semibold text-white">
                      โต๊ะ {table.tableNumber}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handlerClose}
                className="p-2 text-gray-500 transition-colors hover:cursor-pointer hover:text-gray-700"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-lg text-gray-500">ทั้งหมด</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {sortedOrders.length}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-lg text-gray-500">รอดำเนินการ</p>
                <p className="text-2xl font-bold text-amber-500">
                  {sortedOrders.filter((o) => o.status === "PENDING").length}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-lg text-gray-500">ยอดรวม</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {totalAmount.toFixed(0)}฿
                </p>
              </div>
            </div>

            {sortedOrders.length > 0 && (
              <div className="mb-6 flex justify-between gap-2">
                <div className="flex items-center justify-center">
                  {sortedOrders.some(
                    (order) => order.status === "CONFIRMED",
                  ) && (
                    <button
                      onClick={() => setActionType("served")}
                      disabled={hasPending}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition-colors ${hasPending ? "cursor-not-allowed bg-gray-300 hover:bg-gray-200" : "cursor-pointer bg-blue-600 hover:cursor-pointer hover:bg-blue-700"}`}
                    >
                      <GiHotMeal size={20} />
                      เสิร์ฟแล้วทั้งหมด
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2">
                  {sortedOrders.some((order) => order.status === "PENDING") && (
                    <>
                      <button
                        onClick={() => setActionType("recevice")}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:cursor-pointer hover:bg-green-700"
                      >
                        <ImCheckmark size={20} /> รับออเดอร์ทั้งหมด
                      </button>
                      <button
                        onClick={handleCancelAll}
                        className="flex items-center gap-2 rounded-lg bg-red-400 px-4 py-2 text-sm text-white hover:cursor-pointer hover:bg-red-500"
                      >
                        <IoClose size={20} /> ยกเลิกทั้งหมด
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* HostoryOrderList */}
            <HistoryOrderList loading={loading} sortedOrders={sortedOrders} />

            <div className="mt-6 pt-4">
              <button
                onClick={handlerClose}
                className="w-full rounded-lg bg-gray-200 py-3 text-gray-500 transition-colors hover:cursor-pointer hover:bg-gray-300"
              >
                ปิด
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HistoryOrder;
