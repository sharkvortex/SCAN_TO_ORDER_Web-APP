import React, { useState, useMemo } from "react";
import { FaQrcode, FaDoorClosed } from "react-icons/fa";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import { useCreateQrcode } from "@/hooks/Admin/useCreateQrcode";
import type { tableType } from "@/types/tableType";
import toast from "react-hot-toast";
import { printTableQRCode } from "@/components/Admin/Pos/PosMenu/PrintQRCodeForm";
import { useCloseTable } from "@/hooks/Admin/useCloseTable";
interface manageItemsType {
  key: string;
  label: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverColor: string;
  textColor: string;
  confirmTitle: string;
  confirmDescription: string;
  onConfirm: () => void;
}

function ManageList({
  table,
  onSuccess,
}: {
  table: tableType;
  onSuccess: () => void;
}) {
  const { createQrcode } = useCreateQrcode();
  const { closeTable } = useCloseTable();
  const manageItems: manageItemsType[] = [
    {
      key: "createQR",
      label: "สร้างคิวอาร์โค้ดใหม่",
      icon: <FaQrcode size={28} className="mb-2 text-white" />,
      bgColor: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      textColor: "text-white",
      confirmTitle: "คุณต้องการสร้าง QR CODE ใหม่?",
      confirmDescription: "QR CODE เดิมอาจใช้งานไม่ได้อีก",
      onConfirm: async () => {
        try {
          const response = await createQrcode(table.tableNumber);
          if (response) {
            await printTableQRCode({
              qrUrl: response,
              table: table.tableNumber,
            });
            onSuccess();
            toast.success("สร้าง QR CODE สำเร็จ");
          }
        } catch (error) {
          toast.error("สร้าง QR CODE ล้มเหลว");
          console.error("Error creating QR code:", error);
        }
      },
    },
    {
      key: "closeTable",
      label: "ปิดโต๊ะ",
      icon: <FaDoorClosed size={28} className="mb-2 text-white" />,
      bgColor: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      textColor: "text-white",
      confirmTitle: "คุณแน่ใจหรือไม่ที่จะปิดโต๊ะนี้?",
      confirmDescription: "ถ้ายังไม่เช็คบิลจะไม่สามารถปิดโต๊ะได้",
      onConfirm: async () => {
        try {
          const response = await closeTable(table.tableNumber);
          if (response) {
            onSuccess();
            toast.success("ปิดโต๊ะสำเร็จ");
          }
        } catch (error: any) {
          switch (error?.response?.data.code) {
            case "TABLE_NUMBER_REQUIRED":
              toast.error("ไม่พบหมายเลขโต๊ะ");
              break;
            case "TABLE_NOT_FOUND":
              toast.error("ไม่พบโต๊ะ");
              break;
            case "TABLE_ALREADY_AVAILABLE":
              toast.error("โต๊ะนี้ว่างอยู่แล้ว");
              break;
            case "ORDERS_EXIST":
              toast.error("ไม่สามารถปิดโต๊ะได้ เนื่องจากมีคำสั่งซื้ออยู่");
              break;
            default:
              toast.error("ปิดโต๊ะล้มเหลว");
          }

          console.error("Error closing table:", error);
        }
      },
    },
  ];
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<manageItemsType | null>(null);
  const handleItemClick = (item: manageItemsType) => {
    setCurrentItem(item);
    setOpen(true);
  };

  const handleConfirm = async () => {
    if (currentItem) {
      await currentItem.onConfirm();
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setCurrentItem(null);
  };

  return (
    <>
      {open && currentItem && (
        <ConfirmDialog
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          title={currentItem.confirmTitle}
          description={currentItem.confirmDescription}
          confirmText="ยืนยัน"
          cancelText="ยกเลิก"
          type="warn"
        />
      )}

      {manageItems.map((item) => (
        <div
          key={item.key}
          onClick={() => handleItemClick(item)}
          className={`cursor-pointer rounded-2xl px-4 py-6 text-center transition-all duration-200 active:scale-95 ${item.bgColor} ${item.hoverColor}`}
        >
          <div className="flex flex-col items-center justify-center">
            {item.icon}
            <h2
              className={`text-base font-medium md:text-lg ${item.textColor}`}
            >
              {item.label}
            </h2>
          </div>
        </div>
      ))}
    </>
  );
}

export default ManageList;
