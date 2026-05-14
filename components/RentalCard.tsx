"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Image } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";

interface RentalCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  images?: string[];
  type: "car" | "apartment";
  features: string[];
  available: boolean;
  showFavorite?: boolean;
}

export const RentalCard = ({
  id,
  title,
  location,
  price,
  rating = 0,
  reviewCount = 0,
  image,
  images,
  type,
  features,
  available,
  showFavorite = true,
}: RentalCardProps) => {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();

  const displayImage = images?.[0] || image;
  const imageCount = images?.length || (image ? 1 : 0);

  const handleCardClick = () => router.push(`/rental/${id}`);

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (available) router.push(`/booking/${id}`);
  };

  return (
    <Card className="rental-card group cursor-pointer" onClick={handleCardClick}>
      <div className="relative overflow-hidden">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={type === "car" ? "default" : "secondary"} className="bg-white/90 text-primary">
            {type === "car" ? "Car" : "Apartment"}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {showFavorite && (
            <FavoriteButton isFavorite={isFavorite(id)} onToggle={() => toggleFavorite(id)} size="sm" />
          )}
          <Badge variant={available ? "default" : "destructive"} className="bg-white/90">
            {available ? "Available" : "Booked"}
          </Badge>
        </div>
        {imageCount > 1 && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" className="bg-background/80 flex items-center gap-1">
              <Image className="w-3 h-3" />
              {imageCount}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          {reviewCount > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
              <span className="text-sm text-muted-foreground">({reviewCount})</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">New</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">{feature}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary">{formatPrice(price)}</span>
            <span className="text-muted-foreground">/{type === "car" ? "day" : "night"}</span>
          </div>
          <Button size="sm" disabled={!available} className="bg-primary hover:bg-primary/90" onClick={handleBookClick}>
            {available ? "Book Now" : "Unavailable"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
