import { X, ShoppingCart, History, Plus, Minus, Check } from "lucide-react";
import { FaTrash } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import ConfirmOrder from "../components/BasketDetail/ConfirmOrder";
import HistoryOrder from "../components/BasketDetail/HistoryOrder";

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  note?: string;
  image?: string;
}

function BasketDetail() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editingNote, setEditingNote] = useState<{
    id: number;
    note: string;
  } | null>(null);
  useEffect(() => {
    getOrderDetail();
  }, []);
  useEffect(() => {
    if (editingNote && textareaRef.current) {
      const el = textareaRef.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [editingNote]);
  const [inCart, setInCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<"order" | "history">("order");
  const [isAnimating, setIsAnimating] = useState<{
    id: number;
    note: string;
  } | null>(null);

  const [tempNote, setTempNote] = useState("");

  const handleSaveNote = (id: number, originalNote: string) => {
    const updatedCart = inCart.map((item) => {
      if (item.id === id && (item.note || "") === originalNote) {
        return { ...item, note: tempNote.trim() };
      }
      return item;
    });

    sessionStorage.setItem("Order", JSON.stringify(updatedCart));
    setInCart(updatedCart);
    setEditingNote(null);
  };

  const handleCancelNote = () => {
    setEditingNote(null);
  };

  const getOrderDetail = () => {
    const storedOrder = sessionStorage.getItem("Order");
    if (storedOrder) {
      const order = JSON.parse(storedOrder);
      setInCart(order);
    }
  };

  const handleRemove = (id: number, note: string) => {
    setIsAnimating({ id, note });
    setTimeout(() => {
      setInCart((prev) =>
        prev.filter(
          (item) => !(item.id === id && (item.note || "") === (note || "")),
        ),
      );

      const updatedCart = inCart.filter(
        (item: CartItem) =>
          !(item.id === id && (item.note || "") === (note || "")),
      );

      sessionStorage.setItem("Order", JSON.stringify(updatedCart));

      setIsAnimating(null);
    }, 300);
  };

  const handleQuantityChange = (id: number, note: string, delta: number) => {
    setInCart((prev) => {
      const updatedCart = prev
        .map((item) => {
          if (item.id === id && (item.note || "") === note) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) return null;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      const updatedStorageCart = inCart
        .map((item) => {
          if (item.id === id && (item.note || "") === note) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) return null;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean);

      sessionStorage.setItem("Order", JSON.stringify(updatedStorageCart));

      return updatedCart;
    });
  };

  const totalPrice = inCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalItems = inCart.reduce((sum, item) => sum + item.quantity, 0);

  const [onConfirmOrder, setOnConfirmOrder] = useState(false);

  return (
    <>
      {onConfirmOrder && (
        <ConfirmOrder
          totalItems={totalItems}
          totalPrice={totalPrice}
          onCancel={() => setOnConfirmOrder(false)}
        />
      )}

      <div className="relative flex min-h-screen w-full flex-col">
        <div className="rounded-b-4xl bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center justify-between px-6 py-6 text-white">
            <div className="flex items-center gap-3">
              <div className="relative"></div>
              <div>
                <h2 className="text-2xl font-bold drop-shadow-sm">
                  ตะกร้าของคุณ
                </h2>
                <p className="text-sm text-blue-100">{totalItems} รายการ</p>
              </div>
            </div>
            <Link to={"/"}>
              <button className="transform text-white transition-colors duration-200 hover:scale-110 hover:cursor-pointer hover:text-red-300">
                <X size={28} />
              </button>
            </Link>
          </div>
        </div>

        <div className="mx-6 mt-6 mb-4">
          <div className="relative rounded-2xl p-1">
            <div
              className={`absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out ${
                activeTab === "order" ? "right-1/2 left-1" : "right-1 left-1/2"
              }`}
            />
            <div className="relative grid grid-cols-2">
              <button
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  activeTab === "order"
                    ? "text-white"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab("order")}
              >
                <ShoppingCart size={18} />
                ออเดอร์ของคุณ
              </button>
              <button
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  activeTab === "history"
                    ? "text-white"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab("history")}
              >
                <History size={18} />
                ประวัติออเดอร์
              </button>
            </div>
          </div>
        </div>

        <div className="scrollbar-hidden flex-1 overflow-y-auto px-6">
          {activeTab === "order" ? (
            <div>
              {inCart.map((item, index) => (
                <div
                  key={`${item.id}-${item.note || "nonote"}`}
                  className={`transform transition-all duration-300 ${
                    isAnimating?.id === item.id &&
                    (isAnimating.note || "") === (item.note || "")
                      ? "-translate-x-full scale-95 opacity-0"
                      : "translate-x-0 scale-100 opacity-100"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="group bg-white p-5 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 text-sm font-semibold text-gray-800 transition-colors duration-300">
                          {item.name}
                        </h3>
                        {item.note && (
                          <div className="relative rounded-lg border border-yellow-200 bg-yellow-50/80 p-2 shadow transition-all">
                            {editingNote?.id === item.id &&
                            editingNote.note === (item.note || "") ? (
                              <>
                                <div className="flex items-start">
                                  <svg
                                    className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-yellow-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <textarea
                                    ref={textareaRef}
                                    className="w-full resize-none rounded text-sm text-yellow-800 focus:outline-none"
                                    rows={2}
                                    value={tempNote}
                                    name="note"
                                    onChange={(e) =>
                                      setTempNote(e.target.value)
                                    }
                                  />
                                </div>

                                <div className="mt-2 flex justify-end space-x-2">
                                  <button
                                    onClick={() =>
                                      handleSaveNote(item.id, item.note || "")
                                    }
                                    className="rounded-md bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-700"
                                  >
                                    บันทึก
                                  </button>
                                  <button
                                    onClick={handleCancelNote}
                                    className="rounded-md bg-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-300"
                                  >
                                    ยกเลิก
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-start">
                                  <svg
                                    className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-yellow-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <textarea
                                    readOnly
                                    className="w-full cursor-default resize-none bg-transparent text-sm text-yellow-800 outline-0"
                                    rows={2}
                                    name="note"
                                    value={item.note}
                                  />
                                </div>

                                <div className="mt-2 flex justify-end">
                                  <button
                                    onClick={() => {
                                      setEditingNote({
                                        id: item.id,
                                        note: item.note || "",
                                      });
                                      setTempNote(item.note || "");
                                    }}
                                    className="flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    ✏️ แก้ไข
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        <div className="mb-2 flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-600">
                            จำนวน:
                          </span>
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.note || "",
                                  -1,
                                )
                              }
                              className="rounded-lg bg-red-100 p-1 text-red-600 transition-colors duration-200"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 text-sm font-semibold text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.note || "",
                                  1,
                                )
                              }
                              className="rounded-lg bg-green-100 p-1 text-green-600 transition-colors duration-200"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            {item.price} ฿ × {item.quantity}
                          </div>
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-sm text-transparent">
                            {item.price * item.quantity} ฿
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id, item.note || "")}
                        className="rounded-lg bg-red-50 p-2 text-red-500 transition-all duration-200 hover:scale-110"
                        title="ลบออกจากตะกร้า"
                      >
                        <FaTrash size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {inCart.length === 0 && (
                <div className="py-16 text-center">
                  <div className="mb-4 text-6xl">🛒</div>
                  <p className="mb-2 text-xl text-gray-400">ตะกร้าว่างเปล่า</p>
                  <p className="text-gray-500">
                    เพิ่มสินค้าลงในตะกร้าเพื่อเริ่มการสั่งซื้อ
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              <HistoryOrder />
            </>
          )}
        </div>

        {activeTab === "order" && inCart.length > 0 && (
          <div>
            <div className="bottom-0 z-50 w-full space-y-2 bg-white px-6 py-6">
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-gray-600">รายการทั้งหมด</span>
                  <span className="text-sm">{totalItems} รายการ</span>
                </div>
                <div className="flex items-center justify-between text-xl font-bold">
                  <span className="text-sm text-gray-800">ยอดรวม</span>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-sm text-transparent">
                    {totalPrice} ฿
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setOnConfirmOrder(true)}
                  className="flex w-full transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-3 text-sm font-bold text-white transition-all duration-300 hover:cursor-pointer"
                >
                  <Check size={20} />
                  ยืนยันคำสั่งซื้อ ({totalPrice} ฿)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BasketDetail;
