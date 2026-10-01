"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, User, Building2, Loader2, CheckCircle, XCircle, Mail, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { signInSchema, signUpSchema, resetEmailSchema, newPasswordSchema } from "@/lib/validation";

type UserType = "customer" | "renter";

export default function Auth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>("customer");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [passwordUpdatedOpen, setPasswordUpdatedOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [newPassword, setNewPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Email verification state
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");
    if (type === "recovery") setIsPasswordRecovery(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsPasswordRecovery(true);
    });

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "signin" || tab === "signup") {
        setActiveTab(tab);
      } else {
        setActiveTab("signin");
      }
    };
    
    handlePopState();
    window.addEventListener("popstate", handlePopState);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Cooldown countdown effect
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setUnconfirmedEmail(null);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    window.history.pushState(null, '', url.toString());
  };

  const checkPasswordStrength = (password: string) => {
    setPasswordChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  };

  const handleForgotPassword = async () => {
    const result = resetEmailSchema.safeParse({ email: resetEmail });
    if (!result.success) {
      toast.error(result.error.errors[0]?.message || "Invalid email");
      return;
    }
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth#type=recovery`,
      });
      if (error) throw error;
      toast.success("Password reset link sent! Check your email.");
      setForgotPasswordOpen(false);
      setResetEmail("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setResetLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = newPasswordSchema.safeParse({ password: newPassword });
    if (!result.success) {
      toast.error(result.error.errors[0]?.message || "Invalid password");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordUpdatedOpen(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async (targetEmail: string) => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: targetEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      if (error) throw error;
      toast.success("Fresh verification link sent! Check your inbox.");
      setResendCooldown(60);
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setUnconfirmedEmail(null);
    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Specifically detect email not confirmed error
        const errMsg = error.message.toLowerCase();
        if (errMsg.includes("email not confirmed") || errMsg.includes("email_not_confirmed")) {
          setUnconfirmedEmail(email);
          throw new Error("Your email has not been verified yet. Please check your inbox or resend the verification link.");
        }
        throw error;
      }
      toast.success("Signed in successfully!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    if (userType === "renter") {
      router.push("/renter/signup");
      return;
    }

    const result = signUpSchema.safeParse({ email, password, fullName });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: { full_name: fullName },
        },
      });
      if (error) throw error;

      if (data.session) {
        // Auto-confirmed or confirmations off
        toast.success("Account created successfully!");
        router.push("/");
      } else if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
        // Supabase returns an empty identities array when the email is already registered
        toast.info("An account with this email already exists. Please sign in instead.");
        handleTabChange("signin");
      } else {
        // Email verification is required!
        setPendingVerificationEmail(email);
        setResendCooldown(60);
        toast.success("Account created! Verification email sent.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordRequirements = ({ password }: { password: string }) => {
    const requirements = [
      { key: "length", label: "At least 8 characters", met: passwordChecks.length },
      { key: "uppercase", label: "One uppercase letter", met: passwordChecks.uppercase },
      { key: "lowercase", label: "One lowercase letter", met: passwordChecks.lowercase },
      { key: "number", label: "One number", met: passwordChecks.number },
      { key: "special", label: "One special character", met: passwordChecks.special },
    ];
    if (!password) return null;
    return (
      <div className="mt-2 space-y-1">
        {requirements.map((req) => (
          <div key={req.key} className="flex items-center gap-2 text-xs">
            {req.met ? <CheckCircle className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-destructive" />}
            <span className={req.met ? "text-green-500" : "text-muted-foreground"}>{req.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center justify-center gap-2 mb-8">
          <img src="/assets/logo.png" alt="Top Reasons" className="h-20" />
        </div>

        {isPasswordRecovery ? (
          <Card>
            <CardHeader>
              <CardTitle>Set New Password</CardTitle>
              <CardDescription>Enter your new password below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); checkPasswordStrength(e.target.value); }}
                    required
                  />
                  <PasswordRequirements password={newPassword} />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : pendingVerificationEmail ? (
          /* VERIFICATION PENDING STATE AFTER SIGNUP */
          <Card className="border-primary/40 bg-card shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-primary to-yellow-300" />
            <CardHeader className="text-center pt-8 pb-3">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Verify Your Email</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                We've sent a verification link to your inbox.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center pb-6">
              <div className="p-3 bg-secondary/60 rounded-md border border-border text-xs text-muted-foreground">
                Sent to: <strong className="text-foreground">{pendingVerificationEmail}</strong>
                <br />
                From: <span className="text-primary font-medium">enquiries@topreasonsco.com</span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Click the confirmation link inside the email to activate your account. If you don't see it within a couple of minutes, please check your spam or junk folder.
              </p>

              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleResendVerification(pendingVerificationEmail)}
                  disabled={isResending || resendCooldown > 0}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      Sending fresh link...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend email in ${resendCooldown}s`
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-0 border-t border-border pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  setPendingVerificationEmail(null);
                  handleTabChange("signin");
                }}
              >
                Already verified? Sign In
              </Button>
              <button
                type="button"
                onClick={() => setPendingVerificationEmail(null)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Use a different email address
              </button>
            </CardFooter>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>Sign in to access your account and manage your rentals.</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* UNCONFIRMED EMAIL NOTICE WITH 1-CLICK RESEND */}
                  {unconfirmedEmail && (
                    <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-md text-xs space-y-2">
                      <div className="flex items-start gap-2 text-amber-400">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong>Email Verification Required</strong>
                          <p className="text-muted-foreground mt-0.5">
                            Your account is not verified yet. Check your inbox for the link from enquiries@topreasonsco.com.
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs h-8"
                        onClick={() => handleResendVerification(unconfirmedEmail)}
                        disabled={isResending || resendCooldown > 0}
                      >
                        {isResending ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                            Sending link...
                          </>
                        ) : resendCooldown > 0 ? (
                          `Resend available in ${resendCooldown}s`
                        ) : (
                          "Resend Verification Email"
                        )}
                      </Button>
                    </div>
                  )}

                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input id="signin-email" name="email" type="email" placeholder="you@example.com" required />
                      {validationErrors.email && <p className="text-xs text-destructive">{validationErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input id="signin-password" name="password" type="password" placeholder="••••••••" required />
                      {validationErrors.password && <p className="text-xs text-destructive">{validationErrors.password}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <button type="button" onClick={() => setForgotPasswordOpen(true)} className="hover:text-primary transition-colors">
                    Forgot your password?
                  </button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Join Top Reasons and start your premium rental experience.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2 hidden">
                      <Label>I want to</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setUserType("customer")}
                          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${userType === "customer" ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}
                        >
                          <User className="w-6 h-6" />
                          <span className="text-sm font-medium">Rent</span>
                          <span className="text-xs text-muted-foreground">Browse & book rentals</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUserType("renter")}
                          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${userType === "renter" ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}
                        >
                          <Building2 className="w-6 h-6" />
                          <span className="text-sm font-medium">List</span>
                          <span className="text-xs text-muted-foreground">Become a rental agent</span>
                        </button>
                      </div>
                    </div>

                    {userType === "customer" ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Full Name</Label>
                          <Input id="signup-name" name="fullName" type="text" placeholder="John Doe" required />
                          {validationErrors.fullName && <p className="text-xs text-destructive">{validationErrors.fullName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input id="signup-email" name="email" type="email" placeholder="you@example.com" required />
                          {validationErrors.email && <p className="text-xs text-destructive">{validationErrors.email}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <Input id="signup-password" name="password" type="password" placeholder="••••••••" required onChange={(e) => checkPasswordStrength(e.target.value)} />
                          {validationErrors.password && <p className="text-xs text-destructive">{validationErrors.password}</p>}
                          <div className="text-xs text-muted-foreground mt-1">
                            Password must have: 8+ characters, uppercase, lowercase, number, special character
                          </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? "Creating account..." : "Sign Up"}
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <p className="text-sm"><strong>Become a Rental Agent</strong></p>
                          <p className="text-xs text-muted-foreground mt-1">
                            List your cars or apartments on Top Reasons. You'll need to provide business details and verification documents.
                          </p>
                        </div>
                        <Button type="submit" className="w-full">Continue to Agent Registration</Button>
                      </div>
                    )}
                  </form>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground text-center">
                  By signing up, you agree to our Terms of Service and Privacy Policy. A verification email will be sent to your address.
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>Enter your email address and we'll send you a link to reset your password.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <Input id="reset-email" type="email" placeholder="you@example.com" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
              </div>
              <Button onClick={handleForgotPassword} className="w-full" disabled={resetLoading}>
                {resetLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : "Send Reset Link"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={passwordUpdatedOpen} onOpenChange={setPasswordUpdatedOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Password Updated
              </DialogTitle>
              <DialogDescription>Your password has been successfully updated. You can now sign in with your new password.</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button onClick={() => { setPasswordUpdatedOpen(false); setIsPasswordRecovery(false); router.push("/"); }}>
                Continue to Home
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
