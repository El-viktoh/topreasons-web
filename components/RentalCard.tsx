"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Image as ImageIcon } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
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
  type: string;
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
  showFavorite = true,
}: RentalCardProps) => {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();

  const displayImage = images?.[0] || image;
  const imageCount = images?.length || (image ? 1 : 0);

  const handleCardClick = () => router.push(`/rental/${id}`);

  return (
    <Card 
      className="bg-card border-none rounded-md overflow-hidden group cursor-pointer transition-all duration-500 flex flex-col"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-black/40 flex items-center justify-center">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Category Badge */}
        {type && (
          <Badge className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm text-foreground border border-border rounded-sm uppercase text-[10px] tracking-wider font-bold px-2 py-1 hover:bg-background/80">
            {type}
          </Badge>
        )}

        {/* Favorite Icon */}
        <div className="absolute top-4 right-4 z-10">
          {showFavorite && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(id);
              }}
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg 
                width="20" height="20" viewBox="0 0 24 24" 
                fill={isFavorite(id) ? "white" : "none"} 
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          )}
        </div>

        {/* Image Count Indicator */}
        {imageCount > 1 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-white/70 text-xs">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{imageCount}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-4 flex flex-col flex-grow justify-between">
        <div className="mb-5">
          <h3 className="font-semibold text-[17px] text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
            {title}
          </h3>

          {/* Location & Rating */}
          <div className="flex items-center justify-between mb-4">
            {location ? (
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            ) : <span />}
            {reviewCount > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                <span className="text-xs font-semibold text-foreground">{rating.toFixed(1)}</span>
                <span className="text-[11px] text-muted-foreground">({reviewCount})</span>
              </div>
            )}
          </div>

          {/* Features Grid (2x2) */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-2">
            {features.slice(0, 4).map((feature, index) => {
              // Basic parsing to split feature into label/value if possible, otherwise just show it
              return (
                <div key={index} className="flex items-center text-muted-foreground text-[11px] font-medium tracking-wide">
                  <span className="truncate">{feature}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Row (Price & Book Now) */}
        <div className="flex items-center justify-between mt-auto">
          <div className="text-primary font-black text-lg tracking-tight uppercase">
            {formatPrice(price)}<span className="text-[10px] font-medium text-muted-foreground normal-case ml-1">/day</span>
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-[10px] h-8 px-4 py-0 rounded-sm font-bold transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation(); // prevent double navigation event
              handleCardClick(); // go to rental detail page
            }}
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
