import React, { useState, useEffect } from "react";
import type { Food } from "../types/food";
import { IoIosClose } from "react-icons/io";
import IconDefault from "../assets/food-menu-3-svgrepo-com.png";
interface FoodTypes {
  food: Food | null;
  onClose: () => void;
}

function DetailData({ food, onClose }: FoodTypes) {
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    setQuantity(1);
    setNote("");
  }, [food]);

  const handleInputQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsed = parseInt(value);
    setQuantity(value === "" ? 1 : !isNaN(parsed) && parsed > 0 ? parsed : 1);
  };

  const handleAddToCart = async (food: Food) => {
    const cleanedNote = note.trim();
    const newItem = {
      id: food.id,
      name: food.name,
      price: food.price,
      quantity: quantity,
      note: cleanedNote,
    };
    type CartItem = {
      id: number;
      name: string;
      note: string;
      quantity: number;
      price: number;
    };
    const stored = sessionStorage.getItem("Order");
    const cartItems: CartItem[] = stored ? JSON.parse(stored) : [];

    if (cleanedNote === "") {
      const index = cartItems.findIndex(
        (item) => item.id === newItem.id && item.note === "",
      );

      if (index !== -1) {
        cartItems[index].quantity += newItem.quantity;
      } else {
        cartItems.push(newItem);
      }
    } else {
      cartItems.push(newItem);
    }

    sessionStorage.setItem("Order", JSON.stringify(cartItems));
    onClose();
  };

  if (!food) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="relative h-full w-full bg-white">
        <button
          className="absolute top-4 right-4 z-10 text-gray-400 transition hover:text-red-500"
          onClick={onClose}
        >
          <IoIosClose size={45} />
        </button>

        <div className="flex h-full flex-col px-6 pt-16 pb-24">
          <img
            src={food.imageUrl || IconDefault}
            alt={food.name}
            className={`mb-4 aspect-video w-full rounded-lg ${food.imageUrl ? "h-52 object-contain" : "h-48 object-contain"}`}
          />

          <div className="mb-2 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {food.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{food.description}</p>
          </div>

          <p className="mb-4 text-center text-xl font-bold text-blue-600">
            {food.price} ฿
          </p>

          <div className="mb-4 flex items-center justify-center gap-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-base font-bold hover:bg-gray-300"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              −
            </button>

            <input
              type="number"
              value={quantity}
              onChange={handleInputQty}
              min={1}
              className="no-spinner h-10 w-16 rounded-md border border-gray-300 text-center text-base outline-0"
            />

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-base font-bold hover:bg-gray-300"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              หมายเหตุเพิ่มเติม
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full resize-none rounded-md border border-gray-300 p-2 text-sm focus:outline-none"
            />
          </div>

          <div className="mt-auto" />

          <div className="absolute bottom-0 left-0 w-full px-6 py-4">
            <button
              onClick={() => handleAddToCart(food)}
              className="w-full rounded-lg bg-blue-600 py-3 text-lg font-medium text-white transition hover:bg-blue-700"
            >
              เพิ่มลงตะกร้า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailData;
