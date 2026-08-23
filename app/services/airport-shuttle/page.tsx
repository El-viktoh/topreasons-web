import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  Briefcase, 
  Car, 
  Headphones, 
  MapPin, 
  PlaneTakeoff,
  Award,
  Wallet
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AirportServicesPage() {
  const tiers = [
    {
      name: "Basic",
      desc: "A pre-booked, inclusive pricing service designed for everyday airport journeys. With professional, fully vetted drivers and high-quality vehicle, every detail is arranged in advance so you can travel with confidence from start to finish.",
      passengers: 2,
      suitcases: 2,
      included: [
        "100% reliability assured",
        "Professional, suited chauffeur and executive vehicle",
        "All-inclusive price (including parking and up to 1 hour waiting time)"
      ],
      vehicles: "Kia Pegas, Honda Civic, Toyota Corolla",
      image: "/assets/basic_car_ghana.png"
    },
    {
      name: "Standard",
      desc: "A pre-booked, inclusive pricing service designed for everyday airport journeys. With professional, fully vetted drivers and high-quality vehicle, every detail is arranged in advance so you can travel with confidence from start to finish.",
      passengers: 3,
      suitcases: 3,
      included: [
        "100% reliability assured",
        "Professional, suited chauffeur and executive vehicle",
        "All-inclusive price (including parking and up to 1 hour waiting time)"
      ],
      vehicles: "Hyundai Sonata, Nissan Sentra, Hyundai Elantra, Toyota Camry",
      image: "/assets/mercedes_s_class.png"
    },
    {
      name: "Premium",
      desc: "Perfect for groups or families, premium offers generous space and smooth, reliable travel. Ride in a premium MPV with a professional driver and know where you stand with fixed, fully inclusive price.",
      passengers: 4,
      suitcases: 4,
      included: [
        "100% reliability assured",
        "Professional, suited chauffeur, luxury and executive vehicle",
        "All-inclusive price (including parking and up to 1 hour waiting time)"
      ],
      vehicles: "Honda Accord, Mercedes C-Class, Honda CR-V, Toyota RAV 4",
      image: "/assets/bmw_7_series.png"
    },
    {
      name: "Luxury",
      desc: "Designed for executive travel from arrival to drop-off, every detail is managed to ensure a calm, seamless journey, so you or your travellers can step out refreshed and ready to go.",
      passengers: 4,
      suitcases: 4,
      included: [
        "100% reliability assured",
        "Professional, suited chauffeur, luxury and executive vehicle",
        "All-inclusive price (including parking and up to 1 hour waiting time)"
      ],
      vehicles: "Audi Q7, Mercedes E-Class/S-Class, Land Cruiser V8, Nissan Patrol",
      image: "/assets/range_rover.png"
    },
    {
      name: "Family Travel",
      desc: "Designed for family travel from arrival to drop-off, every detail is managed to ensure a calm, seamless journey, so you or your travellers can step out refreshed and ready to go.",
      passengers: 6,
      suitcases: 8,
      included: [
        "100% reliability assured",
        "Professional, suited chauffeur and a mini van",
        "All-inclusive price (including parking and up to 1 hour waiting time)"
      ],
      vehicles: "Toyota Voxy, Nissan ElGrand, Hyundai H1, Hyundai Staria",
      image: "/assets/land_cruiser.png"
    },
    {
      name: "Group Travel",
      desc: "Designed for travel of large groups from arrival to drop-off, every detail is managed to ensure a calm, seamless journey, so you or your travellers can step out refreshed and ready to go.",
      passengers: "10+",
      suitcases: "10+",
      included: [
        "100% reliability assured",
        "Professional, suited chauffeur and a van/coach",
        "All-inclusive price (including parking and up to 1 hour waiting time)"
      ],
      vehicles: "Hyundai H1, Toyota Hiace, Toyota Coaster, 40-50 seater Coach",
      image: "/assets/group_van_ghana.png"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <img 
          src="/assets/airport_hero_ghana.png"
          alt="Airport Shuttle Service" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-[1]" />
        
        <div className="relative z-10 container mx-auto px-4 text-center mt-20">
          <h4 className="text-primary uppercase tracking-[0.3em] font-semibold text-sm md:text-base mb-4">
            Premium Airport Transfers Redefined
          </h4>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 uppercase tracking-tight text-foreground">
            Airport <span className="text-primary">Services</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Introducing TopReasons’ airport services: Basic, Standard, Premium and Luxury. With all-inclusive pricing, and 100% service guarantee. We’ve refined our airport offering to reflect the realities of modern air travel; where clarity, and consistency matter as much as comfort and precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/cars" 
              className="bg-primary text-primary-foreground font-bold py-4 px-8 uppercase tracking-widest hover:bg-primary/90 transition-colors duration-300 inline-flex items-center justify-center rounded-sm text-sm"
            >
              Book Your Transfer <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Story */}
      <section className="py-20 px-4 bg-background border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold uppercase mb-6 text-foreground tracking-widest">
            We do the driving. <span className="text-primary">You do the flying.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-8">
            At TopReasons, we bridge the gap between the airport and your final destination with our seamless booking process to our professional door-to-door service. Your airport transfer is guaranteed in style and comfort. Whether you are travelling for business or leisure, from kerbside to check-in, our airport services always deliver. Available are vehicles for 1 passenger up to 30+ passengers.
          </p>
        </div>
      </section>

      {/* Why Choose Inclusive Airport Services */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl md:text-4xl font-bold uppercase text-center mb-16 text-foreground tracking-widest">
            Why Choose <span className="text-primary">Inclusive Airport Services</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase text-foreground tracking-wide">Priority Collection</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your chauffeur will arrive no later than 10 minutes before your scheduled pick-up, for a seamless transfer to the airport.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase text-foreground tracking-wide">Fixed Prices</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Know where you stand with fixed prices – say goodbye to parking fees and extras (except diverts) and hello to 60 minutes of inclusive waiting time.
              </p>
            </div>

            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase text-foreground tracking-wide">100% Guaranteed</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your Airport Service is 100% guaranteed or your next journey is absolutely free. Total peace of mind.
              </p>
            </div>

            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase text-foreground tracking-wide">Live Tracking</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Live vehicle tracking and SMS with your driver details sent to you in advance so you are always informed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Tiers */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold uppercase mb-4 text-foreground tracking-widest">
              New <span className="text-primary">Inclusive Services</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the perfect tier for your journey. Every service is arranged in advance so you can travel with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <div key={idx} className="bg-card rounded-sm overflow-hidden border border-border hover:ring-1 hover:ring-primary/50 transition-all flex flex-col">
                <div className="relative h-56 w-full">
                  <img src={tier.image} alt={tier.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-90" />
                  <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-primary uppercase tracking-wider">{tier.name}</h3>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                    {tier.desc}
                  </p>
                  
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-border">
                    <div className="flex items-center gap-2 text-foreground">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-sm">Up to {tier.passengers}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-sm">Up to {tier.suitcases}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">What is Included</h4>
                    <ul className="space-y-3">
                      {tier.included.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto bg-black/40 p-4 rounded-lg border border-border">
                    <h4 className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">Type of Vehicle</h4>
                    <p className="text-sm text-foreground/90 font-medium leading-relaxed">
                      {tier.vehicles}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Airport Service Benefits */}
      <section className="py-20 px-4 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative z-10 container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold uppercase text-center mb-12 text-primary-foreground tracking-widest">
            Airport Service Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-black/90 p-8 rounded-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
              <Award className="w-8 h-8 text-primary mx-auto mb-4" />
              <p className="text-foreground text-sm leading-relaxed font-medium">
                Professional chauffeurs, with a minimum of 3 years' experience.
              </p>
            </div>
            <div className="bg-black/90 p-8 rounded-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
              <Car className="w-8 h-8 text-primary mx-auto mb-4" />
              <p className="text-foreground text-sm leading-relaxed font-medium">
                Option to book the Airport Service across different vehicle types and sizes.
              </p>
            </div>
            <div className="bg-black/90 p-8 rounded-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
              <Headphones className="w-8 h-8 text-primary mx-auto mb-4" />
              <p className="text-foreground text-sm leading-relaxed font-medium">
                Here to help, contact our 24/7 dedicated customer service team.
              </p>
            </div>
            <div className="bg-black/90 p-8 rounded-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
              <PlaneTakeoff className="w-8 h-8 text-primary mx-auto mb-4" />
              <p className="text-foreground text-sm leading-relaxed font-medium">
                Live tracking and SMS from your chauffeur (no less than 15 mins from pickup).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase text-foreground tracking-widest mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-muted-foreground">Everything you need to know about our airport services.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-border bg-card rounded-lg px-6 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline font-semibold text-left">
                Why do you need the flight number when picking up from airports?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                Providing your flight number when booking allows us to track your flight in real time. This means we can adjust your driver's arrival if your flight is early or delayed, helping to avoid unnecessary waiting time.
                <br /><br />
                For our Basic, Standard, Premium, Luxury, Family and Group travel services, your booking also includes complimentary waiting time (up to 60 minutes) and parking, so your driver will be ready when you land.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border bg-card rounded-lg px-6 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline font-semibold text-left">
                What happens if my flight has been delayed?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                If you've provided your flight number, we'll monitor your flight and adjust your driver's arrival time accordingly.
                <br /><br />
                When you've booked our Basic, Standard, Premium, Luxury, Family and Group services, your booking includes 60 minutes of complimentary waiting time on arrivals, so your driver will still be there to meet you without additional charges (within this period).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border bg-card rounded-lg px-6 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline font-semibold text-left">
                What happens if my flight has been cancelled?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                If your flight is cancelled, please let us know as soon as possible by cancelling your booking via our website or customer service.
                <br /><br />
                If you've provided your flight number, we may be able to identify the cancellation, but it remains your responsibility to cancel the booking if you no longer need the journey. You can then easily make a new booking for your updated travel plans.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border bg-card rounded-lg px-6 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline font-semibold text-left">
                What happens if my flight arrives earlier than scheduled?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                If you've added your flight number, we'll track your flight and, where possible, adjust your driver's arrival time to match your early landing. This helps ensure your driver is there as close to your arrival time as possible.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-border bg-card rounded-lg px-6 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline font-semibold text-left">
                Where will my driver meet me at the airport?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                At most Ghanaian airports, your driver will meet you in Arrivals with a name board. At all our airports, both local and international arrivals, your driver will meet you at the Meeting Point, which is clearly stated in the communication.
                <br /><br />
                Full meeting instructions will always be included in your booking confirmation email. For international airports, your driver will usually meet you in Arrivals. However, in some locations, meet-and-greet may not be permitted – in these cases, we'll provide clear alternative instructions in advance.
                <br /><br />
                As part of our service, we track your flight and adjust your driver's arrival time to ensure a smooth pickup experience.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border border-border bg-card rounded-lg px-6 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline font-semibold text-left">
                What is the difference between booking Airport Services and standard bookings?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                Our Airport Services are specifically designed to provide a more seamless and stress-free airport journey compared to standard bookings. With any Airport Service, you benefit from:
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li><strong>Inclusive pricing</strong> – no additional charges for parking, waiting time, or other extras</li>
                  <li><strong>Priority collection</strong> – your driver is prioritised to ensure timely pickup</li>
                  <li><strong>100% collection guarantee</strong> – if we don't collect you on time, your next journey is free</li>
                </ul>
                <p className="mt-4">These added benefits provide greater reliability, transparency, and peace of mind when travelling to or from the airport.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border border-border bg-card rounded-lg px-6 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline font-semibold text-left">
                What is the difference in pricing between the service tiers?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                The difference in pricing reflects the vehicle type, size, and passenger capacity offered by each service tier:
                <ul className="list-disc pl-6 mt-4 space-y-3">
                  <li><strong>Basic</strong> – Kia Pegas, Honda Civic, Toyota Corolla, suitable for up to 2 passengers and 2 suitcases.</li>
                  <li><strong>Standard</strong> – Hyundai Sonata, Nissan Sentra, Hyundai Elantra, Toyota Camry, suitable for up to 3 passengers and 3 suitcases.</li>
                  <li><strong>Premium</strong> – Honda Accord, Mercedes C-Class, Hyundai Sonata, Honda CR-V, Toyota RAV 4, Toyota Prado chauffeur service and suitable for up to 4 passengers and 4 suitcases.</li>
                  <li><strong>Luxury</strong> – Premium vehicles such as Audi Q7 or Mercedes E-Class/S-Class, Land Cruiser V8, Nissan Patrol, chauffeur service and suitable for up to 4 passengers and 4 suitcases.</li>
                  <li><strong>Family</strong> – Toyota Voxy, Nissan ElGrand, Hyundai H1, Hyundai Staria, chauffeur service and suitable for up to 6 passengers and 6 suitcases.</li>
                  <li><strong>Group</strong> – Hyundai H1, Toyota Hiace, Toyota Coaster, 40–50 seater Coach, chauffeur service and suitable for up to 10+ passengers and 10+ suitcases.</li>
                </ul>
                <p className="mt-4">Each tier is designed to match different group sizes and comfort preferences, while all still include the same all-inclusive pricing, priority service, and on-time guarantee.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
}
