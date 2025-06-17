
import React from "react";
import { Wallet, TrendingUp, Clock, Plus } from "lucide-react";
import { Button } from "./button";
import { ModernCard, ModernCardContent } from "./card-modern";

interface WalletCardProps {
  balance: number;
  loading: boolean;
  onAddMoney: () => void;
  lockedAmount?: number;
}

export const WalletCard = ({ 
  balance, 
  loading, 
  onAddMoney, 
  lockedAmount = 0 
}: WalletCardProps) => {
  return (
    <ModernCard gradient className="bg-gradient-to-br from-green-50 to-emerald-100">
      <ModernCardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Wallet Balance</h3>
              <p className="text-sm text-green-700">Available funds</p>
            </div>
          </div>
          <Button 
            onClick={onAddMoney}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Money
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-700">Available Balance</span>
            <span className="text-2xl font-bold text-green-900">
              {loading ? "Loading..." : `₹${balance.toLocaleString()}`}
            </span>
          </div>
          
          {lockedAmount > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-700">Locked Amount</span>
              </div>
              <span className="text-lg font-semibold text-yellow-800">
                ₹{lockedAmount.toLocaleString()}
              </span>
            </div>
          )}
          
          <div className="pt-2 border-t border-green-200">
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>Total: ₹{(balance + lockedAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </ModernCardContent>
    </ModernCard>
  );
};
