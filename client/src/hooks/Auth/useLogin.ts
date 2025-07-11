import axios, { AxiosError } from "axios";

import toast from "react-hot-toast";
export const useLogin = () => {
  const login = async (formData: { username: string; password: string }) => {
    if (!formData) return;
    try {
      const response = await axios.post("/api/auth/login", formData);

      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ code: string }>;
      if (err.response?.data?.code === "USER_NOT_FOUND") {
        toast.error("ชื่อผู้ใช้ไม่ถูกต้อง");
      } else if (err.response?.data?.code === "INVALID_PASSWORD") {
        toast.error("รหัสผ่านไม่ถูกต้อง");
      }
      console.log(err);
    }
  };

  return { login };
};
