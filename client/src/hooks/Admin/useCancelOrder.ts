import axios from "axios";
import { useState } from "react";
export const useCancelOrder = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const cancelOrder = async (table: number) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `/api/update-order/cancel-order-all/${table}`,
        {
          withCredentials: true,
        },
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  return { cancelOrder, loading };
};
