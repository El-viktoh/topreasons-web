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
import { ArrowLeft, User, Building2, Loader2, CheckCircle, XCircle } from "lucide-react";
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
  const [newPassword, setNewPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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

    return () => subscription.unsubscribe();
  }, []);

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
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
      if (error) throw error;
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: fullName },
        },
      });
      if (error) throw error;
      toast.success("Account created successfully!");
      router.push("/");
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
          <img src="/assets/logo.png" alt="Top Reasons" className="h-10" />
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
        ) : (
          <Tabs defaultValue="signin" className="w-full">
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
                  By signing up, you agree to our Terms of Service and Privacy Policy.
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
