-- Drop renter-specific policies
DROP POLICY IF EXISTS "Verified renters can insert their own rentals" ON public.rentals;
DROP POLICY IF EXISTS "Verified renters can update their own rentals" ON public.rentals;
DROP POLICY IF EXISTS "Verified renters can delete their own rentals" ON public.rentals;

-- Update the public view policy to show all rentals (admin manages everything, no approval workflow)
DROP POLICY IF EXISTS "Anyone can view approved rentals" ON public.rentals;
CREATE POLICY "Anyone can view rentals"
ON public.rentals
FOR SELECT
TO public
USING (true);