import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, MapPin, Briefcase, Clock, Users, ShieldCheck, HeartHandshake } from "lucide-react";

export default function CareersPage() {
  const jobs = [
    {
      title: "Professional Executive Chauffeur",
      department: "Operations",
      type: "Full-Time",
      location: "Accra, Ghana",
      link: "/driver-application",
      featured: true
    },
    {
      title: "Customer Support Executive",
      department: "Customer Service",
      type: "Full-Time",
      location: "Accra, Ghana",
      link: "mailto:careers@topreasons.com?subject=Application for Customer Support Executive",
      featured: false
    },
    {
      title: "Fleet Maintenance Manager",
      department: "Operations",
      type: "Full-Time",
      location: "Accra, Ghana",
      link: "mailto:careers@topreasons.com?subject=Application for Fleet Maintenance Manager",
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[400px] sm:h-[60vh] sm:min-h-[500px] flex items-center justify-center overflow-hidden">
        <img 
          src="/assets/mercedes_s_class.png" 
          alt="TopReasons Careers" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-[1]" />
        
        <div className="relative z-10 container mx-auto text-center max-w-4xl px-4 mt-20">
          <h4 className="text-primary uppercase tracking-[0.3em] font-semibold text-sm md:text-base mb-4">
            Join Our Team
          </h4>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-tight text-foreground">
            Careers at <span className="text-primary">TopReasons</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            Help us redefine luxury transport and logistics in Ghana. We're looking for driven individuals to join our fast-growing family.
          </p>
        </div>
      </section>

      {/* Open Roles Section */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-widest text-foreground">
              Open <span className="text-primary">Roles</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find your next career opportunity below. Don't see a fit? Send your CV to careers@topreasons.com.
            </p>
          </div>

          <div className="space-y-6">
            {jobs.map((job, idx) => (
              <div
                key={idx}
                className={`bg-card rounded-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 ${
                  job.featured ? "border border-primary/50 shadow-lg shadow-primary/10" : "border border-border hover:border-primary/30"
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {job.department}
                    </span>
                    {job.featured && (
                      <span className="text-xs font-bold uppercase tracking-widest text-destructive-foreground bg-destructive/80 px-3 py-1 rounded-full">
                        Hot Role
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> {job.type}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Full-Time
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <Link
                    href={job.link}
                    className={`inline-flex items-center justify-center font-bold py-4 px-8 uppercase tracking-widest transition-all duration-300 rounded-sm w-full md:w-auto ${
                      job.featured
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:scale-105"
                        : "bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-24 px-4 bg-background border-t border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-widest text-foreground">
              Why <span className="text-primary">TopReasons?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-sm border border-border text-center group hover:border-primary/30 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 bg-background border border-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground uppercase tracking-wider mb-3">Premium Environment</h3>
              <p className="text-muted-foreground leading-relaxed">Work with a top-tier fleet of vehicles and serve high-end corporate and international clients.</p>
            </div>

            <div className="bg-card p-8 rounded-sm border border-border text-center group hover:border-primary/30 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 bg-background border border-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground uppercase tracking-wider mb-3">Great Team Culture</h3>
              <p className="text-muted-foreground leading-relaxed">Join a diverse, supportive family that values collaboration, respect, and mutual growth.</p>
            </div>

            <div className="bg-card p-8 rounded-sm border border-border text-center group hover:border-primary/30 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 bg-background border border-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground uppercase tracking-wider mb-3">Competitive Benefits</h3>
              <p className="text-muted-foreground leading-relaxed">Enjoy excellent compensation, health benefits, and performance bonuses.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
