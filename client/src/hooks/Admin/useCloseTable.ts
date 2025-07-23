import axios from "@/utils/axios";
import { useState } from "react";
export const useCloseTable = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const closeTable = async (tableNumber: number) => {
        try {
            setLoading(true);
            const response = await axios.patch(`/tables/close/${tableNumber}`);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { closeTable, loading };
}