"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DriverApplicationPage() {
  const router = useRouter();

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
          <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); alert("Application submitted successfully!"); router.push("/"); }}>

            {/* Personal Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground/80">First Name</Label>
                  <Input id="firstName" placeholder="Kwame" required className="bg-background border-border text-foreground h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground/80">Last Name</Label>
                  <Input id="lastName" placeholder="Mensah" required className="bg-background border-border text-foreground h-12" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/80">Email Address</Label>
                  <Input id="email" type="email" placeholder="kwame@example.com" required className="bg-background border-border text-foreground h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground/80">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+233 5X XXX XXXX" required className="bg-background border-border text-foreground h-12" />
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2">Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType" className="text-foreground/80">Vehicle Type</Label>
                  <Select required>
                    <SelectTrigger className="bg-background border-border text-foreground h-12">
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
                  <Input id="vehicleMake" placeholder="e.g., Toyota Land Cruiser" required className="bg-background border-border text-foreground h-12" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear" className="text-foreground/80">Year of Manufacture</Label>
                  <Input id="vehicleYear" placeholder="2020" required className="bg-background border-border text-foreground h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber" className="text-foreground/80">Driver's License Number</Label>
                  <Input id="licenseNumber" placeholder="DL-XXXX-XXXX" required className="bg-background border-border text-foreground h-12" />
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
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full mt-4">
              Submit Application
            </Button>
          </form>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
