import { useState, useCallback } from "react";
import axios from "@/utils/axios";
export const useCreateQrcode = () => {
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);

  const createQrcode = useCallback(async (tableNumber: number) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/createQrcode/${tableNumber}`,
        {},
        {
          withCredentials: true,
        },
      );
      setQrData(response.data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    qrData,
    createQrcode,
  };
};
