import axios from "axios";
import { useState } from "react";
export const useReceiveOrder = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const receiveOrder = async (table: number) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `/api/update-order/receive-order-all/${table}`,
        {
          withCredentials: true,
        },
      );
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { receiveOrder, loading };
};
