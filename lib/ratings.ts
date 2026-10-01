import { supabase } from "@/lib/supabase/client";

export interface RatingData {
  averageRating: number;
  reviewCount: number;
}

// Plain server-safe data fetcher (no client-only APIs) so it can be called
// from Server Components as well as client code.
export const fetchRatingsForRentals = async (rentalIds: string[]) => {
  if (rentalIds.length === 0) return new Map<string, RatingData>();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("rental_id, rating")
    .in("rental_id", rentalIds);

  if (error) return new Map<string, RatingData>();

  const ratingsMap = new Map<string, RatingData>();
  const grouped = reviews?.reduce((acc, review) => {
    if (!acc[review.rental_id]) acc[review.rental_id] = [];
    acc[review.rental_id].push(review.rating);
    return acc;
  }, {} as Record<string, number[]>) || {};

  for (const [rentalId, ratings] of Object.entries(grouped)) {
    const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    ratingsMap.set(rentalId, { averageRating: Math.round(avg * 10) / 10, reviewCount: ratings.length });
  }

  return ratingsMap;
};
