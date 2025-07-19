import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import type { Food } from "../../types/food";

export const useFood = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const token = sessionStorage.getItem("token");

  const getFood = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/foods`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
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
