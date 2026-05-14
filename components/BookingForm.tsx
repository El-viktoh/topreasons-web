"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ghanaLocations = [
  "Accra", "Kumasi", "Tamale", "Cape Coast", "Takoradi",
  "Tema", "Koforidua", "Sunyani", "Ho", "Kotoka International Airport",
];

const timeSlots = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00",
];

export const BookingForm = () => {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState<Date>();
  const [returnTime, setReturnTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/cars");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-card/95 backdrop-blur-md border border-border rounded-sm p-6 md:p-8">
        <h3 className="text-lg font-bold uppercase tracking-widest mb-6 text-center">
          Get A<span className="text-primary"> Quote</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Pickup Location
            </Label>
            <Select value={pickup} onValueChange={setPickup}>
              <SelectTrigger className="rounded-sm bg-background border-border h-11">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {ghanaLocations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <CalendarIcon className="w-3 h-3" /> Pickup Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal rounded-sm bg-background border-border h-11", !pickupDate && "text-muted-foreground")}
                >
                  {pickupDate ? format(pickupDate, "dd MMM yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={pickupDate}
                  onSelect={setPickupDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Pickup Time
            </Label>
            <Select value={pickupTime} onValueChange={setPickupTime}>
              <SelectTrigger className="rounded-sm bg-background border-border h-11">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <CalendarIcon className="w-3 h-3" /> Return Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal rounded-sm bg-background border-border h-11", !returnDate && "text-muted-foreground")}
                >
                  {returnDate ? format(returnDate, "dd MMM yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(date) => date < (pickupDate || new Date())}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-sm h-11 rounded-sm font-semibold"
          >
            Get Quote
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </form>
  );
};
