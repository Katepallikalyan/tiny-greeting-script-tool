
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Wallet, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const USER_ID_KEY = "merchant_user_id";

const paymentTypes = [
  { label: "PhonePe", value: "PhonePe" },
  { label: "GPay", value: "GPay" },
  { label: "Paytm", value: "Paytm" },
  { label: "Other", value: "Other" },
] as const;

type PaymentType = (typeof paymentTypes)[number]["value"];

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: string | number;
  price_per_ton?: string | number;
  quantity_tons?: number;
  quantity?: number;
  unit?: string;
  farmer_name?: string;
}

const CartPage = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<{ balance: number; loading: boolean }>({
    balance: 0,
    loading: true,
  });
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType | "">("");
  const [userId, setUserId] = useState<string | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);

  // Always get auth user on mount to ensure sync, fallback to localStorage for backward compatibility
  useEffect(() => {
    const getUserId = async () => {
      setCheckingUser(true);
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) {
        setUserId(data.user.id);
        localStorage.setItem(USER_ID_KEY, data.user.id); // Keep in sync
      } else {
        // Fallback to localStorage for old flow
        const id = localStorage.getItem(USER_ID_KEY);
        setUserId(id);
      }
      setCheckingUser(false);
    };
    getUserId();
  }, []);

  // Fetch wallet balance for merchant
  const fetchWallet = async () => {
    if (!userId) {
      setWallet({ balance: 0, loading: false });
      return;
    }
    setWallet((w) => ({ ...w, loading: true }));
    
    try {
      // First, ensure wallet exists for this user
      const { data: existingWallet } = await supabase
        .from("wallets")
        .select("id, balance")
        .eq("user_id", userId)
        .maybeSingle();

      if (!existingWallet) {
        // Create wallet if it doesn't exist
        const { data: newWallet, error: createError } = await supabase
          .from("wallets")
          .insert({ user_id: userId, balance: 0 })
          .select("balance")
          .single();
        
        if (!createError && newWallet) {
          setWallet({ balance: 0, loading: false });
        } else {
          console.error("Error creating wallet:", createError);
          setWallet({ balance: 0, loading: false });
        }
      } else {
        const parsedBalance = existingWallet.balance !== null && existingWallet.balance !== undefined ? parseFloat(String(existingWallet.balance)) : 0;
        setWallet({ balance: parsedBalance, loading: false });
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
      setWallet({ balance: 0, loading: false });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWallet();
    }
  }, [userId]);

  // Get cart items from localStorage with proper typing
  const items: CartItem[] = JSON.parse(localStorage.getItem("merchant_cart") || "[]");
  const total = items.reduce((sum: number, item: CartItem) => {
    // Ensure priceString is always a string type
    const priceString = String(item.price_per_ton ?? item.price ?? "0");
    const priceNum = Number(
      priceString.replace(/[^0-9.]/g, "")
    );
    return sum + priceNum * (item.quantity_tons ?? item.quantity ?? 1);
  }, 0);

  // Add money to wallet
  const handleAddMoney = async () => {
    if (!userId) {
      toast({ title: "Login required", description: "Please log in to use wallet." });
      return;
    }
    const amt = parseFloat(addAmount);
    if (isNaN(amt) || amt <= 0) {
      toast({ title: "Invalid Amount", description: "Enter a valid amount." });
      return;
    }
    if (!paymentType) {
      toast({ title: "Select Payment Type", description: "Choose a payment method to continue." });
      return;
    }
    
    try {
      setAddMoneyOpen(false);
      
      // Update wallet balance directly
      const newBalance = wallet.balance + amt;
      const { error: updateError } = await supabase
        .from("wallets")
        .upsert({ 
          user_id: userId, 
          balance: newBalance,
          updated_at: new Date().toISOString()
        });

      if (!updateError) {
        // Add transaction record
        const { error: transactionError } = await supabase
          .from("wallet_transactions")
          .insert({
            wallet_id: userId, // Using user_id as wallet reference
            amount: amt,
            transaction_type: "credit",
            description: `Added money via ${paymentType}`,
            status: "completed"
          });

        if (!transactionError) {
          toast({
            title: "Success",
            description: `₹${amt} added to your wallet using ${paymentType}.`,
          });
          fetchWallet();
          setAddAmount("");
          setPaymentType("");
        } else {
          console.error("Transaction record error:", transactionError);
          toast({ title: "Success", description: `₹${amt} added to wallet.` });
          fetchWallet();
          setAddAmount("");
          setPaymentType("");
        }
      } else {
        console.error("Wallet update error:", updateError);
        toast({ title: "Failed", description: "Could not add money to wallet." });
      }
    } catch (error) {
      console.error("Add money error:", error);
      toast({ title: "Failed", description: "Could not add money to wallet." });
    }
  };

  // Place order
  const handleOrder = async () => {
    if (!userId) {
      toast({ title: "Login required", description: "Please log in to order." });
      return;
    }
    if (items.length === 0) {
      toast({ title: "Empty Cart", description: "Add items before placing order." });
      return;
    }
    if (wallet.balance < total) {
      toast({
        title: "Insufficient Balance",
        description: "Add more money to your wallet to place the order.",
      });
      return;
    }
    setPlacingOrder(true);

    try {
      // 1. Insert a new order
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({ user_id: userId, total_price: total })
        .select("id")
        .single();
      
      if (orderErr || !order) {
        toast({
          title: "Order Error",
          description: orderErr?.message ?? "Could not place order.",
        });
        setPlacingOrder(false);
        return;
      }

      // 2. Insert items into order_items table
      const orderItemsData = items.map((item: CartItem) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity_tons ?? item.quantity ?? 1,
        price_at_purchase: Number(
          String(item.price_per_ton ?? item.price ?? "0").replace(/[^0-9.]/g, "")
        ),
      }));
      
      const { error: itemInsertErr } = await supabase.from("order_items").insert(orderItemsData);
      if (itemInsertErr) {
        toast({
          title: "Order Item Error",
          description: itemInsertErr.message,
        });
        setPlacingOrder(false);
        return;
      }

      // 3. Deduct wallet balance
      const { error: walletErr } = await supabase
        .from("wallets")
        .update({ balance: wallet.balance - total })
        .eq("user_id", userId);

      if (walletErr) {
        toast({
          title: "Wallet Update Error",
          description: walletErr.message,
        });
        setPlacingOrder(false);
        return;
      }

      // 4. Clear cart and show success
      localStorage.removeItem("merchant_cart");
      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully.",
      });
      setPlacingOrder(false);
      fetchWallet();
      setTimeout(() => {
        navigate("/orders");
      }, 1200);
    } catch (error) {
      console.error("Order placement error:", error);
      toast({
        title: "Order Error",
        description: "Failed to place order. Please try again.",
      });
      setPlacingOrder(false);
    }
  };

  // Show loading UI until we know login state
  if (checkingUser) {
    return <div className="min-h-screen bg-[#f5f3ea] flex flex-col items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f3ea] px-4 pb-20 flex flex-col">
      <div className="flex justify-between items-center py-4">
        <h1 className="font-bold text-2xl text-green-900 flex gap-2 items-center">
          <ShoppingCart className="w-7 h-7 text-green-700" />
          Cart
        </h1>
        <Button
          className="bg-yellow-700 text-white"
          onClick={() => navigate("/merchant/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
      
      {/* Wallet Info */}
      <div className="flex gap-4 items-center mb-4">
        <div className="flex items-center gap-2 bg-white border border-green-200 rounded-lg px-4 py-2">
          <Wallet className="w-5 h-5 text-yellow-700" />
          <span>
            Wallet:{" "}
            {wallet.loading ? "Loading..." : (
              <span className="text-green-900 font-bold text-base">
                ₹{wallet.balance}
              </span>
            )}
          </span>
        </div>
        <Button variant="outline" className="border-green-700 text-green-900 gap-2"
          onClick={() => setAddMoneyOpen(true)}>
          <PlusCircle className="w-5 h-5" /> Add Money
        </Button>
        
        {/* Add Money Dialog */}
        {addMoneyOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg min-w-[320px] flex flex-col gap-4">
              <div className="font-semibold text-lg mb-1 flex gap-2 items-center">
                <Wallet className="w-6 h-6 text-green-700" />
                Add Money to Wallet
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={addAmount}
                  min={1}
                  onChange={e => setAddAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm text-green-900">
                  Payment Method
                </label>
                <select
                  className="w-full border rounded-md p-2 text-base"
                  value={paymentType}
                  onChange={e => setPaymentType(e.target.value as PaymentType | "")}
                >
                  <option value="">Select Payment Type</option>
                  {paymentTypes.map(pt => (
                    <option key={pt.value} value={pt.value}>{pt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-yellow-700" onClick={handleAddMoney}>
                  Add
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setAddMoneyOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="text-gray-600 text-center py-20">
          Cart is empty. Go add crops!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item: CartItem, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-4 shadow flex flex-col md:flex-row gap-3 items-center md:items-stretch"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-24 rounded-lg object-cover"
              />
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
          <div className="flex justify-between items-center py-4">
            <div className="text-lg font-bold text-green-900">
              Total: ₹{total}
            </div>
            <Button
              className="bg-green-700 text-white"
              onClick={handleOrder}
              disabled={placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
