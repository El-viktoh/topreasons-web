"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Car, Home } from "lucide-react";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function Booking() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isDemo, setIsDemo] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (isDemo || !rental) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
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
            <Button onClick={() => router.push("/")}>← Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => router.push("/")} className="mb-6">
          ← Back to Home
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
                <img
                  src={rental.image_url}
                  alt={rental.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
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
                GH₵{rental.price_per_day}/{priceLabel}
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
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                disabled={{ before: new Date() }}
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
                    <span className="font-semibold">{differenceInDays(dateRange.to, dateRange.from)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>GH₵{total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleBooking}
                disabled={!dateRange?.from || !dateRange?.to || booking}
              >
                {booking ? "Processing..." : "Confirm Booking"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
