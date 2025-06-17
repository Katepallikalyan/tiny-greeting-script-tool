
import React from "react";
import { cn } from "@/lib/utils";

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const ModernCard = ({ 
  children, 
  className, 
  hover = true, 
  gradient = false 
}: ModernCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300",
        hover && "hover:shadow-lg hover:scale-[1.02] hover:border-green-200",
        gradient && "bg-gradient-to-br from-white to-green-50",
        className
      )}
    >
      {children}
    </div>
  );
};

export const ModernCardHeader = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => {
  return (
    <div className={cn("p-4 border-b border-gray-100", className)}>
      {children}
    </div>
  );
};

export const ModernCardContent = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => {
  return (
    <div className={cn("p-4", className)}>
      {children}
    </div>
  );
};
