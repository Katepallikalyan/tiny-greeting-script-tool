
-- Create certifications table to store certification data
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  certification_type TEXT NOT NULL CHECK (certification_type IN ('farmer', 'product')),
  certifying_authority TEXT NOT NULL,
  validity_period DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure either farmer_id OR product_id is set, but not both
  CONSTRAINT check_certification_target CHECK (
    (farmer_id IS NOT NULL AND product_id IS NULL) OR 
    (farmer_id IS NULL AND product_id IS NOT NULL)
  )
);

-- Add RLS policies for certifications
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view approved certifications
CREATE POLICY "Anyone can view approved certifications" 
  ON public.certifications 
  FOR SELECT 
  USING (status = 'approved');

-- Allow admins to manage all certifications (assuming admin role exists)
CREATE POLICY "Admins can manage certifications" 
  ON public.certifications 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow farmers to view their own certification requests
CREATE POLICY "Farmers can view their certifications" 
  ON public.certifications 
  FOR SELECT 
  USING (
    farmer_id IN (
      SELECT id FROM public.farmers WHERE user_id = auth.uid()
    )
  );

-- Create index for better query performance
CREATE INDEX idx_certifications_farmer_id ON public.certifications(farmer_id);
CREATE INDEX idx_certifications_product_id ON public.certifications(product_id);
CREATE INDEX idx_certifications_status ON public.certifications(status);
