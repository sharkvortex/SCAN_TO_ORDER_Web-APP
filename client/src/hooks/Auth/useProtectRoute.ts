import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { PrfileTypes } from "../../Types/UserTypes";
export const useProtectRoute = () => {
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string>();
  const [responseCode, setResponseCode] = useState<{
    code: string;
    message?: string;
  } | null>(null);
  const [profile, setProfile] = useState<PrfileTypes | null>(null);
  const protectRoute = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/auth/authentication", {
        withCredentials: true,
      });
      setProfile(response.data.user);
      setRole(response.data.user.role);

      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResponseCode(error?.response?.data);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    protectRoute();
  }, [location.pathname]);

  return { protectRoute, profile, role, loading, responseCode };
};
