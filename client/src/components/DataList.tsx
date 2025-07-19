import { useState } from "react";
import type { Food } from "../types/food";
import Category from "./Category";
import Basket from "./Basket";
import DetailData from "./DetailData";
import { useFood } from "../hooks/Food/useFood";
import IconDefault from "../assets/food-menu-3-svgrepo-com.png";

function DataList() {
  const { foods, loading } = useFood();
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [openDetail, setOpenDetail] = useState(false);
  const [food, setFood] = useState<Food | null>(null);

  const filteredFoods =
    selectedCategory === "ทั้งหมด"
      ? foods
      : foods.filter((f) => f.category.name === selectedCategory);

  const handleOpenDetail = (food: Food) => {
    setFood(food);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setFood(null);
  };

  const Skeleton = () => (
    <div className="flex animate-pulse items-center space-x-4 rounded-lg bg-gray-100 p-3">
      <div className="h-20 w-20 rounded-md bg-gray-300" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-300" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  );

  return (
    <div>
      {!openDetail && !food ? (
        <>
          <Category
            selected={selectedCategory}
            onSelect={(cat) => setSelectedCategory(cat)}
          />

          <div className="space-y-4">
            {loading ? (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            ) : (
              <>
                {filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    onClick={() => handleOpenDetail(food)}
                    className="flex items-center rounded-lg p-3 transition hover:cursor-pointer hover:bg-gray-100"
                  >
                    <img
                      src={food.imageUrl || IconDefault}
                      alt={food.name}
                      className={`h-20 w-20 rounded-lg ${food.imageUrl ? "object-cover" : "object-contain py-2 shadow"}`}
                    />

                    <div className="flex flex-1 flex-col px-4">
                      <h3 className="text-base font-medium text-gray-800">
                        {food.name}
                      </h3>
                      <p className="line-clamp-2 text-sm text-gray-500">
                        {food.description}
                      </p>
                    </div>

                    <div className="text-right font-semibold whitespace-nowrap text-blue-600">
                      {food.price} ฿
                    </div>
                  </div>
                ))}

                {filteredFoods.length === 0 && (
                  <p className="py-8 text-center text-gray-500">
                    ไม่พบอาหารในหมวดนี้
                  </p>
                )}
              </>
            )}

            <Basket />
          </div>
        </>
      ) : (
        <DetailData food={food} onClose={handleCloseDetail} />
      )}
    </div>
  );
}

export default DataList;
