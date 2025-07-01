import axios from "axios";
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
      throw error;
    }
  };

  return { callEmployee };
};
