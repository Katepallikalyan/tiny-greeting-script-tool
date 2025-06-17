
import React, { useState } from "react";
import UploadCropForm from "@/components/farmer/UploadCropForm";
import ProductCard from "@/components/farmer/ProductCard";
import { Button } from "@/components/ui/button";
import { QuickActionButtons } from "@/components/ui/quick-action-buttons";
import { LanguageSelector } from "@/components/ui/language-selector";
import { ModernCard, ModernCardContent } from "@/components/ui/card-modern";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, LogIn, Sprout, Users, Award } from "lucide-react";

const FAKE_PRODUCTS = [
  {
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=300",
    name: "Wheat",
    quantity: "100 kg",
    price: "₹20/kg",
    status: "Available",
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300",
    name: "Rice",
    quantity: "200 kg",
    price: "₹30/kg",
    status: "Booked",
  },
];

const Index = () => {
  const [crops, setCrops] = useState(FAKE_PRODUCTS);
  const navigate = useNavigate();

  const handleCropAdded = (crop: any) => {
    setCrops(prev => [
      ...prev,
      {
        image: crop.image ? URL.createObjectURL(crop.image) : "",
        name: crop.name,
        quantity: crop.quantity,
        price: crop.price,
        status: "Available",
        quality: crop.quality,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col px-4 pb-20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-600 rounded-xl">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-3xl text-green-900">Farm Bridge</h1>
            <p className="text-green-700 text-sm">Connecting Farmers & Merchants</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <LanguageSelector />
          <Button
            variant="outline"
            className="gap-2 text-green-900 bg-white border-green-300 hover:bg-green-50"
            onClick={() => navigate("/FARMBRIDGE")}
          >
            <LogIn className="w-5 h-5" />
            Login / Sign Up
          </Button>
          <Button
            className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            onClick={() => navigate("/orders")}
          >
            <ShoppingBag className="w-5 h-5" />
            My Orders
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ModernCard className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <ModernCardContent className="flex items-center gap-4">
            <Users className="w-10 h-10" />
            <div>
              <h3 className="text-2xl font-bold">1,500+</h3>
              <p className="text-green-100">Active Farmers</p>
            </div>
          </ModernCardContent>
        </ModernCard>
        
        <ModernCard className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
          <ModernCardContent className="flex items-center gap-4">
            <Sprout className="w-10 h-10" />
            <div>
              <h3 className="text-2xl font-bold">500+</h3>
              <p className="text-yellow-100">Crop Varieties</p>
            </div>
          </ModernCardContent>
        </ModernCard>
        
        <ModernCard className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <ModernCardContent className="flex items-center gap-4">
            <Award className="w-10 h-10" />
            <div>
              <h3 className="text-2xl font-bold">10,000+</h3>
              <p className="text-blue-100">Successful Orders</p>
            </div>
          </ModernCardContent>
        </ModernCard>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-green-900 mb-3">Quick Actions</h2>
        <QuickActionButtons userRole="farmer" />
      </div>

      {/* Upload Crop Section */}
      <section className="mb-6" id="upload-form">
        <ModernCard>
          <ModernCardContent>
            <h2 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
              <Sprout className="w-6 h-6 text-green-600" />
              Upload Your Crop
            </h2>
            <UploadCropForm existingCrops={crops} onCropAdded={handleCropAdded} />
          </ModernCardContent>
        </ModernCard>
      </section>

      {/* My Crops Section */}
      <section>
        <ModernCard>
          <ModernCardContent>
            <h2 className="text-lg font-semibold text-green-900 mb-4">
              My Crops ({crops.length})
            </h2>
            {crops.length === 0 ? (
              <div className="text-center py-10">
                <Sprout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No crops uploaded yet.</p>
                <p className="text-sm text-gray-400 mt-2">Start by uploading your first crop above!</p>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto py-2 hide-scrollbar">
                {crops.map((p, idx) => (
                  <ProductCard key={idx} product={p} />
                ))}
              </div>
            )}
          </ModernCardContent>
        </ModernCard>
      </section>
    </div>
  );
};

export default Index;
