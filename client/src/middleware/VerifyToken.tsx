import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useVerifyToken } from "../hooks/Auth/useVerifyToken";
import { FaExclamationTriangle } from "react-icons/fa";
import Loader from "../components/UI/Load/Loading";
interface VerifyTokenProps {
  children: React.ReactNode;
}

const VerifyToken = ({ children }: VerifyTokenProps) => {
  const { verify } = useVerifyToken();
  const location = useLocation();

  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("tk");

    if (token) {
      sessionStorage.setItem("token", token);
      queryParams.delete("tk");

      const newUrl =
        location.pathname +
        (queryParams.toString() ? `?${queryParams.toString()}` : "");
      window.history.replaceState(null, "", newUrl);
    }

    const getToken = sessionStorage.getItem("token");

    const fetch = async () => {
      try {
        await verify(getToken);
        setIsValid(true);
      } catch (err) {
        console.log(err);
        setIsValid(false);
      }
    };

    fetch();
  }, [location.search, location.pathname, Date.now()]);

  if (isValid === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isValid) {
    return (
      <>
        <div className="flex h-screen flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 shadow-md">
            <FaExclamationTriangle className="text-3xl" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-700">
            ลิงก์หมดอายุหรือลิงก์ไม่ถูกต้อง
          </h2>
          <p className="mb-6 text-gray-500">
            กรุณาสแกน QR Code ของคุณอีกครั้งเพื่อเข้าสู่ระบบสั่งอาหาร
          </p>
        </div>
      </>
    );
  }

  return <>{children}</>;
};

export default VerifyToken;
