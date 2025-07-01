import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import socket from "../../components/Sokcet/soket";
import soundNewOrder from "../../assets/sounds/sound-neworder.mp3";
import ringCall from "../../assets/sounds/ring-phone.mp3";
import { toast } from "react-hot-toast";
import { useVerifyToken } from "../../hooks/Auth/useVerifyToken";
import { SoundNotifyContext } from "./SoundNotifyContext";

export const SoundNotifyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    return sessionStorage.getItem("sound-enabled") === "true";
  });

  const { verify } = useVerifyToken();
  const [newOrderNotify, setNewOrderNotify] = useState<{
    tableNumber: number;
    timestamp: number;
  } | null>(null);

  const notifyNewOrder = (tableNumber: number) => {
    setNewOrderNotify({ tableNumber, timestamp: Date.now() });
  };

  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSound = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    sessionStorage.setItem("sound-enabled", newValue.toString());
  };

  const [callEmployeeData, setCallEmployeeData] = useState<
    { tableNumber: number; time: string }[]
  >(() => {
    const stored = sessionStorage.getItem("CallEmployeeNotify");
    return stored ? JSON.parse(stored) : [];
  });

  const addCallEmployeeData = (data: { tableNumber: number; time: string }) => {
    setCallEmployeeData((prev) => {
      const updated = [...prev, data];
      sessionStorage.setItem("CallEmployeeNotify", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (!location.pathname.startsWith("/admin")) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(soundNewOrder);
    }

    const newOrder = async (token: string) => {
      const response = await verify(token);
      notifyNewOrder(response.tableNumber);
      audioRef.current!.currentTime = 0;
      toast(`ออเดอร์ใหม่จาก โต๊ะ ${response.tableNumber}`, {
        icon: "🔔",
        style: {
          borderRadius: "10px",
          background: "#f71839",
          color: "#fff",
        },
      });
      if (enabled) {
        audioRef.current!.play().catch((err) => {
          console.warn("ไม่สามารถเล่นเสียงได้:", err);
        });
      }
    };

    const ringCallAudio = new Audio(ringCall);
    const callEmployee = (tableNumber: number) => {
      toast(`🔔 โต๊ะ ${tableNumber} เรียกพนักงาน`);

      const newData = {
        tableNumber: tableNumber,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          second: "2-digit",
        }),
      };

      addCallEmployeeData(newData);

      if (enabled) {
        ringCallAudio.play().catch((err) => {
          console.warn("ไม่สามารถเล่นเสียงเรียกพนักงานได้:", err);
        });
      }
    };

    socket.on("order-notify", newOrder);
    socket.on("callEmploy-notify", callEmployee);

    return () => {
      socket.off("order-notify", newOrder);
      socket.off("callEmploy-notify", callEmployee);
    };
  }, [enabled, location.pathname, verify]);

  const clearCallEmployee = () => {
    try {
      sessionStorage.removeItem("CallEmployeeNotify");
      setCallEmployeeData([]);
    } catch (error) {
      console.log(error);
      toast.error("ไม่สามารถเคลียร์ค่าได้");
    }
  };

  useEffect(() => {
    const handleInteraction = () => {
      if (!sessionStorage.getItem("sound-enabled")) {
        setEnabled(false);
        sessionStorage.setItem("sound-enabled", "false");
      }

      window.removeEventListener("click", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
    };
  }, []);

  return (
    <SoundNotifyContext.Provider
      value={{
        enabled,
        toggleSound,
        callEmployeeData,
        addCallEmployeeData,
        clearCallEmployee,
        newOrderNotify,
      }}
    >
      {children}
    </SoundNotifyContext.Provider>
  );
};
