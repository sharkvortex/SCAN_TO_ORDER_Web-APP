import { useEffect, useState } from "react";
import PosMenu from "./PosMenu";
import { useGetTable } from "../../../hooks/Admin/useGetTable";
import { useSoundNotify } from "../../../contexts/SoundContext/SoundNotifyContext";
import { MdTableBar, MdNotificationsActive } from "react-icons/md";
import { motion } from "framer-motion";
import type { tableType } from "../../../types/tableType";
import socket from "@/components/Sokcet/soket";

import addOrderSound from "@/assets/sounds/add-order.mp3";

function TableData() {
  const { tables, fetchTables } = useGetTable();
  const [selectedTable, setSelectedTable] = useState<tableType | null>(null);
  const [notifiedTables, setNotifiedTables] = useState<number[]>([]);
  const { newOrderNotify } = useSoundNotify();

  const handleTableClick = (table: tableType) => {
    setSelectedTable(table);
    setNotifiedTables((prev) =>
      prev.filter((num) => num !== table.tableNumber),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "occupied":
        return "bg-red-500";
      case "reserved":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "ว่าง";
      case "occupied":
        return "มีลูกค้า";
      case "reserved":
        return "จองแล้ว";
      default:
        return "ไม่ทราบสถานะ";
    }
  };
  const soundAddOrderRef = new Audio(addOrderSound);
  useEffect(() => {
    const onAddOrder = async (tableNumber: number) => {
      setNotifiedTables((prev) => [...new Set([...prev, tableNumber])]);

      try {
        await soundAddOrderRef.play();
      } catch (error) {
        console.error("เล่นเสียงล้มเหลว:", error);
      }
    };
    const onTableupdate = () => {
      fetchTables();
    };
    socket.on("add-orders", onAddOrder);
    socket.on("table-update", onTableupdate);

    return () => {
      socket.off("add-orders", onAddOrder);
      socket.off("table-update", onTableupdate);
    };
  }, []);

  useEffect(() => {
    if (newOrderNotify?.tableNumber) {
      setNotifiedTables((prev) => [
        ...new Set([...prev, newOrderNotify.tableNumber]),
      ]);
    }
  }, [newOrderNotify?.timestamp]);

  return (
    <>
      <div className="min-h-screen p-2">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {tables.map((table) => (
              <div
                onClick={() => handleTableClick(table)}
                key={table.id}
                className={`relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-center transition-all hover:ring-2 hover:ring-gray-300 active:scale-95 ${
                  notifiedTables.includes(table.tableNumber)
                    ? "animate-pulse ring-2 ring-red-500"
                    : ""
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${getStatusColor(
                    table.status.toLowerCase(),
                  )}`}
                >
                  <MdTableBar className="text-xl text-white" />
                </div>

                {notifiedTables.includes(table.tableNumber) && (
                  <div className="absolute top-1 right-1 flex items-center gap-1 rounded bg-red-500 px-2 py-1 text-[10px] text-white shadow-md">
                    <motion.div
                      animate={{
                        rotate: [0, -15, 15, -10, 10, -5, 5, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <MdNotificationsActive className="h-3 w-3" />
                    </motion.div>
                    <span>ออเดอร์ใหม่</span>
                  </div>
                )}

                <h2 className="mt-1 text-base font-medium text-gray-700">
                  โต๊ะ {table.tableNumber}
                </h2>
                <span
                  className={`mt-1 rounded-full px-2 py-0.5 text-xs text-white ${getStatusColor(
                    table.status.toLowerCase(),
                  )}`}
                >
                  {getStatusText(table.status.toLowerCase())}
                </span>
                <p className="mt-1 text-xs text-gray-500">
                  โต๊ะ: {table.capacity} ท่าน
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedTable && (
        <PosMenu
          table={selectedTable}
          onClose={() => {
            setSelectedTable(null);
          }}
          onSuccess={() => {
            setSelectedTable(null);
            fetchTables();
          }}
        />
      )}
    </>
  );
}

export default TableData;
