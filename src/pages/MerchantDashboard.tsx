
import React from "react";
import { ShoppingBag, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const merchant = {
    name: "Radha Traders",
    location: "Hyderabad",
    profileImg: "https://randomuser.me/api/portraits/women/70.jpg",
  };

  return (
    <div className="min-h-screen bg-[#f5f3ea] flex flex-col items-stretch">
      {/* Header */}
      <div className="flex items-center gap-2 justify-between px-4 py-3 bg-yellow-700 text-white rounded-b-2xl">
        <div>
          <div className="font-bold text-lg">Welcome, {merchant.name}</div>
          <div className="text-xs">Location: {merchant.location}</div>
        </div>
        <div className="flex items-center gap-2">
          <img
            src={merchant.profileImg}
            alt="Profile"
            className="w-9 h-9 rounded-full border-2 border-white object-cover"
          />
        </div>
      </div>

      {/* Explore Crops Section */}
      <section className="px-4 mt-6">
        <h2 className="text-base font-semibold text-green-900 mb-2">
          Explore Available Crops
        </h2>
        {/* You can expand this section later with product listings */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-green-700 mb-2" />
          <div className="font-semibold text-lg text-green-800 mb-3">
            Coming soon: See all available crops from farmers!
          </div>
          <Button
            className="bg-green-700 text-white"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </section>

      {/* Simple merchant nav */}
      <nav className="fixed left-0 bottom-0 w-full bg-white border-t border-yellow-100 flex items-center justify-around py-2 z-30">
        <button
          className="flex flex-col items-center focus:outline-none"
          onClick={() => navigate("/merchant/dashboard")}
        >
          <Home className="w-6 h-6 text-yellow-700" />
          <span className="text-xs">Merchant Home</span>
        </button>
        <button
          className="flex flex-col items-center focus:outline-none"
          onClick={() => navigate("/orders")}
        >
          <ShoppingBag className="w-6 h-6 text-green-800" />
          <span className="text-xs">Orders</span>
        </button>
      </nav>
      <div className="h-16"></div>
    </div>
  );
};

export default MerchantDashboard;

