import React, { useState } from "react";
import toast from "react-hot-toast";
import { useLogin } from "../../hooks/Auth/useLogin";

import Loader from "../UI/Load/Loading";

function LoginForm() {
  const { login, loading } = useLogin();
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
    if (!formData.username) {
      return toast.error("กรุณากรอก ชื่อผู้ใช้");
    } else if (!formData.password) {
      return toast.error("กรุณากรอก รหัสผ่าน");
    }
    try {
      await login(formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl p-6">
        <h2 className="mb-6 text-center text-4xl font-semibold text-gray-800">
          POS , เข้าสู่ระบบ
        </h2>

        <form onSubmit={handlerSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              ชื่อผู้ใช้
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="กรอก ชื่อผู้ใช้ หรือ อีเมล"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none"
              value={formData.username}
              onChange={handlerChange}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none"
              value={formData.password}
              onChange={handlerChange}
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`min-h-[40px] w-full rounded-md bg-black ${loading ? "hover:cursor-not-allowed" : "hover:cursor-pointer hover:bg-gray-800"} px-4 py-2 font-medium text-white transition duration-200`}
          >
            {loading ? (
              <div className="relative min-h-6 active:scale-95">
                <Loader />
              </div>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
