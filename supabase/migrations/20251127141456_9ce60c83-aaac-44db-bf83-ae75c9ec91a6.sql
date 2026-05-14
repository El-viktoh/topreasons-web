-- Create renter_profiles table for verification details
CREATE TABLE public.renter_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT,
  business_license TEXT,
  id_document_url TEXT,
  business_document_url TEXT,
  bank_account_name TEXT,
  bank_account_number TEXT,
  bank_name TEXT,
  phone TEXT,
  address TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add owner_id and approval_status to rentals table
ALTER TABLE public.rentals 
ADD COLUMN owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN rejection_reason TEXT;

-- Enable RLS on renter_profiles
ALTER TABLE public.renter_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for renter_profiles
CREATE POLICY "Users can view their own renter profile"
ON public.renter_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own renter profile"
ON public.renter_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own renter profile"
ON public.renter_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all renter profiles"
ON public.renter_profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all renter profiles"
ON public.renter_profiles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update rentals RLS to allow verified renters to manage their own listings
CREATE POLICY "Verified renters can insert their own rentals"
ON public.rentals FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = owner_id 
  AND public.has_role(auth.uid(), 'renter')
);

CREATE POLICY "Verified renters can update their own rentals"
ON public.rentals FOR UPDATE
TO authenticated
USING (
  auth.uid() = owner_id 
  AND public.has_role(auth.uid(), 'renter')
);

CREATE POLICY "Verified renters can delete their own rentals"
ON public.rentals FOR DELETE
TO authenticated
USING (
  auth.uid() = owner_id 
  AND public.has_role(auth.uid(), 'renter')
);

-- Update the public view policy to only show approved rentals
DROP POLICY IF EXISTS "Anyone can view available rentals" ON public.rentals;
CREATE POLICY "Anyone can view approved rentals"
ON public.rentals FOR SELECT
USING (approval_status = 'approved' OR auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on renter_profiles
CREATE TRIGGER update_renter_profiles_updated_at
BEFORE UPDATE ON public.renter_profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();