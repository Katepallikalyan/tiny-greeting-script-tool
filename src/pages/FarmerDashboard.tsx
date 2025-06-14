import React, { useState } from "react";
import { User, Settings, Camera, Bell, Home, ShoppingBag, BarChart2, HelpCircle, MessageSquare, Phone, CloudSun, ArrowRightLeft, Wallet } from "lucide-react";
import ProductCard from "@/components/farmer/ProductCard";
import UploadCropForm from "@/components/farmer/UploadCropForm";
import { Button } from "@/components/ui/button";

const FAKE_PRODUCTS = [
  {
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300",
    name: "Wheat / గోధుమలు",
    quantity: "100 kg",
    price: "₹20/kg",
    status: "Available",
  },
  {
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300",
    name: "Rice / బియ్యం",
    quantity: "200 kg",
    price: "₹30/kg",
    status: "Booked",
  },
];

// Telugu translation text
const TELUGU = {
  welcome: "స్వాగతం",
  location: "స్థానం",
  myProducts: "నా ఉత్పత్తులు",
  uploadCrop: "పంటను అప్‌లోడ్ చేయండి",
  orders: "ఆర్డర్లు",
  earnings: "ఆదాయం",
  help: "సహాయం",
  home: "హోమ్",
  quantity: "పరిమాణం",
  status: "స్థితి",
  price: "ధర",
  pending: "పెండింగ్",
  confirmed: "నిశ్చితమైన",
  delivered: "డెలివరీ",
};

const FAKE_ORDERS = [
  {
    merchant: "Shyam Traders",
    date: "2024-06-13",
    crop: "Wheat",
    quantity: "30 kg",
    amount: "₹600",
    status: "Confirmed",
  },
  {
    merchant: "GreenGodown",
    date: "2024-06-11",
    crop: "Rice",
    quantity: "10 kg",
    amount: "₹300",
    status: "Pending",
  },
];

const FarmerDashboard = () => {
  const farmer = {
    name: "Ramu",
    location: "Kadapa",
    profileImg: "https://randomuser.me/api/portraits/men/36.jpg",
  };

  const [crops, setCrops] = useState(FAKE_PRODUCTS);

  const handleCropAdded = (crop) => {
    setCrops(prev => [
      ...prev,
      {
        image: crop.image ? URL.createObjectURL(crop.image) : "", // show uploaded image immediately
        name: crop.name,
        quantity: crop.quantity,
        price: crop.price,
        status: "Available",
        quality: crop.quality,
        video: crop.video ? URL.createObjectURL(crop.video) : undefined
      }
    ]);
  };

  return (
    <div className="bg-[#f5f3ea] min-h-screen flex flex-col items-stretch">
      {/* Header */}
      <div className="flex items-center gap-2 justify-between px-4 py-3 bg-green-700 text-white rounded-b-2xl">
        <div>
          <div className="font-bold text-lg">{TELUGU.welcome}, {farmer.name}</div>
          <div className="text-xs">{TELUGU.location}: {farmer.location}</div>
        </div>
        <div className="flex items-center gap-2">
          <img src={farmer.profileImg} alt="Profile" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
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
          <h2 className="text-base font-semibold text-green-900 mb-2">{TELUGU.myProducts} / My Products</h2>
          {/* Remove old upload button, moved to inside form */}
        </div>
        <UploadCropForm existingCrops={crops} onCropAdded={handleCropAdded} />
        <div className="flex gap-2 overflow-x-auto py-2 hide-scrollbar">
          {crops.map((p, idx) => (
            <ProductCard key={idx} product={p} />
          ))}
        </div>
      </section>

      {/* Orders Summary */}
      <section className="px-4 mt-3">
        <h2 className="text-base font-semibold text-green-900 mb-2">Orders Summary / {TELUGU.orders}</h2>
        <div className="space-y-2">
          {FAKE_ORDERS.map((order, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow flex justify-between items-center py-2 px-3 text-sm">
              <div>
                <div className="font-medium">{order.merchant}</div>
                <div className="text-xs text-gray-500">{order.date} ・ {order.crop}</div>
              </div>
              <div>
                <div>{order.quantity}</div>
                <div className="text-green-700 font-bold">{order.amount}</div>
              </div>
              <div className="px-2 py-1 rounded bg-yellow-50 text-xs font-semibold text-yellow-800">
                {order.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Earnings Overview */}
      <section className="px-4 mt-3">
        <h2 className="text-base font-semibold text-green-900 mb-2">Earnings Overview / {TELUGU.earnings}</h2>
        <div className="bg-white rounded-xl shadow flex justify-between py-3 px-4 items-center mb-2">
          <div>
            <div className="text-xs text-gray-500">This Month</div>
            <div className="text-xl font-bold text-green-700">₹2,000</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <Wallet className="w-5 h-5 text-green-700" /><span className="text-sm">₹500</span>
            </div>
            <Button size="sm" className="mt-1 text-xs bg-green-200 text-green-900 rounded px-2 py-1 font-semibold">View Payment History</Button>
          </div>
        </div>
      </section>

      {/* Customer Care Support */}
      <section className="px-4 mt-3">
        <h2 className="text-base font-semibold text-green-900 mb-2">Customer Care Support / {TELUGU.help}</h2>
        <div className="flex gap-2">
          <Button className="flex-1 gap-2 bg-green-800 text-white px-2 py-3 text-sm rounded-lg">
            <Phone className="w-5 h-5" /> Call / కాల్ చేయండి
          </Button>
          <Button className="flex-1 gap-2 bg-yellow-600 text-white px-2 py-3 text-sm rounded-lg">
            <MessageSquare className="w-5 h-5" /> Chat / చాట్ చేయండి
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <HelpCircle className="w-5 h-5 text-green-700" />
          <span className="text-xs">Voice Assistant (Telugu) - <span className="underline cursor-pointer text-green-800">Try Now</span></span>
        </div>
      </section>

      {/* Weather & Tips */}
      <section className="px-4 mt-4">
        <div className="flex items-center gap-3 bg-blue-100 p-3 rounded-2xl shadow">
          <CloudSun className="w-9 h-9 text-yellow-400" />
          <div>
            <div className="text-sm font-semibold">27°C | లేత వాన</div>
            <div className="text-xs text-gray-500">Kadapa, 14 Jun • 2mm Rain</div>
          </div>
        </div>
        <div className="mt-2 bg-green-50 rounded-lg px-3 py-2 text-sm animate-pulse">
          పండ్ల ఉత్పత్తికి నీరు అవసరం. Water your crops for better yield! | Mandi Rate: ₹1,800/ton
        </div>
      </section>

      {/* Language Toggle */}
      <div className="fixed top-5 right-5 flex items-center z-50">
        <Button variant="secondary" size="sm" className="rounded-full px-4 py-2">తెలుగు / English</Button>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed left-0 bottom-0 w-full bg-white border-t border-green-100 flex items-center justify-around py-1 shadow z-30">
        <div className="flex flex-col items-center">
          <Home className="w-6 h-6 text-green-800" />
          <span className="text-xs">Home</span>
        </div>
        <div className="flex flex-col items-center">
          <ShoppingBag className="w-6 h-6 text-yellow-700" />
          <span className="text-xs">My Crops</span>
        </div>
        <div className="flex flex-col items-center">
          <BarChart2 className="w-6 h-6 text-green-700" />
          <span className="text-xs">Orders</span>
        </div>
        <div className="flex flex-col items-center">
          <ArrowRightLeft className="w-6 h-6 text-yellow-700" />
          <span className="text-xs">Earnings</span>
        </div>
        <div className="flex flex-col items-center">
          <HelpCircle className="w-6 h-6 text-green-700" />
          <span className="text-xs">Help</span>
        </div>
      </nav>
      {/* Padding for bottom nav */}
      <div className="h-16"></div>
    </div>
  );
};

export default FarmerDashboard;
