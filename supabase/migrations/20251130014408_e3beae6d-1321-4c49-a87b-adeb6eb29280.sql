-- Drop the problematic restrictive insert policy and recreate as permissive
DROP POLICY IF EXISTS "Verified renters can insert their own rentals" ON public.rentals;

-- Create a proper permissive insert policy for renters
CREATE POLICY "Verified renters can insert their own rentals"
ON public.rentals
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = owner_id 
  AND has_role(auth.uid(), 'renter')
);

-- Also ensure the user_roles insert policy is permissive for admins
DROP POLICY IF EXISTS "Admins can insert user roles" ON public.user_roles;

CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));