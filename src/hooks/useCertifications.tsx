
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Certification {
  id: string;
  certification_type: 'farmer' | 'product';
  certifying_authority: string;
  validity_period?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  farmer_id?: string;
  product_id?: string;
}

export interface CertificationRequest extends Certification {
  farmers?: {
    name: string;
    location: string;
  };
  products?: {
    name: string;
    description: string;
  };
}

export const useFarmerCertification = (farmerId: string) => {
  const [certification, setCertification] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertification = async () => {
      if (!farmerId) return;
      
      const { data } = await supabase
        .from('certifications')
        .select('*')
        .eq('farmer_id', farmerId)
        .eq('status', 'approved')
        .maybeSingle();

      if (data) {
        setCertification({
          ...data,
          certification_type: data.certification_type as 'farmer' | 'product',
          status: data.status as 'pending' | 'approved' | 'rejected' | 'expired'
        });
      }
      setLoading(false);
    };

    fetchCertification();
  }, [farmerId]);

  return { certification, loading };
};

export const useProductCertification = (productId: string) => {
  const [certification, setCertification] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertification = async () => {
      if (!productId) return;
      
      const { data } = await supabase
        .from('certifications')
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'approved')
        .maybeSingle();

      if (data) {
        setCertification({
          ...data,
          certification_type: data.certification_type as 'farmer' | 'product',
          status: data.status as 'pending' | 'approved' | 'rejected' | 'expired'
        });
      }
      setLoading(false);
    };

    fetchCertification();
  }, [productId]);

  return { certification, loading };
};

export const useCertificationRequests = () => {
  const [requests, setRequests] = useState<CertificationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data } = await supabase
        .from('certifications')
        .select(`
          *,
          farmers(name, location),
          products(name, description)
        `)
        .in('status', ['pending', 'approved', 'rejected']);

      if (data) {
        const typedData = data.map(item => ({
          ...item,
          certification_type: item.certification_type as 'farmer' | 'product',
          status: item.status as 'pending' | 'approved' | 'rejected' | 'expired'
        }));
        setRequests(typedData);
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  return { requests, loading, refetch: () => window.location.reload() };
};
