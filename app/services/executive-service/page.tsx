import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExpandableText } from "@/components/ExpandableText";
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
  Award,
  GraduationCap,
  HeartHandshake
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ExecutiveServicePage() {
  const tiers = [
    {
      name: "Executive Class Service",
      desc: "Executive saloon vehicles (Mercedes E-Class, Audi A6 or equivalent)",
      passengers: 3,
      suitcases: 3,
      included: [
        "Professional, suited chauffeur",
        "Airport meet & greet service",
        "Ideal for business travel and airport transfers",
        "Reliable, discreet, and punctual service"
      ],
      image: "/assets/service_business_v3.png" // using existing business asset or hero
    },
    {
      name: "First Class Service",
      desc: "Luxury flagship vehicles (Mercedes S-Class, V Class, Audi A8, or equivalent)",
      passengers: 4,
      suitcases: 4,
      included: [
        "Senior chauffeur trained in VIP protocol",
        "Enhanced VIP airport meet & greet / As directed service",
        "Complimentary bottled water",
        "Exceptional comfort, privacy, and flexibility"
      ],
      image: "/assets/executive_hero_ghana.png" // the newly generated image
    }
  ];

  const faqs = [
    {
      question: "How do I get a quote?",
      answer: "You can get an instant quote from our 24-hour customer service or on our website by entering all of the booking details before confirming the booking."
    },
    {
      question: "Can I request a driver?",
      answer: "You can request a driver, and we will do our best to allocate them to your booking however this is not always possible."
    },
    {
      question: "What vehicles do you have?",
      answer: "We have a range of vehicles depending on the service you require. Check our Our Offers page to explore the full fleet."
    },
    {
      question: "Can I book a car for someone else?",
      answer: "Yes, you can add their details at the time of booking in the Passenger Details section in the app or on the website."
    },
    {
      question: "Can I book a driver all day?",
      answer: "Depending on availability we can offer ‘As Directed’ services within your city, which allows you to keep a driver for a specified period of time and direct them to each destination. The driver must make more than three stops (otherwise the price will be calculated using the pick-up and drop-off points). Minimum time permitted is one hour and the customer must inform the driver of the route when on board."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:h-screen sm:min-h-[700px] flex items-center justify-center overflow-hidden">
        <img 
          src="/assets/executive_hero_ghana.png"
          alt="Executive Chauffeur Services Ghana" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-[1]" />
        
        <div className="relative z-10 container mx-auto px-4 text-center mt-20">
          <h4 className="text-primary uppercase tracking-[0.3em] font-semibold text-sm md:text-base mb-4">
            Ghana's top executive chauffeur service.
          </h4>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 uppercase tracking-tight text-foreground">
            Executive Chauffeur <span className="text-primary">Services</span>
          </h1>
          <ExpandableText
            text="Our Ghana Chauffeur Services have been refined to deliver consistently reliable and discreet services. Our Executive Services are the pinnacle of quality, an unsurpassed chauffeur-driven experience. We understand the importance of reputation and look to power businesses and individuals in Accra and beyond."
            wrapperClassName="max-w-3xl mx-auto mb-10"
            className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light text-center"
          />
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

      {/* Intro Text */}
      <section className="py-12 px-4 bg-background border-b border-border text-center">
         <div className="container mx-auto max-w-4xl">
           <p className="text-muted-foreground leading-relaxed text-lg italic">
            "So whether you’re doing business, going to the airport, or looking for a chauffeur for the day, you can be confident that we’re up to the task. Our standards of safety and service are without compromise."
           </p>
         </div>
      </section>

      {/* Our Chauffeur Driven Vehicles */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold uppercase mb-4 text-foreground tracking-widest">
              Our Chauffeur Driven <span className="text-primary">Vehicles</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {tiers.map((tier, idx) => (
              <div key={idx} className="bg-card rounded-sm overflow-hidden border border-border hover:ring-1 hover:ring-primary/50 transition-all flex flex-col shadow-2xl">
                <div className="relative h-64 w-full">
                  <img src={tier.image} alt={tier.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-90" />
                  <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-primary uppercase tracking-wider">{tier.name}</h3>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow font-semibold uppercase tracking-widest text-primary/80">
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
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold leading-relaxed">{item}</span>
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

      {/* Meet Your Chauffeur */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
           <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/2">
                 <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-border shadow-2xl">
                    <img src="/assets/african_chauffeur.png" alt="Professional African Chauffeur" className="w-full h-full object-cover" />
                 </div>
              </div>
              <div className="w-full lg:w-1/2">
                <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-widest mb-12 text-foreground">
                  Meet Your <span className="text-primary">Chauffeur</span>
                </h2>
                <div className="grid gap-10">
                   <div>
                     <div className="flex items-center gap-4 mb-3">
                        <Award className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-bold uppercase tracking-widest text-foreground">Professional</h3>
                     </div>
                     <p className="text-muted-foreground leading-relaxed font-light pl-12">
                       Immaculately presented chauffeurs in a dark suit and TopReasons tie, delivering a polished, discreet and professional experience every time.
                     </p>
                   </div>
                   <div>
                     <div className="flex items-center gap-4 mb-3">
                        <Briefcase className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-bold uppercase tracking-widest text-foreground">Experienced</h3>
                     </div>
                     <p className="text-muted-foreground leading-relaxed font-light pl-12">
                       A minimum of five years’ professional private hire or taxi driving experience, with expert knowledge of Ghana’s roads and routes.
                     </p>
                   </div>
                   <div>
                     <div className="flex items-center gap-4 mb-3">
                        <GraduationCap className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-bold uppercase tracking-widest text-foreground">Expertly Trained</h3>
                     </div>
                     <p className="text-muted-foreground leading-relaxed font-light pl-12">
                       All chauffeurs complete our renowned driver training programme, covering advanced driving, safety and customer service.
                     </p>
                   </div>
                   <div>
                     <div className="flex items-center gap-4 mb-3">
                        <HeartHandshake className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-bold uppercase tracking-widest text-foreground">Customer-focused</h3>
                     </div>
                     <p className="text-muted-foreground leading-relaxed font-light pl-12">
                       Passionate about delivering outstanding service, with comfort, reliability and attention to detail at the heart of every journey.
                     </p>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* The Upgrade You Deserve (Benefits) */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl md:text-4xl font-bold uppercase text-center mb-16 text-foreground tracking-widest">
            The Upgrade <span className="text-primary">You Deserve</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Laptop className="w-6 h-6" />
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
            
            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors xl:col-span-1">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-foreground text-sm leading-relaxed font-semibold uppercase tracking-wide">
                Snooze your journey: delay your pick-up if you just need a little more time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Self Drive & Directed Chauffeur Service / Luxury Chauffeur Service */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
           <div className="flex flex-col lg:flex-row gap-16 mb-24">
              <div className="w-full lg:w-1/2">
                <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-widest mb-6 text-primary">
                  Self Drive & Directed <span className="text-foreground">Service</span>
                </h2>
                <div className="prose prose-invert prose-lg text-muted-foreground">
                  <p>
                    Busy day ahead? Meetings, errands, and appointments across the city don’t have to be a rush. With TopReasons As Directed service, you have a private chauffeur at your command, on your time, your route and your terms.
                  </p>
                  <p>
                    Simply book your chauffeur for a few hours and let us take care of the journey. Tell your chauffeur your stops, and if your day evolves, we’ll extend your hire by the hour, effortlessly.
                  </p>
                </div>
                <Link 
                  href="/cars" 
                  className="mt-8 inline-flex items-center text-foreground text-sm font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors border-b border-primary pb-1"
                >
                  Book Now <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
              <div className="w-full lg:w-1/2">
                <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-widest mb-6 text-primary">
                  Luxury Chauffeur <span className="text-foreground">Service</span>
                </h2>
                <div className="prose prose-invert prose-lg text-muted-foreground">
                  <p>
                    Our A to B chauffeur services in Ghana are designed for effortless, point-to-point travel across any capital and beyond. Whether you’re travelling between meetings, hotels, venues or private residences, our chauffeur service ensures you arrive on time, relaxed and prepared.
                  </p>
                  <p>
                    From the moment your chauffeur arrives to the final drop-off, you’ll experience a premium level of service that removes the stress of navigating busy Ghana streets. With professional chauffeurs, luxury vehicles and precise route planning, every journey is smooth and discreet.
                  </p>
                </div>
                <Link 
                  href="/cars" 
                  className="mt-8 inline-flex items-center text-foreground text-sm font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors border-b border-primary pb-1"
                >
                  Explore Fleet <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
           </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 px-4 bg-background border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold uppercase text-center mb-16 text-foreground tracking-widest">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-border mb-4 px-2">
                <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline text-lg md:text-xl font-semibold uppercase tracking-wide text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 pt-2">
                  {faq.question.includes("get a quote") ? (
                    <>
                      You can get an instant quote from our 24-hour customer service or on our <Link href="/cars" className="text-primary hover:underline">website</Link> by entering all of the booking details before confirming the booking.
                    </>
                  ) : (
                    faq.answer
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
}
