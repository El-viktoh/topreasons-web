"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";

const contactInfo = [
  { icon: Mail, title: "Email Us", content: "inquires@topreasonsco.com", description: "For general inquiries" },
  { icon: Phone, title: "Call Us", content: "+233 XX XXX XXXX", description: "Mon-Fri 8am-6pm GMT" },
  { icon: MapPin, title: "Visit Us", content: "Accra, Ghana", description: "Greater Accra Region" },
  { icon: Clock, title: "Response Time", content: "Within 24 hours", description: "We respond quickly" },
];

const faqs = [
  { question: "How do I book a car?", answer: "Browse our fleet, select your dates, and click 'Book Now'. It's that simple!" },
  { question: "What's your cancellation policy?", answer: "Free cancellation up to 48 hours before your booking. After that, a fee may apply." },
  { question: "Are vehicles insured?", answer: "Yes! All our vehicles include comprehensive insurance coverage for your peace of mind." },
  { question: "Do you offer airport transfers?", answer: "Yes, we provide reliable pickup and drop-off at Kotoka International Airport and other locations." },
];

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message sent! We'll get back to you as soon as possible.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="relative py-24 px-4 overflow-hidden">
        <img src="/assets/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative z-10 container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-tight">
            Get In<span className="text-primary"> Touch</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out and we'll get back to you shortly.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="text-center p-8 bg-card border border-border rounded-sm">
                  <div className="w-14 h-14 mx-auto mb-4 border border-primary/30 rounded-sm flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold uppercase tracking-wide text-sm mb-1">{info.title}</h3>
                  <p className="text-primary font-medium mb-1">{info.content}</p>
                  <p className="text-xs text-muted-foreground">{info.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 flex-1">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-card border border-border rounded-sm p-8 md:p-10">
              <h2 className="text-2xl font-bold mb-2 uppercase tracking-tight">
                Send Us A<span className="text-primary"> Message</span>
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs uppercase tracking-widest">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      className="rounded-sm bg-background border-border"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-widest">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="rounded-sm bg-background border-border"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-xs uppercase tracking-widest">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    className="rounded-sm bg-background border-border"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs uppercase tracking-widest">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more..."
                    rows={5}
                    className="rounded-sm bg-background border-border"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-sm py-5 rounded-sm font-semibold"
                  disabled={loading}
                >
                  {loading ? "Sending..." : (
                    <>
                      Send Message
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-8 uppercase tracking-tight">
                Frequently Asked<span className="text-primary"> Questions</span>
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-6 bg-card border border-border rounded-sm">
                    <h3 className="font-bold mb-2 text-sm uppercase tracking-wide">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
