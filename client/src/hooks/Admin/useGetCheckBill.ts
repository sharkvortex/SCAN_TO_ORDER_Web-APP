import axios from "@/utils/axios";
import { useState } from "react";
import type { OrderTypes } from "@/types/ordersTypes";
export const useGetCheckBill = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [checkBillItems, setCheckBillItems] = useState<OrderTypes | null>(null);
    const getCheckBill = async (tableNumber: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`/table/check-bill/${tableNumber}`);
            setCheckBillItems(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching check bill:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { getCheckBill, loading, checkBillItems };
}