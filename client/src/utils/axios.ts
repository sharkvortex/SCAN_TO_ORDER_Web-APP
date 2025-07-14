import Axios from "axios";
import { toast } from "react-hot-toast";

const axios = Axios.create({
  baseURL: "/api",
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { code } = error.response?.data || {};
    switch (code) {
      case "TOKEN_NOT_FOUND":
      case "TOKEN_EXPIRED":
      case "TOKEN_INVALID":
      case "TOKEN_ERROR":
        toast.error("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
        setTimeout(() => {
          window.location.href = '/auth/login'

        }, 1000);

        break;

      case "FORBIDDEN":
        toast.error("คุณไม่ได้รับอนุญาตติดต่อแอดมิน");
    }
    return Promise.reject(error);
  },
);

export default axios;
