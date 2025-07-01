import axios from "axios";
import { useState, useCallback } from "react";
import type { HistoryFoodType } from "../../Types/food";

export const useHistoryOrder = () => {
  const [historyOrder, setHistoryOrder] = useState<HistoryFoodType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getHistoryOrder = useCallback(async (tableNumber: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/history-orders/${tableNumber}`);
      setHistoryOrder(response.data.orders);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { historyOrder, getHistoryOrder, loading };
};
