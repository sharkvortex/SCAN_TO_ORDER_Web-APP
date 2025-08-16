import { motion, AnimatePresence } from "framer-motion";
import type { tableType } from "@/types/tableType";
import { X } from "lucide-react";

import ManageList from "./ManageList";

interface ManageTableProps {
  table: tableType;
  onClose: () => void;
  onSuccess: () => void;
}

function ManageTable({ table, onClose, onSuccess }: ManageTableProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-49 flex min-h-screen flex-col justify-between overflow-y-auto bg-white"
      >
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              จัดการโต๊ะ : {table.tableNumber}
            </h1>
            <button
              onClick={onClose}
              className="rounded-full p-2 transition hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <ManageList table={table} onSuccess={onSuccess} />
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-gray-50 p-4 py-3 font-medium text-gray-500 transition hover:cursor-pointer hover:bg-gray-200 active:scale-95"
          >
            ปิดเมนู
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ManageTable;
