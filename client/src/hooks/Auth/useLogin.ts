import axios from "axios";
export const useLogin = () => {
  const login = async (formData: { username: string; password: string }) => {
    if (!formData) return;
    try {
      const response = await axios.post("/api/auth/login", formData);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return { login };
};
