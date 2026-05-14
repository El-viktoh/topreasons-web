"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

export default function BookingManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, rentals (title, type, location), profiles (email, full_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setBookings(data || []);
    } catch { toast.error("Failed to load bookings"); } finally { setLoading(false); }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
      toast.success("Booking status updated");
      fetchBookings();
    } catch { toast.error("Failed to update status"); }
  };

  const updatePaymentStatus = async (id: string, paymentStatus: string) => {
    try {
      const { error } = await supabase.from("bookings").update({ payment_status: paymentStatus }).eq("id", id);
      if (error) throw error;
      toast.success("Payment status updated");
      fetchBookings();
    } catch { toast.error("Failed to update payment status"); }
  };

  if (loading) return <div className="text-center py-8">Loading bookings...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Bookings</h2>
      {bookings.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No bookings yet</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{booking.rentals?.title}</h3>
                      <p className="text-sm text-muted-foreground">{booking.rentals?.location}</p>
                    </div>
                    <Badge variant="outline">{booking.rentals?.type}</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Customer</p>
                      <p className="font-medium">{booking.profiles?.full_name || booking.profiles?.email}</p>
                      <p className="text-xs text-muted-foreground">{booking.profiles?.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Dates</p>
                      <p className="font-medium">{format(new Date(booking.start_date), "PPP")} – {format(new Date(booking.end_date), "PPP")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Price</p>
                      <p className="font-medium text-lg">${booking.total_price}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Booked On</p>
                      <p className="font-medium">{format(new Date(booking.created_at), "PPP")}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Booking Status:</span>
                      <Select value={booking.status} onValueChange={(value) => updateBookingStatus(booking.id, value)}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Payment:</span>
                      <Select value={booking.payment_status} onValueChange={(value) => updatePaymentStatus(booking.id, value)}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
