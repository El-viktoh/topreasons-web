"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Award, Heart, MapPin, Target, Briefcase, Leaf, BookOpen, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const values = [
  { icon: Shield, title: "Safety First", description: "Every vehicle is regularly serviced and fully insured for your peace of mind." },
  { icon: Award, title: "Quality Fleet", description: "Well-maintained cars ranging from compact sedans to premium SUVs." },
  { icon: Heart, title: "Customer Care", description: "24/7 support to ensure your rental experience is smooth and hassle-free." },
  { icon: MapPin, title: "Across Ghana", description: "Serving Accra, Kumasi, Tamale, Cape Coast, and cities nationwide." },
];

const stats = [
  { value: "5,000+", label: "Happy Customers" },
  { value: "100+", label: "Vehicles" },
  { value: "10+", label: "Cities Served" },
  { value: "98%", label: "Satisfaction Rate" },
];

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    "TopReasons was founded on a simple conviction: Ghanaians and visitors to Ghana deserve a transport and hospitality service that is genuinely world-class. Since our establishment, we have grown from a boutique car hire operation into a full-spectrum travel solutions company, serving individuals, corporations, embassies, and international organisations across the country.",
    "As the trusted mobility partner of choice for major businesses operating in Ghana, TopReasons brings together executive ground transport, accommodation sourcing, and logistics support under one reliable roof. Our collaborative approach helps clients achieve operational efficiency, reduce travel-related stress, and experience consistent service excellence.",
    "With deep knowledge of Ghana’s roads, regions, and hospitality landscape — from the bustle of Accra to the coastal charm of Cape Coast and the commercial energy of Kumasi — we understand what our clients need before they even ask. Thank you for choosing TopReasons as your trusted travel partner."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img 
          src="/assets/hero-bg.jpg" 
          alt="Top Reasons fleet" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-[1]" />
        
        <div className="relative z-10 container mx-auto text-center max-w-4xl px-4 mt-10">
          <h4 className="text-primary uppercase tracking-[0.3em] font-semibold text-sm md:text-base mb-4">
            Ghana's Trusted Transport Partner
          </h4>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 uppercase tracking-tight text-white">
            About <span className="text-primary">TopReasons</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Founded in 2018, TopReasons is a proud Ghanaian-based company known for quality, reliability, and exceptional service. We are backed by a global leader in mobility solutions.
          </p>
        </div>
      </section>

      {/* Our Story Slider */}
      <section className="py-24 px-4 relative overflow-hidden bg-background">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-widest text-white">
              Our <span className="text-primary">Story</span>
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>
          
          <div className="bg-card border border-white/5 rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <Quote className="hidden sm:block absolute top-8 left-8 w-16 h-16 text-primary/10 rotate-180" />
            <Quote className="hidden sm:block absolute bottom-8 right-8 w-16 h-16 text-primary/10" />
            
            <div className="relative w-full grid text-center z-10">
              {slides.map((slide, idx) => (
                <p
                  key={idx}
                  className={`[grid-area:1/1] self-center px-4 md:px-12 text-lg md:text-2xl leading-relaxed text-gray-300 font-light italic transition-all duration-700 ease-in-out ${
                    currentSlide === idx
                      ? "opacity-100 translate-x-0"
                      : currentSlide < idx
                        ? "opacity-0 translate-x-16 pointer-events-none"
                        : "opacity-0 -translate-x-16 pointer-events-none"
                  }`}
                >
                  "{slide}"
                </p>
              ))}
            </div>

            {/* Slider Controls */}
            <div className="flex items-center justify-center gap-8 mt-8 md:mt-12">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all z-20 relative"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex gap-3 z-20 relative">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? "w-10 bg-primary" : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all z-20 relative"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 px-4 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80 font-semibold uppercase tracking-widest text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-widest text-white">
              Our <span className="text-primary">Values</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The core principles that drive our exceptional service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center p-8 bg-card border border-white/5 rounded-2xl hover:border-primary/30 transition-all group shadow-lg">
                  <div className="w-16 h-16 mx-auto mb-6 bg-black border border-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 uppercase tracking-wide text-white">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-24 px-4 bg-background border-y border-white/5">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="w-20 h-20 mx-auto mb-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
            <Target className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 uppercase tracking-widest text-white">
            Our <span className="text-primary">Mission</span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-300 leading-relaxed font-light italic">
            "To be Ghana's most trusted transport service — providing reliable, affordable, and well-maintained vehicles so that every journey is comfortable and worry-free. We believe quality transportation should be accessible to everyone."
          </p>
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-16 h-16 mb-8 bg-black border border-primary/20 rounded-full flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-widest text-white">
                Careers at <span className="text-primary">TopReasons</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6 font-light">
                Join the TopReasons team and help us transform transport in Ghana. We're always looking for passionate, driven individuals who share our commitment to exceptional service.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed font-light">
                From drivers to customer support, operations to marketing — there's a place for you at TopReasons. We offer competitive compensation, a supportive work environment, and the chance to grow with a fast-moving company.
              </p>
              
              <div className="mt-10">
                <Link 
                  href="/careers"
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold py-4 px-10 uppercase tracking-widest hover:bg-white transition-colors shadow-2xl hover:scale-105 duration-300 rounded-sm"
                >
                  View Open Roles
                </Link>
              </div>
            </div>
            
            <div className="bg-card border border-white/5 rounded-2xl p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Briefcase className="w-48 h-48 text-white" /></div>
              <h3 className="font-bold uppercase tracking-widest text-lg mb-8 text-primary relative z-10">Why Work With Us?</h3>
              <ul className="space-y-6 relative z-10">
                {[
                  "Competitive salary and premium benefits",
                  "Growth opportunities in a fast-paced environment",
                  "Supportive, family-like team culture",
                  "Making a real impact on transportation in Ghana",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 bg-card p-4 rounded-xl border border-white/5">
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(243,167,18,0.8)]" />
                    <span className="text-gray-300 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ESG Section */}
      <section className="py-24 px-4 bg-background border-t border-white/5">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-black border border-green-500/20 rounded-full flex items-center justify-center">
            <Leaf className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 uppercase tracking-widest text-white">
            ESG & <span className="text-green-500">Sustainability</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-3xl mx-auto font-light">
            At TopReasons, we're committed to building a sustainable future. We're investing in fuel-efficient vehicles, reducing our environmental footprint, and supporting the communities we serve across Ghana.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Environment", desc: "Transitioning to fuel-efficient and hybrid vehicles to reduce emissions." },
              { title: "Social", desc: "Creating jobs, supporting local communities, and ensuring fair employment practices." },
              { title: "Governance", desc: "Operating with transparency, integrity, and accountability in everything we do." },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-card border border-white/5 rounded-2xl hover:border-green-500/30 transition-colors">
                <h4 className="font-bold uppercase tracking-widest text-lg mb-4 text-white">{item.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-widest text-white">
              From Our <span className="text-primary">Blog</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Tips, guides, and stories about travelling across Ghana.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Top 5 Road Trips in Ghana", excerpt: "Discover the most scenic routes from Accra to Cape Coast, Kumasi, and beyond." },
              { title: "Renting a Car in Ghana: What You Need to Know", excerpt: "Everything first-time renters should know — from documentation to driving tips." },
              { title: "Best Places to Visit in Accra", excerpt: "A curated guide to Accra's must-see attractions, restaurants, and hidden gems." },
            ].map((post, index) => (
              <div key={index} className="bg-card border border-white/5 rounded-2xl p-8 hover:border-primary/50 transition-all group">
                <p className="text-xs text-primary uppercase tracking-widest mb-4 font-bold">{/* Could add date here */} Travel Guide</p>
                <h3 className="font-bold text-xl mb-4 text-white group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{post.excerpt}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-block border border-primary text-primary px-10 py-4 rounded-full uppercase tracking-widest text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
