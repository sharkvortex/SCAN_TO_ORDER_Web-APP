import { useState, useRef } from "react";
import { CiCircleList } from "react-icons/ci";
import { useCategory } from "../hooks/Food/useCategory";
interface CategoryProps {
  selected: string;
  onSelect: (category: string) => void;
}

function Category({ selected, onSelect }: CategoryProps) {
  const { categry, loading } = useCategory();
  const [catSelected, setCateSelected] = useState<string | null>(selected);

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = (catName: string, index: number) => {
    setCateSelected(catName);
    onSelect(catName);
    const target = buttonRefs.current[index];
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };
  return (
    <div className="my-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xl font-semibold text-gray-700">หมวดหมู่ </p>
        <CiCircleList className="text-gray-700" size={25} />
      </div>
      <div className="scrollbar-hidden overflow-x-auto">
        <ul className="flex gap-3 py-2 whitespace-nowrap">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <li key={index}>
                  <div className="h-10 w-full animate-pulse rounded-full bg-gray-200 px-10 py-3"></div>
                </li>
              ))
            : [{ id: "all", name: "ทั้งหมด" }, ...categry].map((cat, index) => (
                <li key={cat.id}>
                  <button
                    ref={(el) => {
                      buttonRefs.current[index] = el;
                    }}
                    onClick={() => handleSelect(cat.name, index)}
                    className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
                      catSelected === cat.name
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                    } `}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
}

export default Category;
