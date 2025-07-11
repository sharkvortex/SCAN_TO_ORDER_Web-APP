import React, { useEffect, useState } from "react";
import { useProtectRoute } from "../hooks/Auth/useProtectRoute";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMemo } from "react";
import { LockKeyhole } from "lucide-react";
import Loader from "../components/UI/Load/Loading";
type Role = "ADMINISTRATOR" | "ADMIN" | "EMPLOYEE" | "GUEST" | null;

interface ProtectRouteProps {
  children: React.ReactNode;
  AllowRole: Role | Role[];
}

function ProtectRoute({ children, AllowRole }: ProtectRouteProps) {
  const { role, loading, responseCode } = useProtectRoute();
  const navigate = useNavigate();
  const allowRoles = useMemo(() => {
    return Array.isArray(AllowRole) ? AllowRole : [AllowRole];
  }, [AllowRole]);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    toast.dismiss();

    if (responseCode) {
      if (responseCode.code === "TOKEN_NOT_FOUND") {
        toast.error("กรุณาเข้าสู่ระบบ");
        navigate("/auth/login");
        return;
      }

      if (
        responseCode.code === "ERROR" &&
        (responseCode.message === "jwt expired" ||
          responseCode.message === "invalid signature")
      ) {
        toast.error("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
        navigate("/auth/login");
        return;
      }
    }

    if (!loading && role && !allowRoles.includes(role as Role)) {
      toast.error("ไม่มีสิทธิ์เข้าถึง");
      setAccessDenied(true);
    } else {
      setAccessDenied(false);
    }
  }, [role, loading, responseCode, allowRoles, navigate]);

  const RedirecLoginPage = () => {
    navigate("/auth/login", { replace: true });
  };
  if (loading)
    return (
      <>
        <div className="min-h-screen items-center justify-center">
          <Loader />
        </div>
      </>
    );

  if (accessDenied)
    return (
      <div className="flex h-screen flex-col items-center justify-center px-4 text-center">
        <div className="w-full max-w-md rounded-2xl p-8">
          <LockKeyhole className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold">ไม่มีสิทธิ์เข้าถึงหน้านี้</h1>
          <p className="mb-6">
            กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์ในการเข้าถึง
          </p>
          <button
            onClick={() => RedirecLoginPage()}
            className="inline-block rounded-full bg-red-500 px-4 py-2 font-semibold text-white transition hover:cursor-pointer hover:bg-red-600"
          >
            กลับหน้าล็อกอิน
          </button>
        </div>
      </div>
    );

  return <>{children}</>;
}

export default ProtectRoute;
