import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Award, Heart, MapPin, Target, Briefcase, Leaf, BookOpen } from "lucide-react";

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
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="relative py-32 px-4 overflow-hidden">
        <img src="/assets/hero-bg.jpg" alt="Top Reasons fleet" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative z-10 container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-tight">
            About<span className="text-primary"> Top Reasons</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Ghana's trusted car rental company — making quality vehicle rentals simple, affordable, and accessible.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-10 uppercase tracking-tight text-center">
            Our<span className="text-primary"> Story</span>
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Top Reasons was founded in Ghana with a clear mission: to make car rentals simple, reliable, and affordable
              for everyone. Whether you're a business traveller in Accra, a tourist exploring Cape Coast, or a family
              heading to Kumasi for the holidays — we've got you covered.
            </p>
            <p>
              We noticed that finding a trustworthy rental car in Ghana was often frustrating — unclear pricing, poorly
              maintained vehicles, and unreliable service. So we built Top Reasons to be different: transparent pricing,
              well-maintained vehicles, and customer service you can count on.
            </p>
            <p>
              Today, Top Reasons serves thousands of customers across Ghana with a growing fleet of quality vehicles. We
              also curate the best places to stay, helping visitors find comfortable accommodations wherever they travel
              in Ghana.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-card border-y border-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground uppercase tracking-widest text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 uppercase tracking-tight text-center">
            Our<span className="text-primary"> Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center p-8 bg-card border border-border rounded-sm">
                  <div className="w-16 h-16 mx-auto mb-6 border border-primary/30 rounded-sm flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card border-y border-border">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="w-16 h-16 mx-auto mb-8 border border-primary/30 rounded-sm flex items-center justify-center">
            <Target className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 uppercase tracking-tight">
            Our<span className="text-primary"> Mission</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            To be Ghana's most trusted car rental service — providing reliable, affordable, and well-maintained vehicles
            so that every journey is comfortable and worry-free. We believe quality transportation should be accessible
            to everyone.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-14 h-14 mb-6 border border-primary/30 rounded-sm flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight">Careers</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Join the Top Reasons team and help us transform car rental in Ghana. We're always looking for passionate,
                driven individuals who share our commitment to exceptional service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From drivers to customer support, operations to marketing — there's a place for you at Top Reasons. We
                offer competitive compensation, a supportive work environment, and the chance to grow with a fast-moving
                company.
              </p>
            </div>
            <div className="bg-card border border-border rounded-sm p-8">
              <h3 className="font-bold uppercase tracking-wide text-sm mb-4 text-primary">Why Work With Us</h3>
              <ul className="space-y-4 text-muted-foreground">
                {[
                  "Competitive salary and benefits",
                  "Growth opportunities in a fast-paced environment",
                  "Supportive team culture",
                  "Making a real impact on transportation in Ghana",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card border-y border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-14 h-14 mx-auto mb-6 border border-primary/30 rounded-sm flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 uppercase tracking-tight">
            ESG &<span className="text-primary"> Sustainability</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            At Top Reasons, we're committed to building a sustainable future. We're investing in fuel-efficient vehicles,
            reducing our environmental footprint, and supporting the communities we serve across Ghana.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { title: "Environment", desc: "Transitioning to fuel-efficient and hybrid vehicles to reduce emissions." },
              { title: "Social", desc: "Creating jobs, supporting local communities, and ensuring fair employment practices." },
              { title: "Governance", desc: "Operating with transparency, integrity, and accountability in everything we do." },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-background border border-border rounded-sm">
                <h4 className="font-bold uppercase tracking-wide text-sm mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="w-14 h-14 mx-auto mb-6 border border-primary/30 rounded-sm flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight">
              From Our<span className="text-primary"> Blog</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Tips, guides, and stories about travelling across Ghana.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Top 5 Road Trips in Ghana", excerpt: "Discover the most scenic routes from Accra to Cape Coast, Kumasi, and beyond." },
              { title: "Renting a Car in Ghana: What You Need to Know", excerpt: "Everything first-time renters should know — from documentation to driving tips." },
              { title: "Best Places to Visit in Accra", excerpt: "A curated guide to Accra's must-see attractions, restaurants, and hidden gems." },
            ].map((post, index) => (
              <div key={index} className="bg-card border border-border rounded-sm p-6 hover:border-primary/50 transition-colors">
                <p className="text-xs text-primary uppercase tracking-widest mb-3">Travel Guide</p>
                <h3 className="font-bold mb-3">{post.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/blog"
              className="inline-block border border-primary text-primary px-8 py-3 rounded-sm uppercase tracking-widest text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
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
