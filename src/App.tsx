
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FarmBridge from "./pages/FarmBridge";
import FarmerDashboard from "./pages/FarmerDashboard";
import OrdersPage from "./pages/OrdersPage";
import React, { useState } from "react";
import CustomerSupportDialog from "@/components/CustomerSupportDialog";

const queryClient = new QueryClient();

const App = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Home as Farmer Home/Dashboard */}
            <Route path="/" element={<Index />} />
            {/* Orders page route */}
            <Route path="/orders" element={<OrdersPage />} />
            {/* Farm Bridge custom route */}
            <Route path="/FARMBRIDGE" element={<FarmBridge />} />
            {/* Farmer Dashboard route */}
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Floating Customer Support Button */}
          <button
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-full shadow-lg hover:bg-green-800 focus:outline-none"
            onClick={() => setDialogOpen(true)}
            title="Customer Care & Chatbot"
          >
            <span className="sr-only">Open customer support dialog</span>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10V5a5 5 0 0110 0v5m1 4H6a2 2 0 01-2-2V9a2 2 0 012-2h12a2 2 0 012 2v3a2 2 0 01-2 2z"
              />
            </svg>
            Chatbot & Support
          </button>
          <CustomerSupportDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

