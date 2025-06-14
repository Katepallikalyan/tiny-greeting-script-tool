
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  // Get cart items from localStorage
  const items = JSON.parse(localStorage.getItem("merchant_cart") || "[]");

  const total = items.reduce((sum: number, item: any) => {
    const priceNum = Number((item.price_per_ton ?? item.price ?? "0").toString().replace(/[^0-9.]/g, ""));
    return sum + (priceNum * (item.quantity_tons ?? item.quantity ?? 1));
  }, 0);

  return (
    <div className="min-h-screen bg-[#f5f3ea] px-4 pb-20 flex flex-col">
      <div className="flex justify-between items-center py-4">
        <h1 className="font-bold text-2xl text-green-900 flex gap-2 items-center">
          <ShoppingCart className="w-7 h-7 text-green-700" />
          Cart
        </h1>
        <Button className="bg-yellow-700 text-white" onClick={() => navigate("/merchant/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
      {items.length === 0 ? (
        <div className="text-gray-600 text-center py-20">Cart is empty. Go add crops!</div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="bg-white rounded-lg p-4 shadow flex flex-col md:flex-row gap-3 items-center md:items-stretch">
              <img src={item.image} alt={item.name} className="w-32 h-24 rounded-lg object-cover" />
              <div className="flex-1 flex flex-col gap-1">
                <div className="font-semibold text-green-900">{item.name}</div>
                <div className="text-gray-700 text-sm">
                  Quantity: {item.quantity_tons ?? item.quantity} {item.unit ?? "tons"}
                </div>
                <div className="text-yellow-800 font-medium text-sm">
                  Price: ₹{item.price_per_ton ?? item.price}
                </div>
                <div className="text-green-700 text-sm">
                  Farmer: {item.farmer_name ?? "N/A"}
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end py-4">
            <div className="text-lg font-bold text-green-900">Total: ₹{total}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
