import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import socket from "../../components/Sokcet/soket";
import type { HistoryFoodType } from "../../Types/food";
export const useHistoryFood = () => {
  const [orders, setOrders] = useState<HistoryFoodType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = sessionStorage.getItem("token");
  const getHistoryOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/history-order?token=${token}`);
      setOrders(response.data.orders);
      return response.data.orders;
    } catch (error) {
      console.log(error);
      toast.error("ไม่สามารถดูประวัติได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onUpdateOrder = () => {
      getHistoryOrder();
    };
    getHistoryOrder();

    socket.on("order-update", onUpdateOrder);

    return () => {
      socket.off("order-update", onUpdateOrder);
    };
  }, []);

  return { getHistoryOrder, orders, loading };
};
