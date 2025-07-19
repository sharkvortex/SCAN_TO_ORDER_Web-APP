import { motion } from "framer-motion";
import { BsClockHistory } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import type { HistoryFoodType } from "../../../../../types/food";
import { useChangeStatus } from "../../../../../hooks/Admin/useChangeStatus";
import toast from "react-hot-toast";
import socket from "../../../../Sokcet/soket";
import ConfirmDialog from "../../../../Dialog/ConfirmDialog";
import { useState } from "react";
import type { diaLogTypes } from "../../../../../types/diaLogTypes";
import { useDeleteOrder } from "../../../../../hooks/Admin/useDeleteOrder";
interface HistoryOrderListTypes {
  loading: boolean;
  sortedOrders: HistoryFoodType[];
}

function HistoryOrderList({ loading, sortedOrders }: HistoryOrderListTypes) {
  const { changeStatusFood } = useChangeStatus();
  const { deleteOrderId } = useDeleteOrder();
  const StatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "ยังไม่รับออเดอร์";
      case "CONFIRMED":
        return "รับออเดอร์แล้ว";
      case "SERVED":
        return "เสิร์ฟแล้ว";
      case "CANCELLED":
        return "ยกเลิกแล้ว";
      default:
        return "ไม่ทราบสถานะ";
    }
  };

  const StatusBackground = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100 text-orange-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "SERVED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const StatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-800";
      case "SERVED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const changeStatusOrder = async (id: number | null, status: string) => {
    if (!id || !status) return;
    try {
      await changeStatusFood(id, status);
      socket.emit("update-order");
      setActionType("");
    } catch (error) {
      toast.error("ไม่สามารถอัพเดทสถานะได้");
      console.log(error);
    }
  };

  const [selectedId, setSelectedId] = useState<number | null>(null);

  type ActionType = "cancel" | "delete" | "";
  const [actionType, setActionType] = useState<ActionType>("");

  const dialogConfig: Record<
    Exclude<ActionType, "">,
    {
      type: diaLogTypes["type"];
      title: string;
      description: string;
      confirmFn: () => void;
    }
  > = {
    cancel: {
      type: "error",
      title: "ต้องการยกเลิกใช่หรือไม่?",
      description: "ยืนยันรับยกเลิกออเดอร์?",
      confirmFn: () => changeStatusOrder(selectedId, "CANCELLED"),
    },
    delete: {
      type: "error",
      title: "ยืนยันการลบ?",
      description: "ยืนยันการลบออเดอร์หรือไม่?",
      confirmFn: async () => {
        try {
          await deleteOrderId(selectedId);
          setActionType("");
        } catch (error) {
          console.log(error);
        }
      },
    },
  };

  const isValidDialogAction = (
    action: ActionType,
  ): action is Exclude<ActionType, ""> => {
    return action === "cancel" || action === "delete";
  };

  return (
    <>
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

      <div className="flex-1 space-y-3 overflow-y-auto">
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-10 rounded-md bg-gray-200"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-40 rounded bg-gray-200"></div>
                      <div className="h-3 w-32 rounded bg-gray-100"></div>
                      <div className="h-3 w-28 rounded bg-gray-100"></div>
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-4 w-12 rounded bg-gray-200"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-16 rounded-md bg-gray-200"></div>
                      <div className="h-8 w-16 rounded-md bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : sortedOrders.length > 0 ? (
          sortedOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg p-4 transition-all ${
                order.status === "PENDING"
                  ? "bg-white shadow-sm ring-1 ring-gray-100"
                  : "bg-gray-50"
              }`}
            >
              <div
                className={`flex items-start justify-between ${
                  order.status === "CANCELLED" && "opacity-80"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 rounded-md px-2 py-1 text-center ${StatusBadge(order.status)}`}
                  >
                    <span className="text-lg font-medium">
                      {order.quantity}x
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium text-gray-800">
                        {order.foodName}
                      </h3>
                      <span
                        className={`text-xs ${StatusBackground(order.status)} rounded-full px-2 py-1`}
                      >
                        {StatusText(order.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {order.foodPrice.toFixed(0)}฿/ชิ้น • รวม{" "}
                      {(order.foodPrice * order.quantity).toFixed(0)}฿
                    </p>
                    {order.note && (
                      <div className="mt-2 rounded px-2 py-1">
                        <p className="text-sm text-gray-600">
                          หมายเหตุ: {""}
                          <span className="rounded bg-red-500 px-1 font-semibold text-white">
                            {order.note}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex w-full flex-col gap-2">
                    {order.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            changeStatusOrder(order.id, "CONFIRMED")
                          }
                          className="w-full rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white hover:cursor-pointer hover:bg-green-700 active:scale-95"
                        >
                          รับออเดอร์
                        </button>
                        <button
                          onClick={() => {
                            setActionType("cancel");
                            setSelectedId(order.id);
                          }}
                          className="w-full rounded-md bg-red-500 px-3 py-2 text-xs font-medium text-white hover:cursor-pointer hover:bg-red-600 active:scale-95"
                        >
                          ยกเลิก
                        </button>
                      </>
                    )}

                    {order.status === "CONFIRMED" && (
                      <>
                        <button
                          onClick={() => changeStatusOrder(order.id, "SERVED")}
                          className="w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:cursor-pointer hover:bg-blue-700 active:scale-95"
                        >
                          เสิร์ฟแล้ว
                        </button>
                        <button
                          onClick={() => {
                            setActionType("cancel");
                            setSelectedId(order.id);
                          }}
                          className="w-full rounded-md bg-red-500 px-3 py-2 text-xs font-medium text-white hover:cursor-pointer hover:bg-red-600 active:scale-95"
                        >
                          ยกเลิก
                        </button>
                      </>
                    )}
                  </div>

                  {order.status !== "SERVED" && (
                    <button
                      onClick={() => {
                        setActionType("delete");
                        setSelectedId(order.id);
                      }}
                      className="mt-1 flex items-center gap-1 text-sm text-red-600 transition-colors hover:cursor-pointer hover:text-red-800 active:scale-95"
                    >
                      <FiTrash2 size={16} />
                      <span className="text-xs">ลบ</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-center">
            <BsClockHistory className="mb-3 text-4xl text-gray-300" />
            <h3 className="font-medium text-gray-500">
              ไม่มีประวัติการสั่งอาหาร
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              ยังไม่มีการสั่งอาหารจากโต๊ะนี้
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default HistoryOrderList;
