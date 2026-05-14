"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) fetchFavorites(user.id);
      else setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchFavorites(session.user.id);
      else { setFavorites([]); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchFavorites = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("favorites").select("rental_id").eq("user_id", userId);
      if (error) throw error;
      setFavorites(data?.map((f) => f.rental_id) || []);
    } catch { } finally { setLoading(false); }
  };

  const toggleFavorite = async (rentalId: string) => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }

    const isFavorited = favorites.includes(rentalId);

    try {
      if (isFavorited) {
        const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("rental_id", rentalId);
        if (error) throw error;
        setFavorites((prev) => prev.filter((id) => id !== rentalId));
        toast.success("Removed from wishlist");
      } else {
        const { error } = await supabase.from("favorites").insert({ user_id: user.id, rental_id: rentalId });
        if (error) throw error;
        setFavorites((prev) => [...prev, rentalId]);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const isFavorite = (rentalId: string) => favorites.includes(rentalId);

  return { favorites, loading, toggleFavorite, isFavorite, isAuthenticated: !!user };
};
