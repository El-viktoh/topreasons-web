"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";
import { RentalCard } from "@/components/RentalCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import { ArrowRight, Shield, Award, Users, Clock, Car, Plane, Briefcase } from "lucide-react";
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

export default function Home() {
  const router = useRouter();
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

  const services = [
    { title: "Standard", description: "Quality vehicles for everyday travel across Ghana.", icon: Car, link: "/cars" },
    { title: "Airport Transfers", description: "Reliable pickup and drop-off at Kotoka International Airport.", icon: Plane, link: "/cars" },
    { title: "Business", description: "Premium vehicles for corporate travel and events.", icon: Briefcase, link: "/cars" },
  ];

  const features = [
    { icon: Shield, title: "Trusted", description: "Ghana's trusted car rental company with a proven track record of exceptional service." },
    { icon: Award, title: "Premium", description: "Well-maintained fleet of quality vehicles offering superior comfort for every journey." },
    { icon: Users, title: "Reliable", description: "Wherever you need to be, we ensure prompt, dependable service — day or night." },
    { icon: Clock, title: "Convenient", description: "Book online in seconds, pick up and go. Simple, fast, hassle-free car rental." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex flex-col justify-center overflow-hidden">
        <img
          src="/assets/hero-bg.jpg"
          alt="Top Reasons premium car rental Ghana"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 flex-1 flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 uppercase tracking-tight leading-none text-white">
              The Service
              <span className="block text-primary">You Deserve</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/80 max-w-lg">
              Rent quality cars across Ghana with Top Reasons — the trusted choice for airport transfers, city travel,
              and premium car rental in Accra.
            </p>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-sm px-8 py-6 rounded-sm font-semibold inline-flex items-center gap-3"
              onClick={() => router.push("/cars")}
            >
              Book Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pb-8">
          <BookingForm />
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 uppercase tracking-tight">
            Our<span className="text-primary"> Services</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  href={service.link}
                  className="group relative bg-card border border-border rounded-sm overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  <div className="p-8 md:p-10">
                    <div className="w-14 h-14 mb-6 bg-primary/10 rounded-sm flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 uppercase tracking-wide">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <span className="text-primary text-sm font-semibold uppercase tracking-widest inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Airport Transfer */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <img
          src="/assets/airport-transfer.jpg"
          alt="Airport transfer service in Ghana"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight text-white">Airport Transfers</h2>
            <p className="text-lg text-white/80 mb-8">
              Need a reliable ride to or from Kotoka International Airport? We offer fixed pricing, flight tracking, and
              on-time guaranteed service for a stress-free travel experience.
            </p>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-sm px-8 py-5 rounded-sm font-semibold"
              onClick={() => router.push("/cars")}
            >
              Find Out More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Business Accounts */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <img
          src="/assets/business-service.jpg"
          alt="Business car rental service"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-xl ml-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight text-white">Business Accounts</h2>
            <p className="text-lg text-white/80 mb-8">
              Open a Top Reasons business account and enjoy seamless corporate travel management with fixed rates,
              priority booking, and dedicated support for your organization.
            </p>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-sm px-8 py-5 rounded-sm font-semibold"
              onClick={() => router.push("/contact")}
            >
              Find Out More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 uppercase tracking-tight text-center">
            What Sets Us<span className="text-primary"> Apart</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 border border-primary/30 rounded-sm flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 uppercase tracking-tight">
            Featured<span className="text-primary"> Vehicles</span>
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredRentals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {featuredRentals.map((rental) => {
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
                    type={rental.type as "car" | "apartment"}
                    features={rental.features || []}
                    available={rental.available ?? true}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No rentals available yet. Check back soon!</p>
            </div>
          )}
          <div className="text-center">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-sm px-8 py-5 rounded-sm font-semibold"
              onClick={() => router.push("/cars")}
            >
              View All Cars
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Book Online CTA */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <img
          src="/assets/download-app.jpg"
          alt="Book online with Top Reasons"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight text-white">
              Book<span className="text-primary"> Online</span>
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Experience premium car rental at your fingertips. Book your vehicle online in just a few clicks — fast,
              reliable, and hassle-free.
            </p>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-sm px-8 py-5 rounded-sm font-semibold"
              onClick={() => router.push("/cars")}
            >
              Browse Cars
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 uppercase tracking-tight">
            About<span className="text-primary"> Top Reasons</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            Top Reasons is Ghana's leading car rental provider, trusted for reliable vehicles, airport transfers, and
            premium car hire services. Based in Accra, we offer seamless travel for both business and personal needs
            across Kumasi, Cape Coast, Tamale, and beyond.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            Our fleet of quality vehicles delivers comfort and reliability across the country. Corporate clients benefit
            from dedicated accounts with centralised booking and priority service.
          </p>
          <Button
            variant="outline"
            className="uppercase tracking-widest text-sm px-8 py-5 rounded-sm font-semibold border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => router.push("/about")}
          >
            Learn More
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
