
import React, { useState } from "react";
import { Check, X, Clock, User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useCertificationRequests, CertificationRequest } from "@/hooks/useCertifications";

export const CertificationManagement = () => {
  const { requests, loading, refetch } = useCertificationRequests();
  const [selectedRequest, setSelectedRequest] = useState<CertificationRequest | null>(null);
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleApprove = async (request: CertificationRequest) => {
    setProcessing(true);
    const { error } = await supabase
      .from('certifications')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        notes: notes || request.notes
      })
      .eq('id', request.id);

    if (!error) {
      refetch();
      setSelectedRequest(null);
      setNotes("");
    }
    setProcessing(false);
  };

  const handleReject = async (request: CertificationRequest) => {
    setProcessing(true);
    const { error } = await supabase
      .from('certifications')
      .update({
        status: 'rejected',
        notes: notes || "Certification request rejected"
      })
      .eq('id', request.id);

    if (!error) {
      refetch();
      setSelectedRequest(null);
      setNotes("");
    }
    setProcessing(false);
  };

  if (loading) return <div>Loading certifications...</div>;

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Certification Management</h1>
      
      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Pending Requests ({pendingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {request.certification_type === 'farmer' ? (
                      <User className="w-4 h-4 text-green-600" />
                    ) : (
                      <Package className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="font-medium">
                      {request.certification_type === 'farmer' 
                        ? request.farmers?.name 
                        : request.products?.name}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-yellow-600">
                    {request.certification_type}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p><strong>Authority:</strong> {request.certifying_authority}</p>
                  {request.validity_period && (
                    <p><strong>Valid until:</strong> {new Date(request.validity_period).toLocaleDateString()}</p>
                  )}
                  {request.notes && (
                    <p><strong>Notes:</strong> {request.notes}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedRequest(request);
                      setNotes(request.notes || "");
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedRequest(request);
                      setNotes("");
                    }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approved Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            Approved Certifications ({approvedRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {approvedRequests.map((cert) => (
              <div key={cert.id} className="border rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {cert.certification_type === 'farmer' ? (
                    <User className="w-4 h-4 text-green-600" />
                  ) : (
                    <Package className="w-4 h-4 text-blue-600" />
                  )}
                  <span className="font-medium">
                    {cert.certification_type === 'farmer' 
                      ? cert.farmers?.name 
                      : cert.products?.name}
                  </span>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  <Check className="w-3 h-3 mr-1" />
                  Certified
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {selectedRequest.certification_type === 'farmer' ? 'Farmer' : 'Product'} Certification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">
                  {selectedRequest.certification_type === 'farmer' 
                    ? selectedRequest.farmers?.name 
                    : selectedRequest.products?.name}
                </p>
                <p className="text-sm text-gray-600">
                  Authority: {selectedRequest.certifying_authority}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add certification notes..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(selectedRequest)}
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedRequest)}
                  disabled={processing}
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRequest(null);
                    setNotes("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
