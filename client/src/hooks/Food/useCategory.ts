import axios from "axios";
import { useEffect, useState } from "react";
import type { CategoryTypes } from "../../types/food";
export const useCategory = () => {
  const [categry, setCategory] = useState<CategoryTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/category");
      setCategory(response.data);

      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return { categry, loading, getCategory };
};
