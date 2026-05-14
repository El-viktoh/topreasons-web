"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import RentalManagement from "@/components/admin/RentalManagement";
import BookingManagement from "@/components/admin/BookingManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import { Loader2, Home, LayoutDashboard, LogOut, Menu, X } from "lucide-react";

export default function Admin() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please sign in");
        router.push("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error("Access denied: Admin only");
        router.push("/");
        return;
      }

      setIsAdmin(true);
    } catch (error: any) {
      toast.error("Access denied");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Top Reasons" className="h-8" />
            <span className="text-lg md:text-xl font-bold">Admin Panel</span>
          </div>

          <div className="hidden md:flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/dashboard")}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => { router.push("/admin/dashboard"); setMobileMenuOpen(false); }}>
              <LayoutDashboard className="w-4 h-4 mr-2" />Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { router.push("/"); setMobileMenuOpen(false); }}>
              <Home className="w-4 h-4 mr-2" />Home
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />Sign Out
            </Button>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <Tabs defaultValue="rentals" className="space-y-6">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex">
            <TabsTrigger value="rentals" className="text-xs sm:text-sm">Rentals</TabsTrigger>
            <TabsTrigger value="bookings" className="text-xs sm:text-sm">Bookings</TabsTrigger>
            <TabsTrigger value="blog" className="text-xs sm:text-sm">Blog</TabsTrigger>
          </TabsList>

          <TabsContent value="rentals"><RentalManagement /></TabsContent>
          <TabsContent value="bookings"><BookingManagement /></TabsContent>
          <TabsContent value="blog"><BlogManagement /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
