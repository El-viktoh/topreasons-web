"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RentalCard } from "@/components/RentalCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useFavorites } from "@/hooks/useFavorites";
import { fetchRatingsForRentals } from "@/hooks/useRentalRating";
import { Heart, Loader2 } from "lucide-react";

interface Rental {
  id: string;
  title: string;
  location: string;
  price_per_day: number;
  image_url: string;
  images: string[];
  type: string;
  features: string[];
  available: boolean;
}

export default function Wishlist() {
  const router = useRouter();
  const { favorites, loading: favoritesLoading, isAuthenticated } = useFavorites();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [ratings, setRatings] = useState<Map<string, { averageRating: number; reviewCount: number }>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!favoritesLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [favoritesLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchFavoriteRentals = async () => {
      if (favorites.length === 0) {
        setRentals([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("rentals")
          .select("*")
          .in("id", favorites)
          .eq("approval_status", "approved");

        if (error) throw error;
        setRentals(data || []);

        if (data && data.length > 0) {
          const ratingsData = await fetchRatingsForRentals(data.map((r) => r.id));
          setRatings(ratingsData);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!favoritesLoading) fetchFavoriteRentals();
  }, [favorites, favoritesLoading]);

  if (favoritesLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {rentals.length > 0
              ? `You have ${rentals.length} saved rental${rentals.length > 1 ? "s" : ""}`
              : "Save your favorite rentals here"}
          </p>
        </div>

        {rentals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start exploring and save rentals you like by clicking the heart icon
            </p>
            <Button onClick={() => router.push("/cars")} className="mr-2">Browse Cars</Button>
            <Button variant="outline" onClick={() => router.push("/apartments")}>Browse Apartments</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((rental) => (
              <RentalCard
                key={rental.id}
                id={rental.id}
                title={rental.title}
                location={rental.location}
                price={rental.price_per_day}
                rating={ratings.get(rental.id)?.averageRating}
                reviewCount={ratings.get(rental.id)?.reviewCount}
                image={rental.image_url}
                images={rental.images}
                type={rental.type as "car" | "apartment"}
                features={rental.features || []}
                available={rental.available ?? true}
                showFavorite
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
