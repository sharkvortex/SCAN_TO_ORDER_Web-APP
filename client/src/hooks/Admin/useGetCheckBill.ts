import axios from "@/utils/axios";
import { useState } from "react";
export const useGetCheckBill = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [checkBillItems, setCheckBillItems] = useState<any[]>([]);
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