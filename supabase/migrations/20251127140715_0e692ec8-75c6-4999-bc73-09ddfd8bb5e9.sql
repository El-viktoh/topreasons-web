-- Block manual profile insertion (profiles should only be created by trigger)
CREATE POLICY "Block manual profile insertion"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);