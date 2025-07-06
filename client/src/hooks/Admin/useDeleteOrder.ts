import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
export const useDeleteOrder = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteOrderId = async (id: number | null) => {
    if (id === null) return;
    setLoading(true);

    try {
      const response = await axios.delete(`/api/delete-orderId/${id}`, {
        withCredentials: true,
      });
      toast.success("ลบออเดอร์สำเร็จ");
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  return { deleteOrderId, loading };
};
