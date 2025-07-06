import React from "react";
import { useFood } from "../../../../../hooks/Food/useFood";
const mockFoods = [
  { id: 1, name: "ข้าวผัดหมู", price: 60 },
  { id: 2, name: "ต้มยำกุ้ง", price: 80 },
  { id: 3, name: "ผัดไทย", price: 70 },
  { id: 4, name: "แกงเขียวหวาน", price: 75 },
];

function FoodList() {
  const { foods } = useFood();
  console.log(foods);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {mockFoods.map((food) => (
        <div
          key={food.id}
          className="flex items-center justify-between rounded-xl border p-4 shadow-sm transition hover:shadow-md"
        >
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              {food.name}
            </h3>
            <p className="text-sm text-gray-500">{food.price} บาท</p>
          </div>
          <button className="rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
            เพิ่ม
          </button>
        </div>
      ))}
    </div>
  );
}

export default FoodList;
