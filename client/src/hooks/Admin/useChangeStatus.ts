import axios from "axios";
export const useChangeStatus = () => {
  const changeStatusFood = async (id: number, status: string) => {
    if (!id) return;
    try {
      const response = await axios.patch(`/api/update-order/${id}`, { status });
      return response;
    } catch (error) {
      console.error("รับออเดอร์ไม่สำเร็จ:", error);
      throw error;
    }
  };

  return { changeStatusFood };
};
