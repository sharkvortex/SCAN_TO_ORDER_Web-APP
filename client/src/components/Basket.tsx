import { useEffect, useState } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { Link } from "react-router-dom";
function Basket() {
  const [quantity, setQuantity] = useState(0);

  const handleGetOrder = () => {
    const storedOrder = sessionStorage.getItem("Order");
    if (storedOrder) {
      const order = JSON.parse(storedOrder);

      const totalQty = order.reduce(
        (sum: number, item: { quantity: number }) => sum + (item.quantity || 0),
        0,
      );
      setQuantity(totalQty);
    } else {
      setQuantity(0);
    }
  };

  useEffect(() => {
    handleGetOrder();
  }, []);

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <Link to={"/basket"}>
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg transition-transform hover:scale-105 hover:cursor-pointer">
          <FaShoppingBasket className="text-3xl text-white" />

          {quantity > 0 && (
            <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow-md">
              {quantity}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default Basket;
