"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import { MapPin, Check, ArrowLeft, Calendar, Shield, Car, Home, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ReviewList } from "@/components/ReviewList";
import { useRentalRating } from "@/hooks/useRentalRating";

interface Rental {
  id: string;
  title: string;
  description: string | null;
  location: string;
  price_per_day: number;
  image_url: string | null;
  images: string[] | null;
  type: string;
  features: string[] | null;
  available: boolean | null;
}

export default function RentalDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { averageRating, reviewCount } = useRentalRating(id || "");

  useEffect(() => {
    if (id) fetchRental();
  }, [id]);

  const fetchRental = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("rentals")
      .select("*")
      .eq("id", id)
      .eq("approval_status", "approved")
      .maybeSingle();
    if (!error && data) setRental(data);
    setLoading(false);
  };

  const getImages = (): string[] => {
    if (!rental) return [];
    if (rental.images && rental.images.length > 0) return rental.images;
    if (rental.image_url) return [rental.image_url];
    return ["/placeholder.svg"];
  };

  const images = getImages();

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Rental Not Found</h1>
          <p className="text-muted-foreground mb-6">This rental doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const TypeIcon = rental.type === "car" ? Car : Home;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="relative">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={images[currentImageIndex]}
                alt={`${rental.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-80 lg:h-[500px] object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <Badge className="absolute top-4 left-4 flex items-center gap-1">
                <TypeIcon className="w-3 h-3" />
                {rental.type === "car" ? "Car" : "Apartment"}
              </Badge>

              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-background/80 px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}

              {!rental.available && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg py-2 px-4">Currently Unavailable</Badge>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{rental.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{rental.location}</span>
                </div>
                {reviewCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">{averageRating}</span>
                    <span>({reviewCount} review{reviewCount !== 1 ? "s" : ""})</span>
                  </div>
                )}
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">{formatPrice(rental.price_per_day)}</span>
                  <span className="text-muted-foreground">/ {rental.type === "car" ? "day" : "night"}</span>
                </div>
              </CardContent>
            </Card>

            {rental.description && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{rental.description}</p>
              </div>
            )}

            {rental.features && rental.features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {rental.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Verified Listing</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Instant Booking</span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={!rental.available}
              onClick={() => router.push(`/booking/${rental.id}`)}
            >
              {rental.available ? "Book Now" : "Currently Unavailable"}
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          <ReviewList rentalId={rental.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
