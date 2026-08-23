import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { 
  ArrowRight, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Laptop, 
  Clock, 
  Headphones, 
  Leaf, 
  PlaneTakeoff, 
  Contact,
  Car
} from "lucide-react";

export default function StandardCarServicesPage() {
  const tiers = [
    {
      name: "Basic",
      desc: "Your select vehicle, fully electric VW iD4.",
      passengers: 4,
      suitcases: 2,
      included: [
        "Professional driver",
        "Fully electric journey"
      ],
      vehicles: "VW iD4",
      image: "/assets/vw_id4.png"
    },
    {
      name: "Standard",
      desc: "Your select+ vehicle, VW Multivan.",
      passengers: 6,
      suitcases: 4,
      included: [
        "Professional driver",
        "Spacious luxury"
      ],
      vehicles: "VW Multivan",
      image: "/assets/vw_multivan.png"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <img 
          src="/assets/select_service_ghana.png"
          alt="Select Services" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-[1]" />
        
        <div className="relative z-10 container mx-auto px-4 text-center mt-20">
          <h4 className="text-primary uppercase tracking-[0.3em] font-semibold text-sm md:text-base mb-4">
            The Service You Deserve
          </h4>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 uppercase tracking-tight text-foreground">
            Select <span className="text-primary">Services</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            With TopReasons self drive hire and chauffeur services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/cars" 
              className="bg-primary text-primary-foreground font-bold py-4 px-8 uppercase tracking-widest hover:bg-primary/90 transition-colors duration-300 inline-flex items-center justify-center rounded-sm text-sm"
            >
              Book Your Service <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* There's a Car for Every Occasion */}
      <section className="py-20 px-4 bg-background border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold uppercase mb-6 text-foreground tracking-widest">
            There’s a Car for <span className="text-primary">Every Occasion</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-8">
            Our fleet is curated to match every travel need. Choose a sleek executive saloon for solo business travel, a spacious SUV for families or groups with luggage, or a luxury vehicle for VIP guests and special occasions. All vehicles are immaculately maintained, climate-controlled, and driven by a professional who treats every journey as a privilege. Luggage assistance, child safety seats, and pet-friendly options are available on request.
          </p>
          <Link 
            href="/cars" 
            className="inline-flex items-center text-primary text-sm font-bold uppercase tracking-[0.2em] hover:text-foreground transition-colors border-b border-primary pb-1"
          >
            Self-drive hire available <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Our Standard Vehicles */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold uppercase mb-4 text-foreground tracking-widest">
              Our <span className="text-primary">Select Vehicles</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {tiers.map((tier, idx) => (
              <div key={idx} className="bg-card rounded-sm overflow-hidden border border-border hover:ring-1 hover:ring-primary/50 transition-all flex flex-col shadow-2xl">
                <div className="relative h-64 w-full">
                  <img src={tier.image} alt={tier.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-90" />
                  <h3 className="absolute bottom-4 left-6 text-3xl font-bold text-primary uppercase tracking-wider">{tier.name}</h3>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <p className="text-muted-foreground text-base leading-relaxed mb-8 flex-grow font-light">
                    {tier.desc}
                  </p>
                  
                  <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                    <div className="flex items-center gap-3 text-foreground">
                      <Users className="w-6 h-6 text-primary" />
                      <span className="font-semibold text-sm uppercase tracking-wide">Up to {tier.passengers} people</span>
                    </div>
                    <div className="flex items-center gap-3 text-foreground">
                      <Briefcase className="w-6 h-6 text-primary" />
                      <span className="font-semibold text-sm uppercase tracking-wide">Up to {tier.suitcases} bags</span>
                    </div>
                  </div>
                  
                  <div>
                    <ul className="space-y-4">
                      {tier.included.map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The service you deserve (Benefits) */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl md:text-4xl font-bold uppercase text-center mb-16 text-foreground tracking-widest">
            The Service <span className="text-primary">You Deserve</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Laptop className="w-6 h-6" />
              </div>
              <p className="text-foreground text-sm leading-relaxed font-semibold uppercase tracking-wide">
                Book via Web or Phone
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-foreground text-sm leading-relaxed font-semibold uppercase tracking-wide">
                On-demand or pre-book
              </p>
            </div>

            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Headphones className="w-6 h-6" />
              </div>
              <p className="text-foreground text-sm leading-relaxed font-semibold uppercase tracking-wide">
                24/7, 365 support for all customers
              </p>
            </div>

            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Briefcase className="w-6 h-6" />
              </div>
              <p className="text-foreground text-sm leading-relaxed font-semibold uppercase tracking-wide">
                Courtesy without compromise: we’ll assist with luggage
              </p>
            </div>

            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Leaf className="w-6 h-6" />
              </div>
              <p className="text-foreground text-sm leading-relaxed font-semibold uppercase tracking-wide">
                Sustainability is at the forefront with 100% carbon neutral journeys
              </p>
            </div>

            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors xl:col-span-2">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <PlaneTakeoff className="w-6 h-6" />
              </div>
              <p className="text-foreground text-sm leading-relaxed font-semibold uppercase tracking-wide">
                Active flight monitoring for Airport Transfer pick-ups: we’ll adjust pick-up times for flight delays or early arrivals automatically
              </p>
            </div>

            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors xl:col-span-1">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Contact className="w-6 h-6" />
              </div>
              <p className="text-foreground text-sm leading-relaxed font-semibold uppercase tracking-wide">
                Driver contact details provided up to 10 minutes before pick-up, and 12 hours in advance with Airport Assured
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
