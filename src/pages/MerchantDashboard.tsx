
import React, { useEffect, useState } from "react";
import { ShoppingBag, Home, ShoppingCart, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Minimal product type
type Crop = {
  id: string;
  name: string;
  image: string;
  price: number;
  price_per_ton?: number;
  quantity_tons?: number;
  unit?: string;
  farmer_id?: string;
  farmer_name?: string;
  description?: string;
};

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const merchant = {
    name: "Radha Traders",
    location: "Hyderabad",
    profileImg: "https://randomuser.me/api/portraits/women/70.jpg",
  };

  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch crops uploaded by farmers
    const fetchCrops = async () => {
      setLoading(true);
      // Join products + farmers for name
      let { data, error } = await supabase
        .from("products")
        .select("id,name,image,price,price_per_ton,quantity_tons,unit,description,farmer_id,farmer:farmer_id(name)")
        .eq("in_stock", true)
        .order("created_at", { ascending: false });
      if (!error && data) {
        setCrops(
          data.map((p: any) => ({
            ...p,
            farmer_name: p.farmer?.name,
          }))
        );
      }
      setLoading(false);
    };
    fetchCrops();
  }, []);

  // Cart logic
  const addToCart = (crop: Crop) => {
    let currentCart: Crop[] = [];
    try {
      currentCart = JSON.parse(localStorage.getItem("merchant_cart") || "[]");
    } catch {
      currentCart = [];
    }
    // Prevent duplicate items (by id)
    if (currentCart.find((item) => item.id === crop.id)) return;
    localStorage.setItem("merchant_cart", JSON.stringify([...currentCart, crop]));
    // Show success toast
    // Use the shadcn toast system
    import("@/hooks/use-toast").then(({ toast }) => {
      toast({
        title: "Added to Cart",
        description: `${crop.name} has been added to your cart.`,
      });
    });
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
          Available Farmer Crops
        </h2>
        <div className="flex justify-end mb-2">
          <Button
            variant="outline"
            className="gap-2 border-green-700 text-green-900"
            onClick={() => navigate("/cart")}
            title="View Cart"
          >
            <ShoppingCart className="w-5 h-5 text-green-700" />
            Cart
          </Button>
        </div>
        {loading ? (
          <div className="text-gray-500 p-10 text-center">Loading crops...</div>
        ) : crops.length === 0 ? (
          <div className="text-gray-400 p-10 text-center">
            No crops available. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {crops.map((crop) => (
              <div key={crop.id} className="bg-white rounded-xl shadow-md flex flex-col">
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-t-xl overflow-hidden">
                  {crop.image ? (
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Image className="text-gray-400 w-12 h-12" />
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <div className="font-semibold text-green-900 text-lg">{crop.name}</div>
                  <div className="text-sm text-gray-700">{crop.description}</div>
                  <div className="flex gap-2 items-center text-xs">
                    <span className="text-yellow-900 font-bold">
                      ₹{crop.price_per_ton ?? crop.price}/ton
                    </span>
                    <span className="text-gray-600">
                      Qty: {crop.quantity_tons ?? "-"} {crop.unit ?? "tons"}
                    </span>
                  </div>
                  <div className="text-green-700 text-xs">
                    Farmer: {crop.farmer_name ?? "N/A"}
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <Button
                    className="w-full bg-green-700 text-white"
                    onClick={() => addToCart(crop)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
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
        <button
          className="flex flex-col items-center focus:outline-none"
          onClick={() => navigate("/cart")}
        >
          <ShoppingCart className="w-6 h-6 text-green-700" />
          <span className="text-xs">Cart</span>
        </button>
      </nav>
      <div className="h-16"></div>
    </div>
  );
};

export default MerchantDashboard;
