"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";
import { RentalCard } from "@/components/RentalCard";
import { ServicesShowcase } from "@/components/ServicesShowcase";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import { ArrowRight, Shield, Award, Users, Clock, Car, Plane, Briefcase, CarFront, Sparkles, ShieldCheck, Navigation, Mountain, Crown, Bus, MapPin } from "lucide-react";
import { fetchRatingsForRentals } from "@/hooks/useRentalRating";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    // Fetch a larger pool of available rentals
    const { data, error } = await supabase
      .from("rentals")
      .select("*")
      .eq("available", true)
      .limit(20);

    if (!error && data && data.length > 0) {
      // Shuffle the rentals randomly
      const shuffledData = [...data].sort(() => 0.5 - Math.random());
      
      setFeaturedRentals(shuffledData);
      const ratingsMap = await fetchRatingsForRentals(shuffledData.map((r) => r.id));
      setRatings(ratingsMap);
    }
    setLoading(false);
  };

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
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
        {/* Custom SVG Filters to reduce AI-ness (Film Grain + Realism) */}
        <svg className="hidden">
          <defs>
            <filter id="realistic-film">
              {/* Generate film grain noise */}
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" in="noise" result="coloredNoise" />
              {/* Blend noise over the image */}
              <feBlend in="SourceGraphic" in2="coloredNoise" mode="overlay" />
            </filter>
          </defs>
        </svg>

        <div className="absolute inset-0 w-full h-full" style={{ filter: "url(#realistic-film) contrast(0.98) saturate(0.85) brightness(0.95)" }}>
          <Image
            src="/assets/3_cars_for_Homepage_4.png"
            alt="Top Reasons premium car rental Ghana"
            fill
            sizes="100vw"
            priority
            quality={100}
            className="object-cover object-[center_55%] scale-[1.12]"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-[1]" />
        {/* Deep bottom fade to seamlessly blend into the trust section below */}
        <div className="absolute inset-x-0 bottom-0 h-[45vh] bg-gradient-to-t from-black via-black/50 to-transparent z-[2]" />

        <div className="relative z-10 container mx-auto px-4 flex-1 flex items-center justify-center md:justify-start">
          <div className="max-w-5xl flex flex-col items-center md:items-start text-center md:text-left w-full">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 uppercase tracking-tight leading-none text-white">
              WELCOME!
              <span className="block text-primary text-xl sm:text-2xl md:text-3xl mt-2">Dear Travel Partner</span>
            </h1>
            <div className="w-16 h-1 bg-primary mb-6" />
            <p className="hidden md:block text-lg md:text-xl mb-10 text-white/80 max-w-2xl leading-relaxed">
              TopReasons, your trusted travel partner, is Ghana’s most trusted one-stop solution for your travel experience. From premium car hire to airport shuttle or transfer service, courier services, airport assist, fast-track visa-on-arrival services, reliable taxi services, affordable luxury accommodation and exciting tour packages; all crafted for people travelling to, within and beyond Ghana.
            </p>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-sm px-8 py-6 rounded-none font-bold inline-flex items-center gap-3"
              onClick={() => router.push("/cars")}
            >
              Book Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pb-8">
          <div className="max-w-5xl mx-auto">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* What Sets Us Apart (New Redesign) */}
      <section className="relative py-20 md:py-24 bg-card overflow-hidden">
        {/* Background Decorative Africa Map - Right (Top Right) */}
        <div className="absolute top-[5%] lg:top-[12%] right-[5%] lg:right-[8%] w-[250px] lg:w-[350px] z-0 pointer-events-none opacity-20">
          <img
            src="/assets/africa_fingerprint_transparent.png"
            alt="Africa Gold Map"
            className="w-full h-auto"
            style={{ filter: "drop-shadow(0px 0px 15px rgba(243,167,18,0.2))" }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-14 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary uppercase tracking-tight leading-none">
              What Sets Us Apart
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left side: Fleet photo + real stat callouts */}
            <div className="w-full lg:w-[42%] flex flex-col gap-6">
              <div className="relative h-[320px] md:h-[380px] overflow-hidden shadow-2xl">
                <img
                  src="/assets/car-suv-black.jpg"
                  alt="Part of the TopReasons rental fleet"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute top-0 left-0 w-12 h-1.5 bg-primary" />
              </div>

              {/* Real stat callouts */}
              <div className="grid grid-cols-2 divide-x divide-border border border-border">
                <div className="px-6 py-5 text-center">
                  <div className="text-3xl md:text-4xl font-black text-primary tracking-tight">2018</div>
                  <div className="text-muted-foreground text-[11px] uppercase tracking-[0.2em] mt-1">Founded In</div>
                </div>
                <div className="px-6 py-5 text-center">
                  <div className="text-3xl md:text-4xl font-black text-primary tracking-tight">10+</div>
                  <div className="text-muted-foreground text-[11px] uppercase tracking-[0.2em] mt-1">Cities Covered</div>
                </div>
              </div>
            </div>

            {/* Right side: Feature Grid */}
            <div className="w-full lg:w-[58%]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">

                {/* Feature 1 */}
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                    <Crown className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-foreground text-lg font-bold tracking-wide">Premium Fleet</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Well-maintained fleet of quality vehicles offering superior comfort for every journey.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                    <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-foreground text-lg font-bold tracking-wide">Trusted Across Africa</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Ghana's trusted car rental company with a proven track record of exceptional service.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                    <Clock className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-foreground text-lg font-bold tracking-wide">Always On Time</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Wherever you need to be, we ensure prompt, dependable service — day or night.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                    <MapPin className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-foreground text-lg font-bold tracking-wide">10+ Cities Covered</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Extensive coverage across major cities and towns to support your travel needs.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Services - Addison Lee Style Carousel */}
      <ServicesShowcase />

      {/* Featured Vehicles */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto bg-card rounded-sm p-8 md:p-12 lg:px-16 border border-border shadow-2xl relative">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 uppercase tracking-widest text-center text-primary">
            Featured Vehicles
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            A snapshot of our top-rated fleet — browse the full lineup anytime.
          </p>
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
            <div className="relative px-6 sm:px-12 md:px-16 lg:px-20">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {featuredRentals.map((rental) => {
                    const ratingData = ratings.get(rental.id);
                    const rentalCategory = rental.features?.find((f) => f.startsWith("category:"))?.replace("category:", "") || rental.type;
                    const displayFeatures = rental.features?.filter((f) => !f.startsWith("category:")) || [];
                    return (
                      <CarouselItem key={rental.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <RentalCard
                          id={rental.id}
                          title={rental.title}
                          location={rental.location}
                          price={rental.price_per_day}
                          rating={ratingData?.averageRating}
                          reviewCount={ratingData?.reviewCount}
                          image={rental.image_url || "/placeholder.svg"}
                          type={rentalCategory}
                          features={displayFeatures}
                          available={rental.available ?? true}
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="absolute -left-2 sm:-left-8 md:-left-12 lg:-left-16 bg-primary text-primary-foreground border-none hover:bg-primary/80 hover:text-primary-foreground w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full opacity-100 disabled:opacity-50 transition-transform hover:scale-110 shadow-lg" />
                <CarouselNext className="absolute -right-2 sm:-right-8 md:-right-12 lg:-right-16 bg-primary text-primary-foreground border-none hover:bg-primary/80 hover:text-primary-foreground w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full opacity-100 disabled:opacity-50 transition-transform hover:scale-110 shadow-lg" />
              </Carousel>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No rentals available yet. Check back soon!</p>
            </div>
          )}
          <div className="flex justify-center mt-10">
            <Button
              className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-widest text-xs px-8 py-6 rounded-sm font-bold transition-all duration-300"
              onClick={() => router.push("/cars")}
            >
              See Our Offers
            </Button>
          </div>
        </div>
      </section>

      {/* Airport Transfer */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <img
          src="/assets/airport-transfer-v3.jpg"
          alt="Airport transfer service in Ghana"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/10 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-transparent to-70% z-[2]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[3]" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight text-white">Book Your Airport Transfer</h2>
            <p className="text-lg text-white/80 mb-8">
              Ready for your exciting trip to Ghana, need an airport transfer from any of Ghana’s local or international airports to your final destination? Choose from our wide range of offers: Basic, Standard, Premium and Luxury.
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
          src="/assets/business-account-hero.png"
          alt="Business car rental service"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />

        {/* Dark gradient on the right for text, fading to completely transparent on the left so the man stays bright */}
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/90 to-transparent w-full md:w-[70%] right-0 ml-auto z-[1]" />

        {/* Top and Bottom blends for smooth transition between sections */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-[3]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[3]" />

        <div className="relative z-10 container mx-auto px-4 w-full">
          <div className="max-w-xl ml-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight text-white">Business Accounts</h2>
            <p className="text-lg text-white/80 mb-8">
              Open a TopReasons Business Account and enjoy seamless corporate travel management with a range of benefits on car hires and airport transfers, priority booking for meetings and events, plus dedicated account managers to support your travel needs, and more.
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

      {/* Drive with TopReasons */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <img
          src="/assets/drive-with-us-chauffeur.png"
          alt="Drive with TopReasons mobility network"
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/10 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-transparent to-70% z-[2]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[3]" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-xl">
            <div className="w-12 h-1 bg-primary mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight text-white">Drive with TopReasons</h2>
            <p className="text-lg text-white/80 mb-8">
              Become part of Ghana’s fastest-growing premium mobility network. Whether you drive an executive saloon, a spacious SUV, or a courier van, TopReasons gives you flexible hours, steady earnings, and the backing of a brand that professionals trust.
            </p>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-sm px-8 py-5 rounded-sm font-semibold group"
              onClick={() => router.push("/driver-application")}
            >
              Apply Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Our Clients & Partners */}
      <section className="py-24 px-4 bg-background border-y border-border">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-8 uppercase tracking-widest text-white">
            Our Clients & <span className="text-primary">Partners</span>
          </h2>

          <div className="relative w-full overflow-hidden flex gap-8 group">
            {/* Array of partners defined once to use in two identical animated tracks */}
            {[...Array(2)].map((_, trackIdx) => (
              <div 
                key={trackIdx} 
                className="flex shrink-0 animate-marquee items-center gap-8 md:gap-12 group-hover:[animation-play-state:paused]"
              >
                {[
                  { name: "Partner 1", src: "/assets/partners/14053364441.jpg" },
                  { name: "Diasporan Affairs", src: "/assets/partners/Diaspora-Affairs-logo-467x200-1.webp" },
                  { name: "Government of Ghana", src: "/assets/partners/coatofarmsofghanasvgpng_1585508918.png" },
                  { name: "Fidelity Bank", src: "/assets/partners/fidelity-bank-logo-696x387.jpg" },
                  { name: "Diasporan Affairs Office", src: "/assets/partners/gh_diasporan office.png" },
                  { name: "GTBank", src: "/assets/partners/gtbank.png" },
                  { name: "Partner 2", src: "/assets/partners/images (1).jpg" },
                  { name: "Partner 3", src: "/assets/partners/images (1).png" },
                  { name: "Partner 4", src: "/assets/partners/images (2).png" },
                  { name: "Partner 5", src: "/assets/partners/images.jpeg" },
                  { name: "Partner 6", src: "/assets/partners/images.png" },
                  { name: "Partner 7", src: "/assets/partners/logo.png" },
                  { name: "Marriott Hotels", src: "/assets/partners/marriott-hotels-resorts-logo-png-transparent.png" },
                  { name: "Zenith Bank", src: "/assets/partners/zenith-bank-nigeria.jpg" },
                ].map((partner, idx) => (
                  <div key={idx} className="bg-white rounded-sm p-1 sm:p-2 relative w-28 h-20 sm:w-36 sm:h-24 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(243,167,18,0.4)]">
                    <img
                      src={partner.src}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                    />
                  </div>
                ))}
              </div>
            ))}
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
        <div className="absolute inset-0 bg-black/40 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent to-70% z-[2]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[3]" />
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
