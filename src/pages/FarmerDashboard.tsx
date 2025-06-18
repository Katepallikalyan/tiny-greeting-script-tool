
import React, { useState } from "react";
import {
  User,
  Settings,
  Bell,
  Home,
  ShoppingBag,
  BarChart2,
  HelpCircle,
  MessageSquare,
  Phone,
  CloudSun,
  ArrowRightLeft,
} from "lucide-react";
import ProductCard from "@/components/farmer/ProductCard";
import UploadCropForm from "@/components/farmer/UploadCropForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CertificationBadge } from "@/components/ui/certification-badge";
import { useFarmerCertification } from "@/hooks/useCertifications";
import { supabase } from "@/integrations/supabase/client";

const FAKE_PRODUCTS = [
  {
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=300",
    name: "Wheat",
    quantity: "120 kg",
    price: "₹24/kg",
    status: "Available",
    quality: "Organic, A Grade",
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300",
    name: "Rice",
    quantity: "180 kg",
    price: "₹29/kg",
    status: "Booked",
    quality: "Premium, Polished",
  },
];

const FAKE_ORDERS = [
  {
    merchant: "Grain Kingdom",
    date: "2024-06-13",
    crop: "Wheat",
    quantity: "30 kg",
    amount: "₹720",
    status: "Confirmed",
  },
  {
    merchant: "Sunrise Traders",
    date: "2024-06-11",
    crop: "Rice",
    quantity: "50 kg",
    amount: "₹1450",
    status: "Pending",
  },
  {
    merchant: "Farm Retailers",
    date: "2024-05-28",
    crop: "Wheat",
    quantity: "40 kg",
    amount: "₹960",
    status: "Delivered",
  },
];

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const farmer = {
    name: "Ramu",
    location: "Kadapa",
    profileImg: "https://randomuser.me/api/portraits/men/36.jpg",
    id: "farmer-123",
  };
  const [crops, setCrops] = useState(FAKE_PRODUCTS);

  const { certification: farmerCertification } = useFarmerCertification(farmer.id);

  const handleCropAdded = async (crop) => {
    // Add to local state for immediate display
    const newCrop = {
      image: crop.image ? URL.createObjectURL(crop.image) : "",
      name: crop.name,
      quantity: crop.quantity,
      price: crop.price,
      status: "Available",
      quality: crop.quality,
    };
    setCrops((prev) => [...prev, newCrop]);

    // Save to database so it appears in merchant dashboard
    try {
      const priceValue = parseFloat(crop.price.replace(/[₹\/kg]/g, ''));
      const quantityValue = parseFloat(crop.quantity.replace(/[kg]/g, ''));
      
      const { error } = await supabase
        .from('products')
        .insert({
          name: crop.name,
          description: crop.quality,
          price: priceValue,
          unit: 'kg',
          quantity_tons: quantityValue / 1000, // Convert kg to tons
          farmer_id: farmer.id,
          in_stock: true,
          organic: crop.quality?.toLowerCase().includes('organic') || false,
          image: crop.image ? URL.createObjectURL(crop.image) : null
        });

      if (error) {
        console.error('Error saving product:', error);
      }
    } catch (error) {
      console.error('Error processing crop data:', error);
    }
  };

  return (
    <div className="bg-[#f5f3ea] min-h-screen flex flex-col items-stretch">
      {/* Header */}
      <div className="flex items-center gap-2 justify-between px-4 py-3 bg-green-700 text-white rounded-b-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="font-bold text-lg">Welcome, {farmer.name}</div>
            {farmerCertification && (
              <CertificationBadge 
                certification={farmerCertification} 
                type="farmer" 
                size="sm"
              />
            )}
          </div>
          <div className="text-xs">Location: {farmer.location}</div>
        </div>
        <div className="flex items-center gap-2">
          <img
            src={farmer.profileImg}
            alt="Profile"
            className="w-9 h-9 rounded-full border-2 border-white object-cover"
          />
          <Settings className="w-6 h-6 cursor-pointer" />
        </div>
      </div>

      {/* Notifications Bell */}
      <div className="flex justify-end px-4 pt-2">
        <Bell className="w-7 h-7 text-yellow-600" />
      </div>

      {/* My Products Section */}
      <section className="px-4 mt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-green-900 mb-2">
            My Products
          </h2>
        </div>
        <UploadCropForm
          existingCrops={crops}
          onCropAdded={handleCropAdded}
        />
        <div className="flex gap-2 overflow-x-auto py-2 hide-scrollbar">
          {crops.map((p, idx) => (
            <ProductCard key={idx} product={p} />
          ))}
        </div>
      </section>

      {/* Orders Summary */}
      <section className="px-4 mt-3">
        <h2 className="text-base font-semibold text-green-900 mb-2">
          Orders Summary
        </h2>
        <div className="space-y-2">
          {FAKE_ORDERS.map((order, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow flex justify-between items-center py-2 px-3 text-sm"
            >
              <div>
                <div className="font-medium">{order.merchant}</div>
                <div className="text-xs text-gray-500">
                  {order.date} ・ {order.crop}
                </div>
              </div>
              <div>
                <div>{order.quantity}</div>
                <div className="text-green-700 font-bold">
                  {order.amount}
                </div>
              </div>
              <div className="px-2 py-1 rounded bg-yellow-50 text-xs font-semibold text-yellow-800">
                {order.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Earnings Overview - Removed wallet references */}
      <section className="px-4 mt-3">
        <h2 className="text-base font-semibold text-green-900 mb-2">
          Earnings Overview
        </h2>
        <div className="bg-white rounded-xl shadow flex justify-between py-3 px-4 items-center mb-2">
          <div>
            <div className="text-xs text-gray-500">This Month</div>
            <div className="text-xl font-bold text-green-700">
              ₹3,000
            </div>
            <div className="text-xs text-gray-500">
              Last Month: ₹2,200
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <span className="text-sm">+₹800 Earned</span>
            </div>
            <Button
              size="sm"
              className="mt-1 text-xs bg-green-200 text-green-900 rounded px-2 py-1 font-semibold"
              onClick={() => navigate("/earnings")}
            >
              View Payment History
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow text-xs text-green-900">
          Highest earning crop: <span className="font-bold">Wheat</span>
        </div>
      </section>

      {/* Customer Care Support */}
      <section className="px-4 mt-3">
        <h2 className="text-base font-semibold text-green-900 mb-2">
          Customer Care Support
        </h2>
        <div className="flex gap-2">
          <Button className="flex-1 gap-2 bg-green-800 text-white px-2 py-3 text-sm rounded-lg">
            <Phone className="w-5 h-5" /> Call
          </Button>
          <Button className="flex-1 gap-2 bg-yellow-600 text-white px-2 py-3 text-sm rounded-lg">
            <MessageSquare className="w-5 h-5" /> Chat
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <HelpCircle className="w-5 h-5 text-green-700" />
          <span className="text-xs">Need help? Contact us anytime.</span>
        </div>
      </section>

      {/* Weather & Tips */}
      <section className="px-4 mt-4">
        <div className="flex items-center gap-3 bg-blue-100 p-3 rounded-2xl shadow">
          <CloudSun className="w-9 h-9 text-yellow-400" />
          <div>
            <div className="text-sm font-semibold">29°C | Light rain</div>
            <div className="text-xs text-gray-500">
              Kadapa, 14 Jun • 3mm Rain Expected
            </div>
          </div>
        </div>
        <div className="mt-2 bg-green-50 rounded-lg px-3 py-2 text-sm animate-pulse">
          Water your crops regularly for better yield! | Current Mandi Rate: ₹1,950/ton
        </div>
      </section>

      {/* Bottom Navigation Bar */}
      <nav className="fixed left-0 bottom-0 w-full bg-white border-t border-green-100 flex items-center justify-around py-1 shadow z-30">
        <button
          className="flex flex-col items-center focus:outline-none"
          onClick={() => navigate("/farmer/dashboard")}
        >
          <Home className="w-6 h-6 text-green-800" />
          <span className="text-xs">Home</span>
        </button>
        <button
          className="flex flex-col items-center focus:outline-none"
          onClick={() => navigate("/farmer/dashboard#mycrops")}
        >
          <ShoppingBag className="w-6 h-6 text-yellow-700" />
          <span className="text-xs">My Crops</span>
        </button>
        <button
          className="flex flex-col items-center focus:outline-none"
          onClick={() => navigate("/orders")}
        >
          <BarChart2 className="w-6 h-6 text-green-700" />
          <span className="text-xs">Orders</span>
        </button>
        <button
          className="flex flex-col items-center focus:outline-none"
          onClick={() => navigate("/earnings")}
        >
          <ArrowRightLeft className="w-6 h-6 text-yellow-700" />
          <span className="text-xs">Earnings</span>
        </button>
        <button
          className="flex flex-col items-center focus:outline-none"
          onClick={() => navigate("/help")}
        >
          <HelpCircle className="w-6 h-6 text-green-700" />
          <span className="text-xs">Help</span>
        </button>
      </nav>
      <div className="h-16"></div>
    </div>
  );
};

export default FarmerDashboard;
