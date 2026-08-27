"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, DollarSign, Home, Activity, Calendar } from "lucide-react";
import { toast } from "sonner";

type Currency = "USD" | "GBP" | "GHS";

interface CurrencyConfig {
  symbol: string;
  rate: number;
  name: string;
}

const currencies: Record<Currency, CurrencyConfig> = {
  GHS: { symbol: "GHS ", rate: 1, name: "Ghana Cedi" },
  USD: { symbol: "$", rate: 0.067, name: "US Dollar" },
  GBP: { symbol: "£", rate: 0.053, name: "British Pound" },
};

interface DashboardMetrics {
  totalBookings: number;
  totalRevenue: number;
  activeRentals: number;
  pendingBookings: number;
}

interface RecentActivity {
  id: string;
  rental_title: string;
  user_email: string;
  total_price: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<Currency>("GHS");
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalBookings: 0,
    totalRevenue: 0,
    activeRentals: 0,
    pendingBookings: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        toast.error("Access denied. Admin privileges required.");
        router.push("/");
        return;
      }

      await loadDashboardData();
    } catch {
      router.push("/");
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingsResult, rentalsResult, recentResult] = await Promise.all([
        supabase.from("bookings").select("total_price, status"),
        supabase.from("rentals").select("available"),
        supabase
          .from("bookings")
          .select("id, total_price, status, created_at, rental_id, user_id")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const totalBookings = bookingsResult.data?.length || 0;
      const totalRevenue = bookingsResult.data?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0;
      const activeRentals = rentalsResult.data?.filter((r) => r.available).length || 0;
      const pendingBookings = bookingsResult.data?.filter((b) => b.status === "pending").length || 0;

      setMetrics({ totalBookings, totalRevenue, activeRentals, pendingBookings });

      if (recentResult.data) {
        const activityPromises = recentResult.data.map(async (booking) => {
          const [rentalResult, profileResult] = await Promise.all([
            supabase.from("rentals").select("title").eq("id", booking.rental_id).single(),
            supabase.from("profiles").select("email").eq("id", booking.user_id).single(),
          ]);
          return {
            id: booking.id,
            rental_title: rentalResult.data?.title || "Unknown",
            user_email: profileResult.data?.email || "Unknown",
            total_price: Number(booking.total_price),
            status: booking.status || "Unknown",
            created_at: booking.created_at,
          };
        });
        setRecentActivity(await Promise.all(activityPromises));
      }
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };


  const formatCurrency = (amount: number) => {
    const converted = amount * currencies[currency].rate;
    return `${currencies[currency].symbol}${converted.toFixed(2)}`;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-success bg-success/10";
      case "pending": return "text-warning bg-warning/10";
      case "cancelled": return "text-destructive bg-destructive/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Overview of your rental business</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Currency:</span>
            <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(currencies).map(([code, config]) => (
                  <SelectItem key={code} value={code}>
                    {config.symbol} {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">All-time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalBookings}</div>
              <p className="text-xs text-muted-foreground">{metrics.pendingBookings} pending approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeRentals}</div>
              <p className="text-xs text-muted-foreground">Currently available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pendingBookings}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest bookings in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{activity.rental_title}</p>
                      <p className="text-sm text-muted-foreground">{activity.user_email}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(activity.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                      <span className="font-semibold">{formatCurrency(activity.total_price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
