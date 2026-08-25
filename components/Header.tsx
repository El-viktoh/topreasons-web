"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, User, Home, LogOut, Shield, Calendar, ClipboardList, Heart, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { CurrencySelector } from "@/components/CurrencySelector";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setUserEmail(session.user.email || "");
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
        setUserEmail("");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      setUserEmail(user.email || "");
      checkAdminStatus(user.id);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setUserEmail("");
    router.push("/");
  };

  const getUserInitials = () => {
    if (userEmail) return userEmail.substring(0, 2).toUpperCase();
    return "U";
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Our Offers", href: "/cars" },
    { label: "Our Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="xl:hidden">
              <button className="flex items-center gap-2 text-foreground uppercase text-xs tracking-widest font-medium">
                <Menu className="w-5 h-5" />
                Menu
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-background">
              <div className="flex flex-col gap-6 mt-6">
                <Link href="/" className="flex items-center gap-2 mb-4" onClick={() => setIsOpen(false)}>
                  <img src="/assets/logo.png" alt="Top Reasons" className="h-16" />
                </Link>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "py-3 px-2 text-sm uppercase tracking-widest transition-colors border-b border-border",
                        isActive(item.href) ? "text-primary font-medium" : "text-foreground hover:text-primary"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Currency</p>
                  <CurrencySelector />
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-2 py-3 rounded bg-muted">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">Account</p>
                          <p className="text-xs text-muted-foreground">{userEmail}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="justify-start text-xs uppercase tracking-widest" onClick={() => { router.push("/profile"); setIsOpen(false); }}>
                        <User className="w-4 h-4 mr-2" /> My Profile
                      </Button>
                      <Button variant="outline" className="justify-start text-xs uppercase tracking-widest" onClick={() => { router.push("/my-bookings"); setIsOpen(false); }}>
                        <ClipboardList className="w-4 h-4 mr-2" /> My Bookings
                      </Button>
                      <Button variant="outline" className="justify-start text-xs uppercase tracking-widest" onClick={() => { router.push("/wishlist"); setIsOpen(false); }}>
                        <Heart className="w-4 h-4 mr-2" /> My Wishlist
                      </Button>
                      {isAdmin && (
                        <>
                          <Button variant="outline" className="justify-start text-xs uppercase tracking-widest" onClick={() => { router.push("/admin/dashboard"); setIsOpen(false); }}>
                            <Calendar className="w-4 h-4 mr-2" /> Dashboard
                          </Button>
                          <Button variant="outline" className="justify-start text-xs uppercase tracking-widest" onClick={() => { router.push("/admin"); setIsOpen(false); }}>
                            <Shield className="w-4 h-4 mr-2" /> Admin Panel
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" className="justify-start text-xs uppercase tracking-widest" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="justify-start text-xs uppercase tracking-widest" onClick={() => { router.push("/auth"); setIsOpen(false); }}>
                        <User className="w-4 h-4 mr-2" /> Sign In
                      </Button>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase tracking-widest" onClick={() => { router.push("/cars"); setIsOpen(false); }}>
                        Book Now
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <nav className="hidden xl:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-xs uppercase tracking-widest transition-colors",
                  isActive(item.href) ? "text-primary font-medium" : "text-foreground hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/assets/logo.png" alt="Top Reasons" className="h-16 sm:h-20 md:h-24 transition-all hover:scale-110" />
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden xl:block">
            <CurrencySelector />
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden xl:inline-flex text-xs uppercase tracking-widest text-foreground hover:text-primary transition-colors">
                  Account
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Account</p>
                    <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/")}>
                  <Home className="mr-2 h-4 w-4" /> Home
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/my-bookings")}>
                  <ClipboardList className="mr-2 h-4 w-4" /> My Bookings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                  <Heart className="mr-2 h-4 w-4" /> My Wishlist
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
                      <Calendar className="mr-2 h-4 w-4" /> Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/admin")}>
                      <Shield className="mr-2 h-4 w-4" /> Admin Panel
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              className="hidden xl:inline-flex text-xs uppercase tracking-widest text-foreground hover:text-primary transition-colors"
              onClick={() => router.push("/auth")}
            >
              Sign In
            </button>
          )}
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] sm:text-xs uppercase tracking-widest rounded-sm px-3 sm:px-6 h-9"
            onClick={() => router.push("/cars")}
          >
            Book Now
          </Button>
        </div>
      </div>
    </header>
  );
};
