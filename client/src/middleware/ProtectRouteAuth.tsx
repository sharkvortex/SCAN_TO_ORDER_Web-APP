import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProtectRoute } from "@/hooks/Auth/useProtectRoute";

interface ProtectRouteProps {
  children: React.ReactNode;
}

function ProtectRouteAuth({ children }: ProtectRouteProps) {
  const navigate = useNavigate();
  const { role } = useProtectRoute();

  useEffect(() => {
    if (role && role !== "GUEST") {
      navigate("/admin/pos", { replace: true });
    }
  }, [role, navigate]);

  return <>{children}</>;
}

export default ProtectRouteAuth;
