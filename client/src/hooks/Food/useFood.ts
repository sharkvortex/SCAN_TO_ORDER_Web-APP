import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import type { Food } from "../../Types/food";

export const useFood = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const token = sessionStorage.getItem("token");

  const getFood = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get(`/api/food`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFoods(response.data);
    } catch (error) {
      console.error("Error fetching food:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getFood();
  }, [getFood]);

  return { getFood, foods, loading };
};
