import { useState, useEffect } from "react";
import { PlusCircle, Clock, DollarSign, User, Edit2, X } from "lucide-react";
import OpenTable from "@/components/Admin/Pos/PosMenu/OpenTable";
import HistoryOrder from "@/components/Admin/Pos/PosMenu/HistoryOrder/HistoryOrder";
import { AnimatePresence, motion } from "framer-motion";
import type { tableType } from "@/types/tableType";
import AddOrder from "@/components/Admin/Pos/PosMenu/AddOrder/AddOrder";
import ReserveTable from "@/components/Admin/Pos/PosMenu/Reserve/ReserveTable";
import ManageTable from "@/components/Admin/Pos/PosMenu/ManageTable/ManageTable";
import CheckBill from "@/components/Admin/Pos/PosMenu/CheckBill/CheckBill";
interface PosMenuTypes {
  onClose: () => void;
  onSuccess: () => void;
  table: tableType;
}
const PosMenu = ({ table, onClose, onSuccess }: PosMenuTypes) => {
  const [status, setStatus] = useState(table?.status?.toLowerCase() || "");
  const isAvailable = status === "available";
  const isOccupied = status === "occupied";
  const isReserved = status === "reserved";

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const [isVisible, setIsVisible] = useState(true);
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const getStatusColor = () => {
    if (isAvailable) return "bg-green-500";
    if (isOccupied) return "bg-red-500";
    if (isReserved) return "bg-orange-500";
    return "bg-gray-500";
  };

  const getStatusText = () => {
    if (isAvailable) return "ว่าง";
    if (isOccupied) return "มีลูกค้า";
    if (isReserved) return "จองแล้ว";
    return "ไม่ทราบสถานะ";
  };
  const [activeModal, setActiveModal] = useState<
    | null
    | "createQrocde"
    | "orderHistory"
    | "reservedTable"
    | "addOrder"
    | "manageTable"
    | "checkBill"
  >(null);

  const handlerOpenTable = () => {
    if (isAvailable || isReserved) {
      setActiveModal("createQrocde");
    } else {
      setActiveModal("addOrder");
    }
  };

  const handlerOpenHistory = () => {
    setActiveModal("orderHistory");
  };

  const handlerReserved = () => {
    setActiveModal("reservedTable");
  };
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="relative border-b border-gray-100 p-6">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 rounded-full p-2 transition-colors hover:cursor-pointer hover:bg-gray-50"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>

              <div className="flex items-center justify-between pr-8">
                <div>
                  <h2 className="mb-1 text-2xl font-semibold text-gray-900">
                    โต๊ะ {table?.tableNumber}
                  </h2>
                  <div className="flex items-center">
                    <div
                      className={`mr-2 h-2 w-2 rounded-full ${getStatusColor()}`}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {getStatusText()}
                    </span>
                  </div>
                </div>

                <div className="flex">
                  <div className="text-sm text-gray-500">
                    โต๊ะ: {table?.capacity} ท่าน
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {activeModal === "createQrocde" && (
                  <OpenTable
                    table={table?.tableNumber}
                    onClose={() => {
                      setActiveModal(null);
                    }}
                    onSuccess={() => {
                      onSuccess();
                      setStatus("occupied");
                    }}
                  />
                )}
                <button
                  onClick={() => handlerOpenTable()}
                  className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:cursor-pointer hover:border-gray-300 hover:shadow-sm active:scale-95"
                >
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="rounded-xl bg-blue-50 p-3 transition-colors group-hover:bg-blue-100">
                      <PlusCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {isAvailable || isReserved ? "เปิดโต๊ะ" : "เพิ่มออเดอร์"}
                    </span>
                  </div>
                </button>

                {activeModal === "addOrder" && (
                  <AddOrder
                    table={table}
                    onClose={() => {
                      setActiveModal(null);
                      onClose();
                    }}
                  />
                )}

                <button
                  onClick={() => handlerOpenHistory()}
                  className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:cursor-pointer hover:border-gray-300 hover:shadow-sm active:scale-95"
                >
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="rounded-xl bg-purple-50 p-3 transition-colors group-hover:bg-purple-100">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ประวัติการสั่ง
                    </span>
                  </div>
                </button>
                {activeModal === "orderHistory" && (
                  <HistoryOrder
                    table={table}
                    onClose={() => setActiveModal(null)}
                  />
                )}

                {isOccupied && (
                  <button
                    onClick={() => setActiveModal("checkBill")}
                    className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:cursor-pointer hover:border-gray-300 hover:shadow-sm active:scale-95"
                  >
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <div className="rounded-xl bg-green-50 p-3 transition-colors group-hover:bg-green-100">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        เช็คบิล
                      </span>
                    </div>
                  </button>
                )}
                {activeModal === "checkBill" && (
                  <CheckBill
                    table={table}
                    onClose={() => setActiveModal(null)}
                  />
                )}

                {isAvailable && (
                  <button
                    onClick={() => handlerReserved()}
                    className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:cursor-pointer hover:border-gray-300 hover:shadow-sm active:scale-95"
                  >
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <div className="rounded-xl bg-orange-50 p-3 transition-colors group-hover:bg-orange-100">
                        <User className="h-5 w-5 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        จองโต๊ะ
                      </span>
                    </div>
                  </button>
                )}
                {activeModal === "reservedTable" && (
                  <ReserveTable
                    tableNumber={table.tableNumber}
                    onClose={() => setActiveModal(null)}
                    onSuccess={() => {
                      onSuccess();
                      setStatus("reserved");
                      onClose();
                    }}
                  />
                )}

                <button
                  onClick={() => setActiveModal("manageTable")}
                  className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:cursor-pointer hover:border-gray-300 hover:shadow-sm active:scale-95"
                >
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="rounded-xl bg-gray-50 p-3 transition-colors group-hover:bg-gray-100">
                      <Edit2 className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      จัดการโต๊ะ
                    </span>
                  </div>
                </button>
              </div>
            </div>
            {activeModal === "manageTable" && (
              <ManageTable
                table={table}
                onClose={() => setActiveModal(null)}
                onSuccess={() => {
                  onSuccess();
                  setActiveModal(null);
                }}
              />
            )}

            <div className="p-6 pt-0">
              <button
                onClick={handleClose}
                className="w-full rounded-2xl bg-gray-50 py-3 font-medium text-gray-700 transition-colors duration-200 hover:cursor-pointer hover:bg-gray-100 active:scale-95"
              >
                ปิดเมนู
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PosMenu;
