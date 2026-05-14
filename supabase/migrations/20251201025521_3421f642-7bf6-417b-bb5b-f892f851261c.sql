-- Add images array column to rentals table for multi-image support (up to 5 images)
ALTER TABLE public.rentals 
ADD COLUMN images text[] DEFAULT '{}';

-- Update any existing image_url to be the first element in images array
UPDATE public.rentals 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';