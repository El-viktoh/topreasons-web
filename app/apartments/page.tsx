"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RentalCard } from "@/components/RentalCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import { Search, Building2 } from "lucide-react";
import { fetchRatingsForRentals } from "@/hooks/useRentalRating";

interface Rental {
  id: string;
  title: string;
  location: string;
  price_per_day: number;
  image_url: string | null;
  type: string;
  features: string[] | null;
  available: boolean | null;
}

interface RatingData {
  averageRating: number;
  reviewCount: number;
}

export default function Apartments() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [ratings, setRatings] = useState<Map<string, RatingData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("rentals").select("*").eq("type", "apartment");
    if (!error && data) {
      setRentals(data);
      const ratingsMap = await fetchRatingsForRentals(data.map((r) => r.id));
      setRatings(ratingsMap);
    }
    setLoading(false);
  };

  const filteredRentals = rentals
    .filter((rental) => {
      const matchesSearch =
        rental.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rental.location.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesPrice = true;
      if (priceRange === "budget") matchesPrice = rental.price_per_day < 150;
      else if (priceRange === "mid") matchesPrice = rental.price_per_day >= 150 && rental.price_per_day < 300;
      else if (priceRange === "premium") matchesPrice = rental.price_per_day >= 300;
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price_per_day - b.price_per_day;
      if (sortBy === "price-high") return b.price_per_day - a.price_per_day;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="relative py-24 px-4 overflow-hidden">
        <img src="/assets/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tight">
            Places To<span className="text-primary"> Stay</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Curated accommodations across Ghana — find your perfect place to stay.
          </p>
        </div>
      </section>

      <section className="py-6 px-4 border-b border-border bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-sm bg-card border-border"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full md:w-44 rounded-sm bg-card border-border">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="budget">Under GH₵150/night</SelectItem>
                  <SelectItem value="mid">GH₵150 - GH₵300/night</SelectItem>
                  <SelectItem value="premium">GH₵300+/night</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-44 rounded-sm bg-card border-border">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 py-12 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredRentals.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6 text-sm uppercase tracking-widest">
                {filteredRentals.length} place{filteredRentals.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRentals.map((rental) => {
                  const ratingData = ratings.get(rental.id);
                  return (
                    <RentalCard
                      key={rental.id}
                      id={rental.id}
                      title={rental.title}
                      location={rental.location}
                      price={rental.price_per_day}
                      rating={ratingData?.averageRating}
                      reviewCount={ratingData?.reviewCount}
                      image={rental.image_url || "/placeholder.svg"}
                      type="apartment"
                      features={rental.features || []}
                      available={rental.available ?? true}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 border border-primary/30 rounded-sm flex items-center justify-center">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">No Places Found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? "Try adjusting your search or filters" : "No accommodations are currently available. Check back soon!"}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="uppercase tracking-widest text-xs rounded-sm border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => { setSearchQuery(""); setPriceRange("all"); }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
