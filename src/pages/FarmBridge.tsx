
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleLogin from "@/components/auth/RoleLogin";

// This page will act as the entry point for Farm Bridge.
const FarmBridge = () => {
  // User authentication and role determination will go here (replace with real logic later)
  // For now, the login component handles login and "redirects" to dashboards (to be implemented)
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4">
      <div className="w-full max-w-md bg-card shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Farm Bridge</h1>
        <RoleLogin />
      </div>
    </div>
  );
};

export default FarmBridge;
