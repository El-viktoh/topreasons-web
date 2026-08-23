"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Car, Home, Info, AlertCircle } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import Link from "next/link";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function Booking() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isDemo, setIsDemo] = useState(false);
  const [driveOption, setDriveOption] = useState<"self" | "chauffeur">("chauffeur");

  useEffect(() => {
    checkUser();
    fetchRental();
  }, [id]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to book");
      router.push("/auth");
      return;
    }
    setUser(user);

    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (profileData) {
        setProfile(profileData);
      }
    } catch (e) {
      console.error("Failed to fetch profile", e);
    }
  };

  const fetchRental = async () => {
    if (!id || !UUID_REGEX.test(id)) {
      setIsDemo(true);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("rentals").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      setRental(data);
    } catch (error: any) {
      toast.error("Failed to load rental");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!dateRange?.from || !dateRange?.to || !rental) return 0;
    const days = differenceInDays(dateRange.to, dateRange.from);
    return days * rental.price_per_day;
  };

  const handleBooking = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select dates");
      return;
    }
    const days = differenceInDays(dateRange.to, dateRange.from);
    if (isCar && driveOption === "self" && days > 3) {
      toast.error("Self drive allows a maximum booking of 3 days");
      return;
    }
    if (!user) {
      toast.error("Please sign in to book");
      router.push("/auth");
      return;
    }

    setBooking(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        rental_id: id,
        start_date: format(dateRange.from, "yyyy-MM-dd"),
        end_date: format(dateRange.to, "yyyy-MM-dd"),
        total_price: calculateTotal(),
        status: "pending",
        payment_status: "pending",
      });
      if (error) throw error;

      await supabase.functions.invoke("send-booking-confirmation", {
        body: {
          email: user.email,
          rentalTitle: rental.title,
          startDate: format(dateRange.from, "PPP"),
          endDate: format(dateRange.to, "PPP"),
          totalPrice: calculateTotal(),
          driveOption: isCar ? driveOption : undefined,
        },
      });

      toast.success("Booking created successfully! Check your email for confirmation.");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setBooking(false);
    }
  };

  const isCar = rental?.type === "car";
  const startDateLabel = isCar ? "Pick Up" : "Check-in";
  const endDateLabel = isCar ? "Drop Off" : "Check-out";
  const durationLabel = isCar ? "Days" : "Nights";
  const priceLabel = isCar ? "day" : "night";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isDemo || !rental) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <CardTitle>{isDemo ? "Demo Rental" : "Rental Not Found"}</CardTitle>
              <CardDescription>
                {isDemo
                  ? "This is a demo listing for showcase purposes. Real rentals will be available soon!"
                  : "The rental you're looking for doesn't exist or has been removed."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => router.back()}>← Back</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const total = calculateTotal();
  const selectedDays = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) : 0;
  
  const hasUploadedIds = profile && profile.id_card_front_url && profile.id_card_back_url;
  const isInvalidSelfDrive = isCar && driveOption === "self" && selectedDays > 0 && selectedDays < 3;
  const isMissingSelfDriveIds = isCar && driveOption === "self" && !hasUploadedIds;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          ← Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {isCar ? <Car className="w-5 h-5 text-primary" /> : <Home className="w-5 h-5 text-primary" />}
                <span className="text-sm text-muted-foreground capitalize">{rental.type}</span>
              </div>
              <CardTitle>{rental.title}</CardTitle>
              <CardDescription>{rental.location}</CardDescription>
            </CardHeader>
            <CardContent>
              {rental.image_url && (
                <div className="w-full rounded-lg bg-black/20 mb-4 flex items-center justify-center p-2">
                  <img
                    src={rental.image_url}
                    alt={rental.title}
                    className="w-full max-h-72 object-contain rounded-lg"
                  />
                </div>
              )}
              <p className="text-muted-foreground mb-4">{rental.description}</p>
              {rental.features?.length > 0 && (
                <div className="space-y-2">
                  <p className="font-semibold">Features:</p>
                  {rental.features.map((feature: string, index: number) => (
                    <p key={index} className="text-sm text-muted-foreground">• {feature}</p>
                  ))}
                </div>
              )}
              <p className="text-2xl font-bold mt-4">
                {formatPrice(rental.price_per_day)}/{priceLabel}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Book Your {isCar ? "Rental Car" : "Stay"}</CardTitle>
              <CardDescription>
                Select your {isCar ? "pick up and drop off" : "check-in and check-out"} dates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isCar && (
                <div className="space-y-3">
                  <p className="font-medium text-sm">Drive Option</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={driveOption === "self" ? "default" : "outline"}
                      onClick={() => setDriveOption("self")}
                      className="w-full"
                    >
                      Self Drive
                    </Button>
                    <Button
                      type="button"
                      variant={driveOption === "chauffeur" ? "default" : "outline"}
                      onClick={() => setDriveOption("chauffeur")}
                      className="w-full"
                    >
                      Chauffeur
                    </Button>
                  </div>
                  
                  {driveOption === "self" ? (
                    <div className="bg-warning/10 border border-warning/20 text-warning p-3 rounded-md text-sm flex gap-2">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>
                        <strong>Terms & Conditions:</strong> Self-drive rentals require a minimum booking period of 3 days. Standard insurance and security deposits apply.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-md text-sm flex gap-2">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>
                        <strong>Chauffeur Service:</strong> Sit back and relax! Enjoy a premium experience with our highly trained, professional drivers ensuring a safe and comfortable journey.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                disabled={{ before: new Date() }}
                min={isCar && driveOption === "self" ? 3 : undefined}
                className="rounded-md border"
              />

              {dateRange?.from && dateRange?.to && (
                <div className="space-y-2 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between">
                    <span>{startDateLabel}:</span>
                    <span className="font-semibold">{format(dateRange.from, "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{endDateLabel}:</span>
                    <span className="font-semibold">{format(dateRange.to, "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{durationLabel}:</span>
                    <span className="font-semibold">{selectedDays}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleBooking}
                disabled={!dateRange?.from || !dateRange?.to || booking || isInvalidSelfDrive || isMissingSelfDriveIds}
              >
                {booking 
                  ? "Processing..." 
                  : isMissingSelfDriveIds 
                    ? "ID Verification Required" 
                    : isInvalidSelfDrive 
                      ? "Minimum 3 days required" 
                      : "Confirm Booking"}
              </Button>
              
              {isMissingSelfDriveIds && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm flex gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>
                    <strong>Action Required:</strong> You must upload your ID cards (front and back) to your profile before you can book a Self-Drive rental.{" "}
                    <Link href="/profile" className="font-semibold underline underline-offset-2">
                      Go to My Profile
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
