
import React from "react";
import { BadgeCheck } from "lucide-react";

const statusColors: Record<string, string> = {
  Available: "bg-green-100 text-green-700",
  Booked: "bg-yellow-50 text-yellow-700",
  Sold: "bg-gray-200 text-gray-700",
};

interface ProductCardProps {
  product: {
    image: string;
    name: string;
    quantity: string;
    price: string;
    status: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="min-w-[150px] max-w-[170px] rounded-xl overflow-hidden shadow bg-white relative flex flex-col items-start">
      <img src={product.image} alt={product.name} className="h-24 w-full object-cover" />
      <div className="px-2 py-2 w-full flex flex-col gap-1">
        <div className="font-medium text-green-900 truncate">{product.name}</div>
        <div className="text-xs text-gray-700">{product.quantity}</div>
        <div className="text-xs text-yellow-800 font-semibold">{product.price}</div>
        <div className={`text-xs px-2 py-1 mt-1 rounded-full font-bold ${statusColors[product.status] || "bg-gray-100 text-gray-700"}`}>
          {product.status}
        </div>
      </div>
      {product.status === "Sold" && (
        <span className="absolute right-2 top-2">
          <BadgeCheck className="w-5 h-5 text-green-600" />
        </span>
      )}
    </div>
  );
};

export default ProductCard;
