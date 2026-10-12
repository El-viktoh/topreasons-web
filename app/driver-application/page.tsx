"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// `website` is a hidden trap field: real applicants never see or fill it, bots usually do
const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  vehicleType: "",
  vehicleMake: "",
  vehicleYear: "",
  licenseNumber: "",
  experience: "",
  website: "",
};

export default function DriverApplicationPage() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const update =
    (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((current) => ({ ...current, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicleType) {
      toast.error("Please select your vehicle type.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/driver-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "We couldn't submit your application. Please try again.");
      }
      setSubmittedName(form.firstName.trim());
      setForm(EMPTY_FORM);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn't submit your application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-16 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground mb-8"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Driver Application
          </h1>
          <p className="text-lg text-muted-foreground">
            Join Ghana's fastest-growing premium mobility network. Fill out the form below to apply.
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-sm p-8 md:p-12 shadow-2xl">
          {submittedName !== null ? (
            <div className="text-center py-8 space-y-5" role="status">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Application received</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Thank you{submittedName ? `, ${submittedName}` : ""}. Our team will review your application and contact you on the email address or phone number you gave us.
              </p>
              <Button size="lg" onClick={() => router.push("/")}>
                Back to Home
              </Button>
            </div>
          ) : (
          <form className="space-y-10" onSubmit={handleSubmit}>
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">Leave this field empty</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={update("website")}
              />
            </div>

            {/* Personal Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground/80">First Name</Label>
                  <Input id="firstName" placeholder="Kwame" required maxLength={60} value={form.firstName} onChange={update("firstName")} className="bg-background border-border text-foreground h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground/80">Last Name</Label>
                  <Input id="lastName" placeholder="Mensah" required maxLength={60} value={form.lastName} onChange={update("lastName")} className="bg-background border-border text-foreground h-12" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/80">Email Address</Label>
                  <Input id="email" type="email" placeholder="kwame@example.com" required maxLength={254} value={form.email} onChange={update("email")} className="bg-background border-border text-foreground h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground/80">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+233 5X XXX XXXX" required maxLength={25} value={form.phone} onChange={update("phone")} className="bg-background border-border text-foreground h-12" />
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2">Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType" className="text-foreground/80">Vehicle Type</Label>
                  <Select value={form.vehicleType} onValueChange={(value) => setForm((current) => ({ ...current, vehicleType: value }))}>
                    <SelectTrigger id="vehicleType" className="bg-background border-border text-foreground h-12">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      <SelectItem value="saloon">Executive Saloon</SelectItem>
                      <SelectItem value="suv">Spacious SUV</SelectItem>
                      <SelectItem value="courier">Courier Van</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleMake" className="text-foreground/80">Make & Model</Label>
                  <Input id="vehicleMake" placeholder="e.g., Toyota Land Cruiser" required maxLength={100} value={form.vehicleMake} onChange={update("vehicleMake")} className="bg-background border-border text-foreground h-12" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear" className="text-foreground/80">Year of Manufacture</Label>
                  <Input id="vehicleYear" placeholder="2020" required inputMode="numeric" maxLength={4} value={form.vehicleYear} onChange={update("vehicleYear")} className="bg-background border-border text-foreground h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber" className="text-foreground/80">Driver's License Number</Label>
                  <Input id="licenseNumber" placeholder="DL-XXXX-XXXX" required maxLength={40} value={form.licenseNumber} onChange={update("licenseNumber")} className="bg-background border-border text-foreground h-12" />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2">Experience</h3>
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-foreground/80">Tell us about your driving experience</Label>
                <Textarea
                  id="experience"
                  placeholder="I have 5 years of professional driving experience in Accra..."
                  className="bg-background border-border text-foreground min-h-[150px] resize-none"
                  required
                  maxLength={3000}
                  value={form.experience}
                  onChange={update("experience")}
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full mt-4" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
          )}
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
