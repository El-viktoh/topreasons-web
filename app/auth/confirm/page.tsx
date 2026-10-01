"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, Mail, Car, Home } from "lucide-react";
import { toast } from "sonner";
import type { EmailOtpType } from "@supabase/supabase-js";

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    const processConfirmation = async () => {
      try {
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type") as EmailOtpType | null;
        const code = searchParams.get("code");
        const error_description = searchParams.get("error_description");

        if (error_description) {
          throw new Error(error_description);
        }

        // 1. Verify via token_hash (standard Supabase email template)
        if (token_hash && type) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
          });

          if (error) throw error;

          if (data?.user) {
            setUserEmail(data.user.email || "");
            setUserName(data.user.user_metadata?.full_name || "");
            setStatus("success");
            return;
          }
        }

        // 2. Verify via PKCE code exchange
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;

          if (data?.user) {
            setUserEmail(data.user.email || "");
            setUserName(data.user.user_metadata?.full_name || "");
            setStatus("success");
            return;
          }
        }

        // 3. Fallback: Check existing session (implicit hash token handled by client)
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserEmail(session.user.email || "");
          setUserName(session.user.user_metadata?.full_name || "");
          setStatus("success");
          return;
        }

        // If neither was present and no session found
        if (!token_hash && !code) {
          setStatus("error");
          setErrorMessage("No verification token or code was provided in the link.");
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setStatus("error");
        setErrorMessage(
          err.message || "This verification link has expired or has already been used."
        );
      }
    };

    processConfirmation();
  }, [searchParams]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: resendEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) throw error;

      setResendSent(true);
      toast.success("Verification link sent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend verification email");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center gap-2 mb-8 text-center">
          <Link href="/">
            <img src="/assets/logo.png" alt="Top Reasons" className="h-16 md:h-20" />
          </Link>
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">
            Premier Mobility & Fleet Services
          </span>
        </div>

        {/* LOADING STATE */}
        {status === "loading" && (
          <Card className="border-border/60 bg-card/80 backdrop-blur">
            <CardContent className="pt-10 pb-10 text-center space-y-4">
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                <div className="w-14 h-14 rounded-full border-2 border-primary border-t-transparent animate-spin flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold tracking-tight">Verifying Your Account</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we confirm your email address...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SUCCESS STATE */}
        {status === "success" && (
          <Card className="border-primary/40 bg-card shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-primary to-yellow-300" />
            <CardHeader className="text-center pt-8 pb-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_25px_rgba(212,175,55,0.25)]">
                <CheckCircle2 className="w-9 h-9 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Email Verified!</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {userName ? `Welcome aboard, ${userName}!` : "Welcome to Top Reasons!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center pb-6">
              <div className="p-3 bg-secondary/50 rounded-md border border-border text-xs text-muted-foreground">
                Your email <strong className="text-foreground">{userEmail}</strong> has been successfully verified. Your account is active.
              </div>
              <p className="text-sm text-muted-foreground">
                You can now browse and reserve luxury vehicles, book airport transfers, and manage your trips.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2.5">
              <Button asChild className="w-full font-semibold">
                <Link href="/cars">
                  <Car className="w-4 h-4 mr-2" />
                  Explore Vehicles
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Return to Home
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ERROR STATE */}
        {status === "error" && (
          <Card className="border-destructive/30 bg-card shadow-xl">
            <CardHeader className="text-center pt-8 pb-3">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center text-destructive">
                <AlertCircle className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl font-bold">Verification Link Expired</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {errorMessage || "The link may have expired or was already used."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="p-3 bg-secondary/40 rounded-md border border-border text-xs text-muted-foreground">
                Verification links expire after 24 hours for security. Enter your email below to receive a new link sent from <span className="text-primary font-medium">enquiries@topreasonsco.com</span>.
              </div>

              {resendSent ? (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-md text-xs text-green-400 text-center">
                  A fresh verification link has been sent to your email. Please check your inbox and spam folder.
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-3">
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="resend-email" className="text-xs uppercase tracking-wider">
                      Your Email Address
                    </Label>
                    <Input
                      id="resend-email"
                      type="email"
                      placeholder="you@example.com"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={resendLoading}>
                    {resendLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending Link...
                      </>
                    ) : (
                      "Send Fresh Verification Link"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border pt-4">
              <Link href="/auth?tab=signin" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                Back to Sign In <ArrowRight className="w-3 h-3" />
              </Link>
            </CardFooter>
          </Card>
        )}

      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
