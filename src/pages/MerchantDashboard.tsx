
import React, { useEffect, useState } from "react";
import { ShoppingBag, Home, ShoppingCart, Image, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
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
  const [cartCount, setCartCount] = useState(0);

  // Update cart count
  const updateCartCount = () => {
    try {
      const currentCart = JSON.parse(localStorage.getItem("merchant_cart") || "[]");
      setCartCount(currentCart.length);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    // Listen for storage changes to update cart count
    const handleStorageChange = () => updateCartCount();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      console.log("Fetching crops from database...");
      
      // Fetch products with farmer information
      const { data: products, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          image,
          price,
          price_per_ton,
          quantity_tons,
          unit,
          description,
          farmer_id,
          in_stock,
          farmers!inner(name)
        `)
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load crops. Please try again.",
        });
        setCrops([]);
      } else if (products && products.length > 0) {
        console.log("Products fetched:", products);
        const formattedCrops = products.map((p: any) => ({
          ...p,
          farmer_name: p.farmers?.name || "Unknown Farmer",
        }));
        setCrops(formattedCrops);
      } else {
        console.log("No products found in database");
        setCrops([]);
      }
    } catch (error) {
      console.error("Fetch crops error:", error);
      toast({
        title: "Error",
        description: "Failed to load crops. Please check your connection.",
      });
      setCrops([]);
    } finally {
      setLoading(false);
    }
  };

  // Cart logic
  const addToCart = (crop: Crop) => {
    try {
      let currentCart: Crop[] = JSON.parse(localStorage.getItem("merchant_cart") || "[]");
      
      // Prevent duplicate items (by id)
      if (currentCart.find((item) => item.id === crop.id)) {
        toast({
          title: "Already in Cart",
          description: `${crop.name} is already in your cart.`,
        });
        return;
      }
      
      const updatedCart = [...currentCart, crop];
      localStorage.setItem("merchant_cart", JSON.stringify(updatedCart));
      updateCartCount();
      
      toast({
        title: "Added to Cart",
        description: `${crop.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
      });
    }
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-green-900">
            Available Farmer Crops
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-green-700 text-green-900"
              onClick={fetchCrops}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-green-700 text-green-900 relative"
              onClick={() => navigate("/cart")}
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5 text-green-700" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-gray-500 p-10 text-center flex flex-col items-center gap-2">
            <RefreshCw className="w-8 h-8 animate-spin text-green-700" />
            Loading crops...
          </div>
        ) : crops.length === 0 ? (
          <div className="text-gray-400 p-10 text-center bg-white rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <Image className="w-16 h-16 text-gray-300" />
              <div>
                <p className="text-lg font-medium">No crops available</p>
                <p className="text-sm">Check back later or refresh to see new uploads</p>
              </div>
              <Button onClick={fetchCrops} variant="outline" className="mt-2">
                Refresh
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {crops.map((crop) => (
              <div key={crop.id} className="bg-white rounded-xl shadow-md flex flex-col hover:shadow-lg transition-shadow">
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-t-xl overflow-hidden">
                  {crop.image ? (
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`${crop.image ? 'hidden' : ''} flex items-center justify-center w-full h-full`}>
                    <Image className="text-gray-400 w-12 h-12" />
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <div className="font-semibold text-green-900 text-lg">{crop.name}</div>
                  {crop.description && (
                    <div className="text-sm text-gray-700 line-clamp-2">{crop.description}</div>
                  )}
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
                    className="w-full bg-green-700 text-white hover:bg-green-800"
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
          className="flex flex-col items-center focus:outline-none relative"
          onClick={() => navigate("/cart")}
        >
          <ShoppingCart className="w-6 h-6 text-green-700" />
          <span className="text-xs">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
      <div className="h-16"></div>
    </div>
  );
};

export default MerchantDashboard;
