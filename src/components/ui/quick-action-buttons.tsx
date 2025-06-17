
import React from "react";
import { Upload, Search, ShoppingCart, MessageCircle, Wallet } from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";

interface QuickActionButtonsProps {
  userRole?: 'farmer' | 'merchant';
}

export const QuickActionButtons = ({ userRole = 'farmer' }: QuickActionButtonsProps) => {
  const navigate = useNavigate();

  const farmerActions = [
    {
      icon: Upload,
      label: "Upload Crop",
      color: "bg-green-600 hover:bg-green-700",
      action: () => document.getElementById('upload-form')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      icon: Wallet,
      label: "Wallet",
      color: "bg-yellow-600 hover:bg-yellow-700",
      action: () => navigate('/earnings')
    },
    {
      icon: MessageCircle,
      label: "Support",
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => {}
    }
  ];

  const merchantActions = [
    {
      icon: Search,
      label: "Search Crops",
      color: "bg-green-600 hover:bg-green-700",
      action: () => navigate('/merchant/dashboard')
    },
    {
      icon: ShoppingCart,
      label: "My Cart",
      color: "bg-yellow-600 hover:bg-yellow-700",
      action: () => navigate('/cart')
    },
    {
      icon: Wallet,
      label: "Add Money",
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => {}
    }
  ];

  const actions = userRole === 'farmer' ? farmerActions : merchantActions;

  return (
    <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-xl shadow-sm">
      {actions.map((action, index) => (
        <Button
          key={index}
          onClick={action.action}
          className={`${action.color} text-white flex flex-col gap-2 h-20 text-xs font-medium transition-all duration-200 hover:scale-105`}
        >
          <action.icon className="w-6 h-6" />
          {action.label}
        </Button>
      ))}
    </div>
  );
};
