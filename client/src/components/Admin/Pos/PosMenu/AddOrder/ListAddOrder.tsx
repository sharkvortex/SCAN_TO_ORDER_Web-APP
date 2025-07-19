import { useEffect, useState, useMemo } from "react";
import { IoFastFood } from "react-icons/io5";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import { X } from "lucide-react";
import type { Food } from "@/types/food";
import type { tableType } from "@/types/tableType";
import { useAddOrder } from "@/hooks/Admin/useAddOrder";
import toast from "react-hot-toast";
type OrderItem = Food & {
  quantity: number;
  note: string;
};

type Props = {
  orderItems: OrderItem[];
  table: tableType;
  onSuccess: () => void;
  onChangeItems: (items: OrderItem[]) => void;
};

function ListAddOrder({ orderItems, table, onSuccess, onChangeItems }: Props) {
  const [open, setOpen] = useState(false);
  const [editableItems, setEditableItems] = useState<OrderItem[]>([]);
  useEffect(() => {
    setEditableItems(orderItems);
  }, [orderItems]);

  const handleQuantityChange = (index: number, value: number) => {
    setEditableItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = Math.max(1, value || 1);
      onChangeItems(updated);
      return updated;
    });
  };

  const handleNoteChange = (index: number, note: string) => {
    setEditableItems((prev) => {
      const updated = [...prev];
      updated[index].note = note;
      onChangeItems(updated);
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setEditableItems((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      onChangeItems(updated);
      return updated;
    });
  };

  const totalPrice = useMemo(
    () =>
      editableItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [editableItems],
  );
  const { addOrder } = useAddOrder();
  const [onConfirmOrder, setOnConfirmOrder] = useState<boolean>(false);
  const handlerAddOder = async () => {
    try {
      const response = await addOrder(
        { orderItems: editableItems },
        table.tableNumber,
      );
      setOnConfirmOrder(false);
      setOpen(false);
      toast.success("เพิ่มออเดอร์สำเร็จ");
      setEditableItems([]);
      onSuccess();
      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data.message || "เกิดข้อผิดพลาดลองใหม่ภายหลัง",
      );
    }
  };

  return (
    <>
      {onConfirmOrder && (
        <ConfirmDialog
          type="success"
          title="เพิ่มออเดอร์"
          description={`ยืนยันเพิ่มออเดอร์ โต๊ะ ${table.tableNumber}`}
          cancelText="ยกเลิก"
          confirmText="เพิ่มออเดอร์"
          onCancel={() => setOnConfirmOrder(false)}
          onConfirm={() => handlerAddOder()}
        />
      )}

      <div className="fixed top-25 right-6 z-49 sm:right-15">
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="relative flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-white shadow-xl transition hover:cursor-pointer hover:bg-green-700"
          >
            <IoFastFood size={20} />
            <span className="text-sm font-medium">ดูออเดอร์</span>
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {editableItems.length}
            </div>
          </button>
        ) : (
          <div
            className="relative flex h-[80vh] w-[360px] max-w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 sm:w-[400px]"
            style={{ bottom: 0, right: 0 }}
          >
            <div className="flex items-center justify-between bg-green-500 px-5 py-4">
              <h3 className="text-lg font-semibold text-white">
                รายการที่เลือก
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-white hover:cursor-pointer hover:text-red-500"
                aria-label="ปิดเมนูออเดอร์"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {editableItems.length === 0 ? (
                <p className="mt-10 text-center text-gray-400">
                  ยังไม่มีรายการอาหาร
                </p>
              ) : (
                <ul className="space-y-4">
                  {editableItems.map((item, index) => (
                    <li
                      key={`${item.id}-${index}`}
                      className="relative flex gap-4 rounded-xl bg-gray-50 p-3 shadow-sm"
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-800">
                            {item.name}
                          </h4>
                          <span className="text-sm font-bold text-green-600">
                            {item.price * item.quantity} ฿
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(index, item.quantity - 1)
                            }
                            className="rounded-full bg-red-500 p-2 text-white hover:bg-red-400"
                            aria-label={`ลดจำนวน ${item.name}`}
                          >
                            <FaMinus size={12} />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                Number(e.target.value),
                              )
                            }
                            className="no-spinner w-12 rounded-md border border-gray-300 text-center text-sm outline-none"
                            min={1}
                            aria-label={`จำนวน ${item.name}`}
                          />
                          <button
                            onClick={() =>
                              handleQuantityChange(index, item.quantity + 1)
                            }
                            className="rounded-full bg-green-500 p-2 text-white hover:bg-green-400"
                            aria-label={`เพิ่มจำนวน ${item.name}`}
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={item.note}
                          onChange={(e) =>
                            handleNoteChange(index, e.target.value)
                          }
                          placeholder="หมายเหตุ (ถ้ามี)"
                          className="mt-2 w-full rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-700 outline-0 placeholder:text-gray-400"
                          aria-label={`หมายเหตุ ${item.name}`}
                        />
                      </div>

                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="absolute top-11 right-2 text-red-500 hover:cursor-pointer hover:text-red-700"
                        aria-label={`ลบ ${item.name} จากออเดอร์`}
                      >
                        <MdDelete size={20} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {editableItems.length > 0 && (
              <div className="sticky bottom-0 bg-white px-5 py-4">
                <div className="mb-3 flex items-center justify-between text-sm text-gray-700">
                  <span>รวมทั้งหมด</span>
                  <span className="text-lg font-bold text-green-600">
                    {totalPrice} ฿
                  </span>
                </div>
                <button
                  onClick={() => setOnConfirmOrder(true)}
                  className="w-full rounded bg-green-600 py-2 font-semibold text-white shadow-md hover:cursor-pointer hover:bg-green-700 active:scale-95"
                >
                  ยืนยันออเดอร์
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ListAddOrder;
