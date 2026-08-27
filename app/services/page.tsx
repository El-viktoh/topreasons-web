"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { ArrowRight, Plane, Briefcase, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const services = [
  {
    title: "AIRPORT SHUTTLE",
    description: "Premium, inclusive airport transfers. Real-time flight tracking and a 100% guaranteed on-time pickup.",
    image: "/assets/service_airport_africa.png",
    link: "/services/airport-shuttle",
    icon: Plane,
  },
  {
    title: "EXECUTIVE SERVICE",
    description: "Seamless corporate travel management. Enjoy priority booking, fixed rates, and a dedicated account manager.",
    image: "/assets/service_business_v3.png",
    link: "/services/executive-service",
    icon: Briefcase,
  },
  {
    title: "TAXI CHAUFFEUR",
    description: "The trusted choice for city travel. Safe, reliable, and professional drivers at your service.",
    image: "/assets/service_chauffeur_v6.png",
    link: "/services/taxi-chauffeur",
    icon: Car,
  },
  {
    title: "SELECT SERVICES",
    description: "The Service You Deserve with TopReasons self drive hire and chauffeur services.",
    image: "/assets/select_service_ghana.png",
    link: "/services/luxury-fleet",
    icon: Car,
  },
  {
    title: "COURIER SERVICES",
    description: "Fast, secure, and reliable package delivery. Track your parcels in real-time with our dedicated logistics network.",
    image: "/assets/courier_hero_ghana.png",
    link: "/services/courier-service",
    icon: Car,
  },
];

export default function ServicesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/assets/service_luxury_v4.png"
            alt="Our Services"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative z-10 container mx-auto text-center pt-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tight text-white">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Discover a new standard of travel. From seamless airport transfers to ultimate VIP luxury, we provide tailored transportation solutions across Ghana.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="group relative overflow-hidden bg-card border border-border flex flex-col h-full">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  <div className="p-8 flex flex-col flex-1 relative z-10 bg-card">
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 group-hover:text-primary transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">
                      {service.description}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-fit uppercase tracking-widest text-xs rounded-sm hover:bg-primary hover:text-primary-foreground border-primary/50 text-primary transition-all group-hover:border-primary"
                      onClick={() => router.push(service.link)}
                    >
                      Explore Service
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6">
            Ready to experience the best?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-10 max-w-xl mx-auto">
            Book your next journey with us today and discover why we are the top choice for premium transportation in Ghana.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="uppercase tracking-widest font-bold px-10 py-6 text-sm"
            onClick={() => router.push("/cars")}
          >
            Book Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
