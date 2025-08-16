import axios from "@/utils/axios";
import toast from "react-hot-toast";
export const getStatusBill = async (orderId: string) => {
    try {
        const response = await axios.get(`/bills/status/${orderId}`);
        return response.data;
    } catch (error) {
        toast.error("เกิดข้อผิดพลาดในการดึงสถานะบิล");
        console.error("Error fetching bill status:", error);
        throw error;
    }
};

export const changeStatusBill = async (orderId: string, status: string) => {
    try {
        const response = await axios.put(`/bills/status/${orderId}`, { status });
        return response.data;
    } catch (error) {
        toast.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะบิล");
        console.error("Error changing bill status:", error);
        throw error;
    }
};