import { useState } from "react";
import { useFood } from "../../../../../hooks/Food/useFood";
import { ShoppingCart } from "lucide-react";
import Category from "../../../../Category";
// import type { tableType } from "../../../../../Types/tableType";
import type { Food } from "../../../../../Types/food";

function FoodList({ onAddFood }: { onAddFood: (food: Food) => void }) {
  const { foods } = useFood();
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const filteredFoods =
    selectedCategory === "ทั้งหมด"
      ? foods
      : foods.filter((f) => f.category.name === selectedCategory);

  return (
    <>
      <div className="space-y-6">
        <Category
          selected={selectedCategory}
          onSelect={(cat) => setSelectedCategory(cat)}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredFoods.map((food) => (
            <div
              key={food.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-gray-200"
            >
              <div className="relative h-48 w-full overflow-hidden bg-gray-50">
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="h-full w-full object-contain transition-transform duration-300"
                />
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="mb-2">
                  <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
                    {food.name}
                  </h3>
                  {food.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {food.description}
                    </p>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className={`font-semibold text-blue-600`}>
                    {food.price}฿
                  </span>

                  <button
                    onClick={() => onAddFood(food)}
                    className="flex items-center gap-1.5 rounded-full bg-green-50 px-5 py-1.5 text-sm font-medium text-green-600 transition-all hover:cursor-pointer hover:bg-green-100"
                  >
                    <ShoppingCart size={16} />
                    <span>เพิ่ม</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FoodList;
