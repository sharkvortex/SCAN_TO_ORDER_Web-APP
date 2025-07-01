import React, { useContext } from "react";

export interface SoundNotifyContextType {
  enabled: boolean;
  toggleSound: () => void;
  callEmployeeData: { tableNumber: number; time: string }[];
  addCallEmployeeData: (data: { tableNumber: number; time: string }) => void;
  clearCallEmployee: () => void;
  newOrderNotify: { tableNumber: number; timestamp: number } | null;
}

export const SoundNotifyContext = React.createContext<
  SoundNotifyContextType | undefined
>(undefined);

export const useSoundNotify = (): SoundNotifyContextType => {
  const context = useContext(SoundNotifyContext);
  if (!context) {
    throw new Error("useSoundNotify must be used within a SoundNotifyProvider");
  }
  return context;
};
