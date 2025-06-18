
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Eye, Calendar, User, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CertificationRequest {
  id: string;
  farmer_id?: string;
  product_id?: string;
  certification_type: "farmer" | "product";
  certifying_authority: string;
  validity_period?: string;
  notes?: string;
  status: string;
  created_at: string;
  farmers?: { name: string };
  products?: { name: string };
}

export const CertificationManagement: React.FC = () => {
  const [requests, setRequests] = useState<CertificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<CertificationRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchCertificationRequests();
  }, []);

  const fetchCertificationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("certifications")
        .select(`
          *,
          farmers(name),
          products(name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching certification requests:", error);
        toast({
          title: "Error",
          description: "Failed to load certification requests.",
        });
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCertificationStatus = async (
    id: string, 
    status: "approved" | "rejected",
    notes?: string
  ) => {
    try {
      const { error } = await supabase
        .from("certifications")
        .update({
          status,
          notes: notes || null,
          approved_at: status === "approved" ? new Date().toISOString() : null,
          // approved_by would be set to the current admin user ID in a real app
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating certification:", error);
        toast({
          title: "Error",
          description: "Failed to update certification status.",
        });
      } else {
        toast({
          title: "Success",
          description: `Certification ${status} successfully.`,
        });
        fetchCertificationRequests();
        setSelectedRequest(null);
        setAdminNotes("");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
      expired: { color: "bg-gray-100 text-gray-800", label: "Expired" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500">Loading certification requests...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-900 mb-6">Certification Management</h1>
      
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No certification requests found.
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    {request.certification_type === "farmer" ? (
                      <User className="h-5 w-5 text-green-600" />
                    ) : (
                      <Package className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {request.certification_type === "farmer" 
                        ? `Farmer: ${request.farmers?.name || "Unknown"}` 
                        : `Product: ${request.products?.name || "Unknown"}`
                      }
                    </h3>
                    <p className="text-sm text-gray-600">
                      Authority: {request.certifying_authority}
                    </p>
                    <p className="text-xs text-gray-500">
                      Requested: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusBadge(request.status)}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setAdminNotes(request.notes || "");
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Certification Request Details</DialogTitle>
                      </DialogHeader>
                      
                      {selectedRequest && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Type</h4>
                            <p className="capitalize">{selectedRequest.certification_type}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Authority</h4>
                            <p>{selectedRequest.certifying_authority}</p>
                          </div>
                          
                          {selectedRequest.validity_period && (
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Validity Period</h4>
                              <p>{new Date(selectedRequest.validity_period).toLocaleDateString()}</p>
                            </div>
                          )}
                          
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Notes</h4>
                            <Textarea
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Add certification notes..."
                              className="min-h-20"
                            />
                          </div>
                          
                          {selectedRequest.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => updateCertificationStatus(
                                  selectedRequest.id, 
                                  "approved", 
                                  adminNotes
                                )}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => updateCertificationStatus(
                                  selectedRequest.id, 
                                  "rejected", 
                                  adminNotes
                                )}
                                variant="destructive"
                                className="flex-1"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
