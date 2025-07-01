import axios from "axios";
export const useVerifyToken = () => {
  const verify = async (token: string | null) => {
    if (!token) throw new Error("Token is missing");

    try {
      const response = await axios.get(`/api/verify-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Verification error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  return { verify };
};
