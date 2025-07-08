import axios from "axios";
import toast from "react-hot-toast";

export const useCallEmployee = () => {
  const callEmployee = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get("/api/call-Employee", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
      console.log(error);
    }
  };

  return { callEmployee };
};
