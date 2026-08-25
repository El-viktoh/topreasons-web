-- Allow user_id to be null for guest bookings
ALTER TABLE public.bookings ALTER COLUMN user_id DROP NOT NULL;

-- Add guest details columns
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS guest_name TEXT,
ADD COLUMN IF NOT EXISTS guest_email TEXT,
ADD COLUMN IF NOT EXISTS guest_phone TEXT;

-- Drop existing insert policy if it exists to replace it with an open one
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can insert a booking" ON public.bookings;

-- Allow anyone (including anon) to insert a booking
CREATE POLICY "Anyone can insert a booking"
ON public.bookings
FOR INSERT
WITH CHECK (
  -- If user_id is provided, it must match the authenticated user (for logged in users)
  -- If user_id is null, it's a guest booking (allowed for anyone)
  (auth.uid() = user_id) OR (user_id IS NULL)
);
