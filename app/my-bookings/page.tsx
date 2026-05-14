"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Calendar, MapPin, Clock, CheckCircle, XCircle, Loader2, Car, Home, ArrowRight, Star } from "lucide-react";
import { format } from "date-fns";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ReviewForm } from "@/components/ReviewForm";

interface Booking {
  id: string;
  rental_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  payment_status: string;
  created_at: string;
  rental?: {
    id: string;
    title: string;
    type: string;
    location: string;
    image_url: string;
    images: string[];
  };
  has_review?: boolean;
}

export default function MyBookings() {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to view your bookings");
      router.push("/auth");
      return;
    }
    await fetchBookings(user.id);
    setLoading(false);
  };

  const fetchBookings = async (userId: string) => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`*, rental:rentals (id, title, type, location, image_url, images)`)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch bookings");
      return;
    }

    const bookingIds = data?.map((b) => b.id) || [];
    const { data: reviews } = await supabase
      .from("reviews")
      .select("booking_id")
      .in("booking_id", bookingIds);

    const reviewedBookingIds = new Set(reviews?.map((r) => r.booking_id) || []);
    setBookings((data || []).map((b) => ({ ...b, has_review: reviewedBookingIds.has(b.id) })));
  };

  const canReview = (booking: Booking) => {
    const isPast = new Date(booking.end_date) < new Date();
    return booking.status === "confirmed" && isPast && !booking.has_review;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-primary text-primary-foreground"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success/20 text-success border border-success/50">Paid</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending Payment</Badge>;
    }
  };

  const filterBookings = (status: string) => {
    if (status === "all") return bookings;
    if (status === "upcoming") return bookings.filter((b) => new Date(b.start_date) >= new Date() && b.status !== "cancelled");
    if (status === "past") return bookings.filter((b) => new Date(b.end_date) < new Date());
    return bookings.filter((b) => b.status === status);
  };

  const getRentalImage = (booking: Booking) => {
    if (booking.rental?.images && booking.rental.images.length > 0) return booking.rental.images[0];
    return booking.rental?.image_url || "/placeholder.svg";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground mt-1">View and manage your rental bookings</p>
          </div>
          <Button onClick={() => router.push("/")} variant="outline">Browse Rentals</Button>
        </div>

        {bookings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-4">You haven't made any rental bookings yet.</p>
              <Button onClick={() => router.push("/")}>
                Start Exploring <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="w-full sm:w-auto overflow-x-auto">
              <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            {["all", "upcoming", "pending", "past"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                {filterBookings(tab).length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No {tab === "all" ? "" : tab} bookings found
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filterBookings(tab).map((booking) => (
                      <Card key={booking.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-48 h-40 md:h-auto overflow-hidden">
                            <img
                              src={getRentalImage(booking)}
                              alt={booking.rental?.title || "Rental"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4 md:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  {booking.rental?.type === "car" ? (
                                    <Car className="w-4 h-4 text-muted-foreground" />
                                  ) : (
                                    <Home className="w-4 h-4 text-muted-foreground" />
                                  )}
                                  <span className="text-xs text-muted-foreground capitalize">
                                    {booking.rental?.type || "Rental"}
                                  </span>
                                </div>
                                <h3 className="font-semibold text-lg">{booking.rental?.title || "Rental"}</h3>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                  <MapPin className="w-3 h-3" />
                                  {booking.rental?.location}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {getStatusBadge(booking.status)}
                                {getPaymentBadge(booking.payment_status)}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {booking.rental?.type === "car" ? "Pick Up" : "Check In"}
                                </p>
                                <p className="font-medium">{format(new Date(booking.start_date), "MMM d, yyyy")}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {booking.rental?.type === "car" ? "Drop Off" : "Check Out"}
                                </p>
                                <p className="font-medium">{format(new Date(booking.end_date), "MMM d, yyyy")}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Booked On</p>
                                <p className="font-medium">{format(new Date(booking.created_at), "MMM d, yyyy")}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="font-bold text-primary">{formatPrice(booking.total_price)}</p>
                              </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                              <Button size="sm" variant="outline" onClick={() => router.push(`/rental/${booking.rental_id}`)}>
                                View Rental
                              </Button>
                              {canReview(booking) && (
                                <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setReviewBooking(booking); }}>
                                  <Star className="w-4 h-4 mr-1" />
                                  Write Review
                                </Button>
                              )}
                              {booking.has_review && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  Reviewed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>

      <Footer />

      {reviewBooking && (
        <ReviewForm
          bookingId={reviewBooking.id}
          rentalId={reviewBooking.rental_id}
          rentalTitle={reviewBooking.rental?.title || "Rental"}
          open={!!reviewBooking}
          onOpenChange={(open) => !open && setReviewBooking(null)}
          onReviewSubmitted={async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) fetchBookings(user.id);
          }}
        />
      )}
    </div>
  );
}
