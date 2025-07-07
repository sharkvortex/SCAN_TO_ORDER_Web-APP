import React, { useState } from "react";
import toast from "react-hot-toast";
import { useLogin } from "../../hooks/Auth/useLogin";
function LoginForm() {
  const { login } = useLogin();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.username){
      return toast.error("กรุณากรอก Username")
    }else if(!formData.password){
      return toast.error("กรุณากรอก Password")
    }
    try {
      await login(formData);
      setFormData({
        username: "",
        password: ""
      })
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Login
        </h2>

        <form onSubmit={handlerSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none"
              value={formData.username}
              onChange={handlerChange}
            />
          </div>
         
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none"
              value={formData.password}
              onChange={handlerChange}
            />
          </div>
          
          <button
            type="submit"
            className="w-full rounded-md bg-black px-4 py-2 font-medium text-white transition duration-200 hover:cursor-pointer hover:bg-gray-800"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
