import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import type { tableType } from "../../Types/tableType";

export const useGetTable = () => {
  const [tables, setTables] = useState<tableType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTables = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/table");
      setTables(response.data);
    } catch (error) {
      console.error(error);
      toast.error("ไม่สามารถดึงข้อมูลโต๊ะได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return { tables, loading, fetchTables };
};
