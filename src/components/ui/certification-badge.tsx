
import React, { useState } from "react";
import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Certification {
  id: string;
  certifying_authority: string;
  validity_period?: string;
  notes?: string;
  approved_at?: string;
}

interface CertificationBadgeProps {
  certification?: Certification;
  type: "farmer" | "product";
  size?: "sm" | "md" | "lg";
}

export const CertificationBadge: React.FC<CertificationBadgeProps> = ({
  certification,
  type,
  size = "sm"
}) => {
  const [open, setOpen] = useState(false);

  if (!certification) {
    return null;
  }

  const badgeSize = {
    sm: "h-5 w-5",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1 hover:bg-green-50"
          title="View certification details"
        >
          <Badge className="bg-green-100 text-green-800 border-green-300 gap-1 hover:bg-green-200">
            <Check className={`${badgeSize[size]} text-green-600`} />
            <span className={textSize[size]}>Certified</span>
          </Badge>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-full">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            {type === "farmer" ? "Certified Farmer" : "Certified Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-1">Certifying Authority</h4>
            <p className="text-gray-900">{certification.certifying_authority}</p>
          </div>

          {certification.validity_period && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-1">Valid Until</h4>
              <p className="text-gray-900">
                {new Date(certification.validity_period).toLocaleDateString()}
              </p>
            </div>
          )}

          {certification.notes && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-1">Certification Notes</h4>
              <p className="text-gray-900">{certification.notes}</p>
            </div>
          )}

          {certification.approved_at && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-1">Certified On</h4>
              <p className="text-gray-900">
                {new Date(certification.approved_at).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Info className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-800">
              This {type} has been verified and meets our quality standards.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
