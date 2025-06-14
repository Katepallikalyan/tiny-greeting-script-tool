
import React, { useState } from "react";
import UploadCropForm from "@/components/farmer/UploadCropForm";
import ProductCard from "@/components/farmer/ProductCard";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const FAKE_PRODUCTS = [
  {
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=300", // wheat field - new
    name: "Wheat",
    quantity: "100 kg",
    price: "₹20/kg",
    status: "Available",
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300", // rice paddy - new
    name: "Rice",
    quantity: "200 kg",
    price: "₹30/kg",
    status: "Booked",
  },
];

const Index = () => {
  const [crops, setCrops] = useState(FAKE_PRODUCTS);
  const navigate = useNavigate();

  const handleCropAdded = crop => {
    setCrops(prev => [
      ...prev,
      {
        image: crop.image ? URL.createObjectURL(crop.image) : "",
        name: crop.name,
        quantity: crop.quantity,
        price: crop.price,
        status: "Available",
        quality: crop.quality,
        // no video any more
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#f5f3ea] flex flex-col px-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center py-4">
        <h1 className="font-bold text-2xl text-green-900">Farm Home</h1>
        <Button
          className="gap-2 bg-yellow-700 text-white rounded-lg"
          onClick={() => navigate("/orders")}
        >
          <ShoppingBag className="w-5 h-5" />
          View My Orders
        </Button>
      </div>

      {/* Upload Crop Section */}
      <section>
        <h2 className="text-lg font-semibold text-green-900 mb-2">
          Upload Your Crop
        </h2>
        <UploadCropForm existingCrops={crops} onCropAdded={handleCropAdded} />
      </section>

      {/* My Crops Section */}
      <section className="mt-4">
        <h2 className="text-lg font-semibold text-green-900 mb-2">
          My Crops
        </h2>
        {crops.length === 0 ? (
          <div className="text-gray-500 text-center py-10">No crops uploaded yet.</div>
        ) : (
          <div className="flex gap-2 overflow-x-auto py-2 hide-scrollbar">
            {crops.map((p, idx) => (
              <ProductCard key={idx} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
