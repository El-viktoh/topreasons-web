"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface RatingData {
  averageRating: number;
  reviewCount: number;
}

export const useRentalRating = (rentalId: string) => {
  const [data, setData] = useState<RatingData>({ averageRating: 0, reviewCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      const { data: reviews, error } = await supabase.from("reviews").select("rating").eq("rental_id", rentalId);
      if (error) { setLoading(false); return; }
      if (reviews && reviews.length > 0) {
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        setData({ averageRating: Math.round(avg * 10) / 10, reviewCount: reviews.length });
      }
      setLoading(false);
    };
    fetchRating();
  }, [rentalId]);

  return { ...data, loading };
};

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
