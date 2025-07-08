import {
  FiCheckCircle,
  FiX,
  FiAlertTriangle,
  FiShoppingCart,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import socket from "../Sokcet/soket";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface ConfirmOrderProps {
  totalPrice: number;
  totalItems: number;
  onCancel: () => void;
}

function ConfirmOrder({ totalPrice, totalItems, onCancel }: ConfirmOrderProps) {
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      const incart = sessionStorage.getItem("Order");
      const token = sessionStorage.getItem("token");
      if (!token) {
        return navigate("/");
      }
      const card = incart ? JSON.parse(incart) : [];

      const response = await axios.post(
        "/api/order",
        {
          order: card,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      sessionStorage.removeItem("Order");
      socket.emit("new-order", token);
      toast.success("สั่งออเดอร์เรียบร้อยแล้ว");
      navigate("/");
      return response;
    } catch (error) {
      console.error("Error confirming order:", error);
      toast.error("เกิดข้อผิดพลาดในการยืนยันออเดอร์");
      return navigate("/");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-300">
      <div
        className={`w-full max-w-md transform overflow-hidden rounded-xl bg-white transition-all duration-300 ease-out`}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-blue-500/20 p-2">
              <FiShoppingCart className="text-xl text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">ยืนยันออเดอร์</h3>
          </div>
          <button
            onClick={onCancel}
            className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 rounded-full bg-yellow-100 p-2">
              <FiAlertTriangle className="text-xl text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">
                คุณต้องการยืนยันออเดอร์นี้ใช่หรือไม่?
              </p>

              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600">จำนวนรายการ</span>
                  <span className="font-medium">{totalItems} รายการ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">รวมทั้งหมด</span>
                  <span className="text-lg font-bold text-blue-600">
                    {totalPrice} บาท
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition-all hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200"
          >
            <span>ยกเลิก</span>
          </button>
          <button
            onClick={() => handleConfirm()}
            className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 font-medium text-white shadow-md transition-all hover:cursor-pointer hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-[0.98]"
          >
            <FiCheckCircle />
            <span>ยืนยันออเดอร์</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmOrder;
