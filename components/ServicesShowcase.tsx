"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const services = [
  {
    title: "AIRPORT SHUTTLE",
    description: "Premium, inclusive airport transfers. Real-time flight tracking and a 100% guaranteed on-time pickup.",
    image: "/assets/service_airport_africa.png",
    link: "/services/airport-shuttle",
  },
  {
    title: "EXECUTIVE SERVICE",
    description: "Seamless corporate travel management. Enjoy priority booking, fixed rates, and a dedicated account manager.",
    image: "/assets/service_business_v3.png",
    link: "/services/executive-service",
  },
  {
    title: "TAXI CHAUFFEUR",
    description: "The trusted choice for city travel. Safe, reliable, and professional drivers at your service.",
    image: "/assets/service_chauffeur_v6.png",
    link: "/services/taxi-chauffeur",
  },
  {
    title: "SELECT SERVICES",
    description: "The Service You Deserve with TopReasons self drive hire and chauffeur services.",
    image: "/assets/select_service_ghana.png",
    link: "/services/luxury-fleet",
  },
  {
    title: "COURIER SERVICES",
    description: "Fast, secure, and reliable package delivery. Track your parcels in real-time with our dedicated logistics network.",
    image: "/assets/service_courier_premium.png",
    link: "/services/courier-service",
  },
];

export function ServicesShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    handleScroll(); // Initialize
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-24 px-4 bg-background text-foreground overflow-hidden relative">
      {/* Decorative Right Side Pattern */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-16 md:w-24 lg:w-32 pointer-events-none z-0"
        style={{
          backgroundImage: 'url("/assets/bg_quality.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          opacity: 0.25,
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        }}
      />
      
      <div className="relative z-10 container mx-auto max-w-7xl">
        {/* Header & Arrows Section */}
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest mb-8">
            Our <span className="text-primary">Services</span>
          </h2>

          {/* Navigation Arrows */}
          <div className="flex gap-4">
            <button
              onClick={() => scrollBy(-400)}
              className="text-primary hover:text-foreground transition-colors p-1.5"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-8 h-8" strokeWidth={2.5} />
            </button>
            <button
              onClick={() => scrollBy(400)}
              className="text-primary hover:text-foreground transition-colors p-1.5"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-8 h-8" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory pb-4 gap-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {services.map((service, index) => (
            <div 
              key={index} 
              className="flex-none w-[90vw] md:w-[45vw] lg:w-[32vw] snap-start group"
            >
              {/* Clean Image Container (No Text Overlay) */}
              <div className="relative aspect-[4/3] w-full mb-6 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 32vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 flex items-center justify-center w-9 h-9 bg-background/80 backdrop-blur-sm text-primary text-xs font-bold border border-primary/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Text Content Below Image */}
              <div className="pr-6">
                <h3 className="text-2xl font-bold text-foreground mb-3 tracking-wide">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-[15px] mb-8 min-h-[3rem] leading-relaxed">
                  {service.description}
                </p>
                <Link
                  href={service.link}
                  className="inline-flex items-center text-foreground text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
                >
                  Learn More <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Progress Bar */}
        <div className="mt-16 w-full max-w-[80%] mx-auto">
          <div className="h-[2px] w-full bg-border relative">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${Math.max(15, scrollProgress)}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Hide native scrollbar for webkit browsers */}
      <style dangerouslySetInnerHTML={{__html: `
        div::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
