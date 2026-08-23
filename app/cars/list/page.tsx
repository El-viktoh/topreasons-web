"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RentalCard } from "@/components/RentalCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import { Search } from "lucide-react";
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

function CarsListContent() {
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get("category") || "ALL";

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [ratings, setRatings] = useState<Map<string, RatingData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [category, setCategory] = useState(defaultCategory);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("rentals").select("*");
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
      if (priceRange === "budget") matchesPrice = rental.price_per_day < 100;
      else if (priceRange === "mid") matchesPrice = rental.price_per_day >= 100 && rental.price_per_day < 250;
      else if (priceRange === "luxury") matchesPrice = rental.price_per_day >= 250;
      
      const rentalCategory = rental.features?.find(f => f.startsWith('category:'))?.replace('category:', '') || rental.type;
      const matchesCategory = category === "ALL" || rentalCategory === category;
      return matchesSearch && matchesPrice && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price_per_day - b.price_per_day;
      if (sortBy === "price-high") return b.price_per_day - a.price_per_day;
      return 0;
    });

  return (
    <>
      <section className="relative py-24 px-4 overflow-hidden">
        <img src="/assets/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tight">
            Our <span className="text-primary">Vehicles</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Browse our extensive fleet and find the perfect car for your journey.</p>
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
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-40 rounded-sm bg-card border-border">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Offers</SelectItem>
                  <SelectItem value="BASIC">Basic</SelectItem>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="SALOON PLUS">Saloon Plus</SelectItem>
                  <SelectItem value="LUXURY">Luxury</SelectItem>
                  <SelectItem value="PREMIUM SUV'S">Premium SUV's</SelectItem>
                  <SelectItem value="4X4's">4x4's</SelectItem>
                  <SelectItem value="VANS">Vans</SelectItem>
                  <SelectItem value="Buses and Coaches">Buses and Coaches</SelectItem>
                  <SelectItem value="MINI VANS">Mini Vans</SelectItem>
                  <SelectItem value="EV'S">EV's</SelectItem>
                  <SelectItem value="UNCATEGORIZED">Uncategorized</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full md:w-44 rounded-sm bg-card border-border">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="budget">Under GH₵100/day</SelectItem>
                  <SelectItem value="mid">GH₵100 - GH₵250/day</SelectItem>
                  <SelectItem value="luxury">GHS 250+/day</SelectItem>
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

      <section className="py-12 px-4 bg-background min-h-[50vh]">
        <div className="container mx-auto">
          <div className="bg-card rounded-sm p-6 md:p-10 border border-border shadow-2xl relative">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <Skeleton key={n} className="h-[400px] w-full rounded-sm" />
                ))}
              </div>
            ) : filteredRentals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRentals.map((rental) => {
                const ratingData = ratings.get(rental.id) || { averageRating: 0, reviewCount: 0 };
                const rentalCategory = rental.features?.find(f => f.startsWith('category:'))?.replace('category:', '') || rental.type;
                const displayFeatures = rental.features?.filter(f => !f.startsWith('category:')) || [];
                return (
                  <RentalCard 
                    key={rental.id} 
                    id={rental.id}
                    title={rental.title}
                    location={rental.location}
                    price={rental.price_per_day}
                    rating={ratingData.averageRating}
                    reviewCount={ratingData.reviewCount}
                    image={rental.image_url || "/assets/service_business_v3.png"}
                    type={rentalCategory}
                    features={displayFeatures}
                    available={rental.available ?? true}
                  />
                );
              })}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold mb-2 text-foreground">No vehicles found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default function CarsList() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Suspense fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
      }>
        <CarsListContent />
      </Suspense>
      <Footer />
    </div>
  );
}
