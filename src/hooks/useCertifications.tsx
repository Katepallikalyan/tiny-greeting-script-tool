
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Certification {
  id: string;
  farmer_id?: string;
  product_id?: string;
  certification_type: "farmer" | "product";
  certifying_authority: string;
  validity_period?: string;
  notes?: string;
  status: string;
  approved_at?: string;
}

export const useCertifications = (farmerIds?: string[], productIds?: string[]) => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        let query = supabase
          .from("certifications")
          .select("*")
          .eq("status", "approved");

        // Filter by farmer IDs or product IDs if provided
        if (farmerIds && farmerIds.length > 0) {
          query = query.in("farmer_id", farmerIds);
        }
        
        if (productIds && productIds.length > 0) {
          query = query.in("product_id", productIds);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching certifications:", error);
          setCertifications([]);
        } else {
          setCertifications(data || []);
        }
      } catch (error) {
        console.error("Fetch certifications error:", error);
        setCertifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, [farmerIds, productIds]);

  return { certifications, loading };
};

export const useFarmerCertification = (farmerId?: string) => {
  const { certifications, loading } = useCertifications(farmerId ? [farmerId] : []);
  
  const farmerCertification = certifications.find(
    cert => cert.farmer_id === farmerId && cert.certification_type === "farmer"
  );

  return { certification: farmerCertification, loading };
};

export const useProductCertification = (productId?: string) => {
  const { certifications, loading } = useCertifications([], productId ? [productId] : []);
  
  const productCertification = certifications.find(
    cert => cert.product_id === productId && cert.certification_type === "product"
  );

  return { certification: productCertification, loading };
};
