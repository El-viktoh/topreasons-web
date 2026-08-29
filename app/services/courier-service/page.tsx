import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { 
  ArrowRight, 
  Clock, 
  Truck, 
  MapPin, 
  CalendarCheck,
  PackageCheck,
  Zap,
  Snowflake,
  ShieldCheck,
  Ban,
  Phone,
  XOctagon,
  PlaneTakeoff
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CourierServicePage() {
  const vehicles = [
    {
      name: "Luton Van",
      icon: Truck,
      size: "Large (Up to 1,200kg payload / 6 pallets)",
      benefits: "Tail lift available for heavy items, tall cargo space.",
      priority: "High - Ideal for urgent bulk movements.",
      exampleItems: "Furniture, Pallets, Large boxes, Exhibition equipment.",
      image: "/assets/cargo_truck_ghana.png"
    },
    {
      name: "Chiller Van",
      icon: Snowflake,
      size: "Medium/Large (Temperature controlled)",
      benefits: "Maintains specific temperatures, hygienically cleaned.",
      priority: "Urgent - Perfect for sensitive cargo.",
      exampleItems: "Perishables, Medical supplies, Food, Pharmaceuticals.",
      image: "/assets/cargo_truck_ghana.png"
    },
    {
      name: "Large Van",
      icon: Truck,
      size: "Large (Up to 1,000kg payload / 4 pallets)",
      benefits: "Spacious, secure, and fast across the city.",
      priority: "Medium/High - Reliable daily runs.",
      exampleItems: "Office moves, bulk packages, white goods.",
      image: "/assets/cargo_truck_ghana.png"
    },
    {
      name: "Big Truck",
      icon: Truck,
      size: "Extra Large (Up to 7.5 Tonnes)",
      benefits: "Maximum payload, ideal for heavy goods and commercial freight.",
      priority: "Standard - Scheduled large-scale logistics.",
      exampleItems: "Construction materials, large machinery, warehouse stock.",
      image: "/assets/cargo_truck_ghana.png"
    },
    {
      name: "Small Truck",
      icon: Truck,
      size: "Medium/Large (Up to 3.5 Tonnes)",
      benefits: "Versatile, easy city navigation with high capacity.",
      priority: "High - Fast urban multi-drop deliveries.",
      exampleItems: "Retail stock, multiple pallets, event logistics.",
      image: "/assets/cargo_truck_ghana.png"
    }
  ];

  const comparisonTableData = [
    {
      service: "Motor Cycle",
      size: "Items up to 5kg. Carries a standard A4 box.",
      benefits: "Cuts through the traffic for faster deliveries.",
      priority: "Priority Service Available – check online or call to check availability and prices.",
      examples: "Clothing items, small parcels, small gifts, laptops in covers",
    },
    {
      service: "Parcel Courier",
      size: "Carries up to 40kg, 2′ wide x 3′ tall x 18′. Comfortably fits up to 10 A4 boxes.",
      benefits: "Maximum of three jobs per car ensures quick delivery.",
      priority: "Priority Service Available – check online or call to check availability and prices.",
      examples: "Bags of clothing, boxes, large documents, party supplies, office supplies.",
    },
    {
      service: "Pick Ups",
      size: "Carries up to 600kg, 2′ wide x 3′ tall x 18′. Comfortably fits up to 10 to 20 large moving boxes",
      benefits: "Maximum of three jobs per car ensures quick delivery.",
      priority: "Priority Service Available – check online or call to check availability and prices.",
      examples: "Large bags of clothing and furniture and household goods, boxes, single mattress.",
    },
    {
      service: "Small Van Courier",
      size: "1.7 x 1.5 x 1.2m. Items up to 700 kg. Comfortably fits up to 40 A4 boxes.",
      benefits: "Sliding side door for easy access. No more than three jobs per vehicle on route.",
      priority: "Priority Service Available – check online or call to check availability and prices.",
      examples: "Film equipment, clothing, furniture, household goods, boxes, single mattress.",
    },
    {
      service: "Large Van Courier",
      size: "Carries up to 1000 kg. Volume: 5.8 m³. (L: 2300mm, W: 1692mm, H: 1410mm)",
      benefits: "Maximum of three jobs per van ensures quick delivery.",
      priority: "Priority Service Available – check online or call to check availability and prices.",
      examples: "Double mattress, home appliances, paint, IT equipment, film equipment, groceries, inventory.",
    },
    {
      service: "Luton Van Courier",
      size: "Bulky and awkward loads (no home removals). Up to 1,000kg.",
      benefits: "High-capacity, secure transport ideal for large deliveries with easy loading via a tail lift.",
      priority: "You can book out a Luton Van for your own use, not shared, to ensure priority.",
      examples: "Media & production equipment. Luggage and storage. Supplies & equipment.",
    },
    {
      service: "Tow Trucks",
      size: "Towing of up to 3 or 4 vehicles. From small to large size vehicles.",
      benefits: "High capacity, secure transport for vehicles of all types and sizes.",
      priority: "Check online or call to check availability and prices.",
      examples: "-",
    }
  ];

  const restrictedItems = [
    "Pianos",
    "Household removals",
    "People",
    "Weapons",
    "Safes",
    "Large glass & marble (mirrors, windows, etc)",
    "Hazardous materials",
    "Animals",
    "Items over £1,000"
  ];

  const faqs = [
    {
      q: "Can I travel with the delivery van?",
      a: "Unfortunately for insurance purposes, you are not able to travel in the vehicle."
    },
    {
      q: "Is next day delivery an overnight service?",
      a: "Yes, when using our Next Day service your package will be delivered anywhere in Ghana the following day."
    },
    {
      q: "What is the difference between a Standard delivery service and a Priority delivery service?",
      a: "Our standard service is a multi-drop service, and we will deliver on the same day your package was collected. Our Priority Service offers quicker collections times with a package delivery, on average within one hour of collection, in the central parts of our major cities."
    },
    {
      q: "What time should I arrange collection for my parcel to secure next day delivery?",
      a: "To secure our Next Day delivery service, we should collect no later than 5pm."
    },
    {
      q: "Which delivery service will fit my parcel?",
      a: <>Click <Link href="/cars" className="text-primary hover:underline">here</Link> to ensure that you choose the right vehicle for your delivery.</>
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:h-screen sm:min-h-[700px] flex items-center justify-center overflow-hidden">
        <img 
          src="/assets/courier_hero_ghana.png"
          alt="TopReasons Courier Services" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-[1]" />
        
        <div className="relative z-10 container mx-auto px-4 text-center mt-20">
          <h4 className="text-primary uppercase tracking-[0.3em] font-semibold text-sm md:text-base mb-4">
            Courier and Delivery Services
          </h4>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 uppercase tracking-tight text-foreground">
            Courier <span className="text-primary">Services</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Deliveries – we get it. Whether your business requires an urgent, same-day or overnight delivery or the peace of mind our international service brings, our professional couriers are here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/cars" 
              className="bg-primary text-primary-foreground font-bold py-4 px-8 uppercase tracking-widest hover:bg-primary/90 transition-colors duration-300 inline-flex items-center justify-center rounded-sm text-sm"
            >
              Book a Delivery <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Badges */}
      <section className="py-8 border-b border-border bg-background">
        <div className="container mx-auto max-w-6xl">
           <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-muted-foreground uppercase tracking-widest text-sm font-semibold">
              <span className="flex items-center gap-2 text-primary"><PackageCheck className="w-5 h-5"/> Same Day Deliveries</span>
              <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary"/> Next-day Deliveries</span>
              <span className="flex items-center gap-2 text-foreground"><MapPin className="w-5 h-5 text-primary"/> International Deliveries</span>
           </div>
        </div>
      </section>

      {/* Why Use TopReasons Couriers? */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-4 text-foreground tracking-widest">
              Why use <span className="text-primary">TopReasons Couriers?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Send anything from small packages to full productions – we’ll match you with the perfect courier. Just specify your needs when booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase text-foreground tracking-wide">Urgent Same-Day Across Accra</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                From bikes to vans, we deliver fast and reliably across Accra. You can choose between a standard, priority or direct service.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase text-foreground tracking-wide">Priority Service Available</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Book our priority service to guarantee your delivery will be dropped off within 3 hours of collection. Faster, safer deliveries.
              </p>
            </div>

            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase text-foreground tracking-wide">New Direct Courier Service</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                This service ensures your parcel will go straight to its destination, with no stops. On average within 90 mins in Accra.
              </p>
            </div>

            <div className="bg-card p-8 rounded-sm border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-primary border border-primary/20">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase text-foreground tracking-wide">Dedicated Windows</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Speak to our team about dedicated delivery windows at times that suit your business. We build the service to suit your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Which Courier Service? */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-4 text-foreground tracking-widest">
              Which <span className="text-primary">Courier Service?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our diverse fleet designed to handle any package, regardless of size or requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle, idx) => (
              <div key={idx} className="bg-card rounded-sm overflow-hidden border border-border hover:ring-1 hover:ring-primary/50 transition-all flex flex-col group">
                <div className="relative h-48 w-full overflow-hidden">
                  <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-90" />
                  <div className="absolute bottom-4 left-6 flex items-center gap-3 text-primary">
                    <vehicle.icon className="w-8 h-8" />
                    <h3 className="text-2xl font-bold uppercase tracking-wider">{vehicle.name}</h3>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow bg-card">
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div>
                      <strong className="text-primary uppercase tracking-widest text-xs block mb-1">Size</strong>
                      {vehicle.size}
                    </div>
                    <div>
                      <strong className="text-primary uppercase tracking-widest text-xs block mb-1">Benefits</strong>
                      {vehicle.benefits}
                    </div>
                    <div>
                      <strong className="text-primary uppercase tracking-widest text-xs block mb-1">Priority</strong>
                      {vehicle.priority}
                    </div>
                    <div>
                      <strong className="text-primary uppercase tracking-widest text-xs block mb-1">Example Items</strong>
                      {vehicle.exampleItems}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-4 text-foreground tracking-widest">
              Service <span className="text-primary">Comparison</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Compare our courier and pickup services side-by-side to find the perfect fit for your delivery needs.
            </p>
          </div>

          <div className="overflow-x-auto rounded-sm border border-border shadow-2xl">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-card text-primary uppercase tracking-wider text-sm">
                  <th className="p-5 font-semibold border-b border-border w-[15%]">Service</th>
                  <th className="p-5 font-semibold border-b border-border w-[25%]">Size & Capacity</th>
                  <th className="p-5 font-semibold border-b border-border w-[20%]">Benefits</th>
                  <th className="p-5 font-semibold border-b border-border w-[20%]">Priority Options</th>
                  <th className="p-5 font-semibold border-b border-border w-[20%]">Example Items</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground text-sm">
                {comparisonTableData.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={`hover:bg-card transition-colors ${idx !== comparisonTableData.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <td className="p-5 font-semibold text-foreground bg-background/50">{row.service}</td>
                    <td className="p-5 leading-relaxed text-muted-foreground">{row.size}</td>
                    <td className="p-5 leading-relaxed text-muted-foreground">{row.benefits}</td>
                    <td className="p-5 leading-relaxed text-muted-foreground">{row.priority}</td>
                    <td className="p-5 leading-relaxed text-muted-foreground">{row.examples}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Restricted Items Section */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        {/* Subtle red glow in the background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="bg-card border border-red-500/20 rounded-sm p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Background pattern/icon for the card */}
            <div className="absolute -top-12 -right-12 opacity-[0.03] rotate-12 pointer-events-none">
              <Ban className="w-96 h-96 text-foreground" />
            </div>

            <div className="text-center mb-12 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                <Ban className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold uppercase mb-6 text-foreground tracking-widest">
                Restricted <span className="text-red-500">Items</span>
              </h2>
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-red-500/10 text-red-400 px-6 py-3 rounded-full text-sm font-medium border border-red-500/20">
                <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> This list is not exhaustive.</span>
                <span className="hidden sm:block text-red-500/50">|</span>
                <span>Unsure? Call us on <strong className="text-foreground ml-1">020 7387 8888</strong></span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
              {restrictedItems.map((item, idx) => (
                <div key={idx} className="bg-black/40 border border-border hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300 rounded-sm p-4 flex items-center gap-3 group">
                  <XOctagon className="w-4 h-4 text-red-500/50 group-hover:text-red-500 transition-colors shrink-0" />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Operating Hours Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-6 text-foreground tracking-widest">
              Operating <span className="text-primary">Hours</span>
            </h2>
            <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-6 py-3 rounded-full mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">Small Parcels (Same-Day) are available <strong className="text-primary ml-1">24/7</strong></span>
            </div>
            <p className="text-muted-foreground text-lg">
              For large parcel couriers, please refer to our standard operating hours below.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
            {/* Same-Day Courier Card */}
            <div className="bg-card rounded-sm border border-border overflow-hidden group hover:border-primary/30 transition-colors shadow-xl">
              <div className="bg-card p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground uppercase tracking-wider flex items-center gap-3">
                  <Clock className="w-6 h-6 text-primary" /> Same-Day Courier
                </h3>
              </div>
              <div className="p-8 space-y-10">
                <div className="relative pl-8 border-l-2 border-border">
                  <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1 shadow-[0_0_10px_rgba(243,167,18,0.5)]" />
                  <h4 className="font-bold text-foreground uppercase text-sm tracking-widest mb-1">Weekday</h4>
                  <p className="text-primary font-medium text-xl mb-2">7:00 AM – 8:00 PM</p>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">Mon - Fri</p>
                  <p className="text-muted-foreground text-xs italic mt-2">Deliveries after 8pm subject to out-of-hours fee.</p>
                </div>
                
                <div className="relative pl-8 border-l-2 border-border">
                  <div className="absolute w-4 h-4 bg-white/20 rounded-full -left-[9px] top-1" />
                  <h4 className="font-bold text-foreground uppercase text-sm tracking-widest mb-1">Weekend</h4>
                  <p className="text-muted-foreground font-medium text-xl mb-2">7:00 AM – 5:00 PM</p>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">Sat - Sun</p>
                </div>
              </div>
            </div>
            
            {/* Intl & Overnight Card */}
            <div className="bg-card rounded-sm border border-border overflow-hidden group hover:border-primary/30 transition-colors shadow-xl">
              <div className="bg-card p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground uppercase tracking-wider flex items-center gap-3">
                  <PlaneTakeoff className="w-6 h-6 text-primary" /> Intl. & Overnight
                </h3>
              </div>
              <div className="p-8 space-y-10">
                <div className="relative pl-8 border-l-2 border-border">
                  <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1 shadow-[0_0_10px_rgba(243,167,18,0.5)]" />
                  <h4 className="font-bold text-foreground uppercase text-sm tracking-widest mb-1">Weekday</h4>
                  <p className="text-primary font-medium text-xl mb-2">8:00 AM – 6:00 PM</p>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">Mon - Fri</p>
                </div>
                
                <div className="relative pl-8 border-l-2 border-border">
                  <div className="absolute w-4 h-4 bg-white/20 rounded-full -left-[9px] top-1" />
                  <h4 className="font-bold text-foreground uppercase text-sm tracking-widest mb-1">Weekend</h4>
                  <p className="text-muted-foreground font-medium text-xl mb-2">9:00 AM – 4:00 PM</p>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">Saturday only</p>
                </div>

                <div className="relative pl-8 border-l-2 border-red-500/20">
                  <div className="absolute w-4 h-4 bg-red-500 rounded-full -left-[9px] top-1 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  <h4 className="font-bold text-foreground uppercase text-sm tracking-widest mb-1">Holidays</h4>
                  <p className="text-red-400 font-medium text-xl mb-2">Closed</p>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">Sun & Public Holidays</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 px-4 bg-background border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase text-foreground tracking-widest mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-muted-foreground">Everything you need to know about our courier services.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border border-border bg-card rounded-lg px-6 data-[state=open]:border-primary/50 transition-colors">
                <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline font-semibold text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Courier Services In Your City (CTA) */}
      <section className="py-24 px-4 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative z-10 container mx-auto max-w-5xl text-center">
          <ShieldCheck className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-6 text-primary-foreground tracking-widest">
            Courier Services In Your City
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed mb-10 max-w-4xl mx-auto font-medium">
            Looking for reliable courier services in your city? TopReasons offers the best courier service for businesses and individuals, making it easy to send a parcel across the city with confidence. Our efficient parcel delivery service includes fast courier collection from your doorstep and real-time package tracking, ensuring your shipments arrive safely and on time. Whether it’s urgent documents or larger packages, trust TopReasons to provide a seamless and professional courier experience throughout Ghana.
          </p>
          <Link 
            href="/cars" 
            className="bg-background text-foreground font-bold py-4 px-10 uppercase tracking-widest hover:bg-background/90 transition-colors inline-flex items-center justify-center shadow-2xl hover:scale-105 duration-300 rounded-sm"
          >
            Start Shipping Today <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
