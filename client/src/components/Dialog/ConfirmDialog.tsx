import {
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import type { diaLogTypes } from "../../Types/diaLogTypes";
interface ConfirmDialogTypes {
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type: diaLogTypes["type"]; 
}

const typeConfig = {
  info: {
    icon: <FaInfoCircle className="text-blue-600" size={24} />,
    bg: "bg-blue-100",
    bgBtn: "bg-blue-500 hover:bg-blue-600",
  },
  warn: {
    icon: <FaExclamationTriangle className="text-orange-600" size={24} />,
    bg: "bg-orange-100",
    bgBtn: "bg-orange-500 hover:bg-orange-600",
  },
  error: {
    icon: <FaExclamationTriangle className="text-red-600" size={24} />,
    bg: "bg-red-100",
    bgBtn: "bg-red-500 hover:bg-red-600",
  },
  success: {
    icon: <FaCheck className="text-green-600" size={24} />,
    bg: "bg-green-100",
    bgBtn: "bg-green-500 hover:bg-green-600",
  },
};

function ConfirmDialog({
  onConfirm,
  onCancel,
  title,
  description = "",
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  type,
}: ConfirmDialogTypes) {
  const { icon, bg, bgBtn } = typeConfig[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3">
      <div className="animate-in fade-in zoom-in-95 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${bg}`}
            >
              {icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              {description && <p className="mt-1 text-gray-600">{description}</p>}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="flex items-center hover:cursor-pointer gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none"
            >
              <FaTimes className="text-gray-500" />
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex items-center hover:cursor-pointer gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition focus:outline-none ${bgBtn}`}
            >
              <FaCheck />
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
