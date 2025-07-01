import axios from "axios";
import { useState } from "react";
export const useServedOrder = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const servedOrder = async (table: number) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `/api/update-order/served-order-all/${table}`,
        {
          withCredentials: true,
        },
      );
      return response;
    } catch (error) {
      console.log("เปลี่ยนสถานะเสิร์ฟไม่สำเร็จ", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { servedOrder, loading };
};
