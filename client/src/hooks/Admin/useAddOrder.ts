import { useState, useCallback } from "react";
import axios from "@/utils/axios";
import type { Food } from "@/types/food";

type OrderItem = Food & {
    quantity: number;
    note: string;
};

type OrderTypes = {
    orderItems: OrderItem[];
};
export const useAddOrder = () => {
    const [loading, setLoading] = useState(false);

    const addOrder = useCallback(async (orderItems: OrderTypes, tableNumber: number) => {
        setLoading(true)
        try {
            const response = await axios.post('/add-order', { data: orderItems, tableNumber: tableNumber })

            return response
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }, [])

    return { addOrder, loading }
}