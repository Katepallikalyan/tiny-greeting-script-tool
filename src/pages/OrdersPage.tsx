
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  {
    merchant: "Farm Retailers",
    date: "2024-06-08",
    crop: "Maize",
    quantity: "40 kg",
    amount: "₹1000",
    status: "Delivered",
  },
];

const statusOptions = [
  { value: "All", label: "All Orders" },
  { value: "Pending", label: "Pending" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Delivered", label: "Delivered" },
];

const OrdersPage = () => {
  const [filter, setFilter] = useState<string>("All");
  const navigate = useNavigate();

  const filteredOrders =
    filter === "All"
      ? FAKE_ORDERS
      : FAKE_ORDERS.filter(order => order.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#f5f3ea] flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 bg-green-700 text-white rounded-b-2xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="font-bold text-lg">Orders (Past & Present)</div>
      </div>

      <div className="px-4 py-3">
        <div className="flex gap-2 mb-2">
          {statusOptions.map(opt => (
            <Button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`rounded-full text-xs ${
                filter === opt.value ? "bg-green-700 text-white" : "bg-green-100 text-green-800"
              }`}
            >
              {opt.label}
            </Button>
          ))}
        </div>
        <div className="space-y-2">
          {filteredOrders.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No orders found for this filter.</div>
          ) : (
            filteredOrders.map((order, idx) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
