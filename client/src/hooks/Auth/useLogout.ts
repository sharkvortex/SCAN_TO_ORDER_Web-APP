import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useLogout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const logout = async () => {
        setLoading(true);

        await toast.promise(
            axios.post("/api/auth/logout", {}, { withCredentials: true }),
            {
                loading: 'กำลังออกจากระบบ...',
                success: () => {
                    navigate('/auth/login', { replace: true });
                    return 'ออกจากระบบสำเร็จ';
                },
                error: 'ออกจากระบบไม่สำเร็จ',
            }
        ).catch((error) => {
            console.error("Logout error:", error);
        }).finally(() => {
            setLoading(false);
        });
    };

    return { logout, loading };
};
