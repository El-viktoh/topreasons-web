"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RentalCard } from "@/components/RentalCard";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { Car, CarFront, Sparkles, ShieldCheck, Navigation, Mountain, Crown, Bus, ArrowRight, Grid3X3, Zap } from "lucide-react";
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

const services = [
  { 
    title: "BASIC", 
    description: "Affordable and reliable transport for your daily urban needs.", 
    icon: Car, 
    image: "/assets/services/basic.png",
    link: "/cars/list?category=BASIC" 
  },
  { 
    title: "STANDARD", 
    description: "Modern comfort and efficiency for every journey across Ghana.", 
    icon: CarFront, 
    image: "/assets/services/standard.png",
    link: "/cars/list?category=STANDARD" 
  },
  { 
    title: "SALOON PLUS", 
    description: "Enhanced space and premium features for a smoother, superior ride.", 
    icon: Sparkles, 
    image: "/assets/services/saloon-plus.png",
    link: "/cars/list?category=SALOON PLUS" 
  },
  { 
    title: "LUXURY", 
    description: "Versatile and stylish options for those who demand more from their travel.", 
    icon: ShieldCheck, 
    image: "/assets/services/premium.png",
    link: "/cars/list?category=LUXURY" 
  },
  { 
    title: "COMPACT SUV'S", 
    description: "Perfect balance of efficiency and space for urban and light off-road travel.", 
    icon: Navigation, 
    image: "/assets/services/premium-suv.png",
    link: "/cars/list?category=COMPACT SUV'S" 
  },
  { 
    title: "PREMIUM SUV'S", 
    description: "Luxury and power combined for the ultimate driving experience.", 
    icon: Navigation, 
    image: "/assets/services/premium-suv.png",
    link: "/cars/list?category=PREMIUM SUV'S" 
  },
  { 
    title: "4X4's", 
    description: "Rugged performance for off-road adventures and tough terrains.", 
    icon: Mountain, 
    image: "/assets/services/4x4.png",
    link: "/cars/list?category=4X4's" 
  },
  { 
    title: "VANS", 
    description: "Versatile and spacious vans for all your transport needs.", 
    icon: Bus, 
    image: "/assets/services/vans-buses.png",
    link: "/cars/list?category=VANS" 
  },
  { 
    title: "Buses and Coaches", 
    description: "Large capacity buses and coaches for group travel and tours.", 
    icon: Bus, 
    image: "/assets/services/vans-buses.png",
    link: "/cars/list?category=Buses and Coaches" 
  },
  { 
    title: "MINI VANS", 
    description: "Comfortable and compact mini vans for family and small groups.", 
    icon: Bus, 
    image: "/assets/services/vans-buses.png",
    link: "/cars/list?category=MINI VANS" 
  },
  { 
    title: "EV'S", 
    description: "Eco-friendly, quiet electric vehicles for a sustainable and green drive.", 
    icon: Zap, 
    image: "/assets/services/ev.png",
    link: "/cars/list?category=EV'S" 
  },
];

export default function CarsLanding() {
  const [featuredRentals, setFeaturedRentals] = useState<Rental[]>([]);
  const [ratings, setRatings] = useState<Map<string, RatingData>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedRentals();
  }, []);

  const fetchFeaturedRentals = async () => {
    const { data, error } = await supabase
      .from("rentals")
      .select("*")
      .eq("available", true)
      .limit(4);

    if (!error && data) {
      setFeaturedRentals(data);
      const ratingsMap = await fetchRatingsForRentals(data.map((r) => r.id));
      setRatings(ratingsMap);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="relative py-32 px-4 overflow-hidden">
        <img src="/assets/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative z-10 container mx-auto text-center pt-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tight">
            Our <span className="text-primary">Offers</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Explore our diverse categories and find the perfect vehicle tailored to your needs.</p>
        </div>
      </section>

      {/* Offer Categories */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              return (
                <Link
                  key={service.title}
                  href={service.link}
                  className="group relative bg-card/30 backdrop-blur-sm border border-border rounded-none overflow-hidden hover:border-primary/50 transition-all duration-500 flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    {/* Replaced img with a cleaner background if image is broken, but standard img tag is fine */}
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      onError={(e) => {
                        // fallback image if the asset is missing
                        (e.target as HTMLImageElement).src = "/assets/service_business_v3.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="p-8 relative z-10 flex-grow flex flex-col -mt-16">
                    <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 flex-grow leading-relaxed text-sm">
                      {service.description}
                    </p>
                    <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] inline-flex items-center gap-3 group-hover:gap-4 transition-all mt-auto">
                      Explore Cars <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-20 px-4 bg-background border-t border-white/5">
        <div className="container mx-auto">
          <div className="bg-card rounded-3xl p-8 md:p-12 lg:px-20 border border-white/5 shadow-2xl relative">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-primary">
                  Featured Vehicles
                </h2>
              </div>
              <Link 
                href="/cars/list?category=ALL"
                className="hidden md:flex items-center text-primary text-sm font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-2xl bg-muted" />
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-1/2 bg-muted" />
                  </div>
                ))}
              </div>
            ) : featuredRentals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {featuredRentals.map((rental) => {
                const ratingData = ratings.get(rental.id);
                const rentalCategory = rental.features?.find(f => f.startsWith('category:'))?.replace('category:', '') || rental.type;
                const displayFeatures = rental.features?.filter(f => !f.startsWith('category:')) || [];
                
                return (
                  <RentalCard
                    key={rental.id}
                    id={rental.id}
                    title={rental.title}
                    location={rental.location}
                    price={rental.price_per_day}
                    rating={ratingData?.averageRating}
                    reviewCount={ratingData?.reviewCount}
                    image={rental.image_url || "/assets/service_business_v3.png"}
                    type={rentalCategory}
                    features={displayFeatures}
                    available={rental.available ?? true}
                  />
                );
              })}
            </div>
          ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No rentals available yet. Check back soon!</p>
              </div>
            )}
            
            <div className="text-center md:hidden mt-8">
              <Link 
                href="/cars/list?category=ALL"
                className="inline-flex items-center text-primary text-sm font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
