"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
  size?: "sm" | "default";
}

export const FavoriteButton = ({ isFavorite, onToggle, className, size = "default" }: FavoriteButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full bg-background/80 hover:bg-background backdrop-blur-sm transition-all",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        className
      )}
      onClick={handleClick}
    >
      <Heart
        className={cn(
          "transition-all",
          size === "sm" ? "w-4 h-4" : "w-5 h-5",
          isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"
        )}
      />
    </Button>
  );
};
