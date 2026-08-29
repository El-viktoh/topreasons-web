import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Map, ShieldCheck, Clock } from "lucide-react";

export default function TaxiChauffeurPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:h-screen sm:min-h-[600px] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80"
          alt="Taxi Chauffeur Service" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 uppercase tracking-tight leading-none text-foreground">
            Taxi <span className="text-primary">Chauffeur</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            The trusted choice for city travel. Safe, reliable, and professional drivers at your service 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/cars" 
              className="bg-primary text-primary-foreground font-bold py-4 px-8 uppercase tracking-widest hover:bg-primary/90 transition-colors inline-flex items-center justify-center"
            >
              Book Now <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* The Story Section (Split) */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=800&q=80" 
                  alt="City Traffic"
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight leading-none mb-6 text-foreground">
                Master The City <span className="text-primary block mt-2">Without The Stress</span>
              </h2>
              <div className="prose prose-invert prose-lg text-muted-foreground">
                <p className="mb-6">
                  Urban travel can be chaotic, but your journey shouldn't be. Our Taxi Chauffeur service provides a calm, safe, and efficient way to navigate the bustling city streets. Whether it's a daily commute, an evening out, or a quick dash across town, we are your reliable partner.
                </p>
                <p>
                  We combine the convenience of an on-demand taxi with the premium experience of a private chauffeur. All our drivers possess intimate local knowledge to avoid traffic blackspots, ensuring you reach your destination smoothly and securely.
                </p>
              </div>
              <Link 
                href="/cars" 
                className="mt-10 inline-flex items-center text-foreground text-xs md:text-sm font-semibold uppercase tracking-[0.5em] hover:text-primary transition-colors border-b border-primary pb-1"
              >
                Explore The Fleet <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight leading-none text-center mb-16 text-foreground">
            Why Choose <span className="text-primary mt-2 block">Our Chauffeurs?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mx-auto mb-6 text-primary">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-foreground">City Experts</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our drivers know the city inside and out. They leverage real-time traffic data and deep local knowledge to find the fastest, safest routes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mx-auto mb-6 text-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-foreground">Safe & Secure</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ride with confidence. Every vehicle is meticulously maintained, and every driver is thoroughly vetted and licensed for your complete peace of mind.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mx-auto mb-6 text-primary">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-foreground">24/7 Availability</h3>
              <p className="text-muted-foreground leading-relaxed">
                The city never sleeps, and neither do we. Our fleet is ready to deploy around the clock, providing dependable transport whenever you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold uppercase mb-6 text-primary-foreground tracking-tight leading-none">
            Ready To Ride?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Experience the gold standard in city transportation. Book your Chauffeur today in just a few taps.
          </p>
          <Link 
            href="/cars" 
            className="bg-background text-foreground font-bold py-4 px-10 uppercase tracking-wider hover:bg-background/90 transition-colors inline-flex items-center justify-center shadow-2xl hover:scale-105 duration-300"
          >
            Book Your Ride <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
