import {
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTrashAlt,
} from "react-icons/fa";

interface ConfirmDialogTypes {
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description: string | "";
  confirmText: string;
  cancelText: string;
  type: "info" | "success" | "error" | "confirm";
}

const typeConfig = {
  info: {
    icon: <FaInfoCircle className="text-blue-600" size={24} />,
    bg: "bg-blue-100",
  },
  success: {
    icon: <FaCheck className="text-green-600" size={24} />,
    bg: "bg-green-100",
  },
  error: {
    icon: <FaExclamationTriangle className="text-red-600" size={24} />,
    bg: "bg-red-100",
  },
  confirm: {
    icon: <FaTrashAlt className="text-yellow-600" size={24} />,
    bg: "bg-yellow-100",
  },
};

function ConfirmDialog({
  onConfirm,
  onCancel,
  title,
  description,
  confirmText,
  cancelText,
  type,
}: ConfirmDialogTypes) {
  const { icon, bg } = typeConfig[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
              <p className="mt-1 text-gray-600">{description}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-2 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:cursor-pointer hover:bg-gray-100 focus:outline-none"
            >
              <FaTimes className="text-gray-500" />
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:cursor-pointer hover:bg-green-700 focus:outline-none"
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
