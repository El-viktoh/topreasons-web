"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import MultiImageUpload from "@/components/MultiImageUpload";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [frontIdImages, setFrontIdImages] = useState<string[]>([]);
  const [backIdImages, setBackIdImages] = useState<string[]>([]);

  useEffect(() => {
    checkUserAndProfile();
  }, []);

  const checkUserAndProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to view your profile");
        router.push("/auth");
        return;
      }
      setUser(user);

      // Fetch profile
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || "");
        if ((profileData as any).id_card_front_url) setFrontIdImages([(profileData as any).id_card_front_url]);
        if ((profileData as any).id_card_back_url) setBackIdImages([(profileData as any).id_card_back_url]);
      }
    } catch (error: any) {
      toast.error("Failed to load profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updates = {
        full_name: fullName,
        id_card_front_url: frontIdImages.length > 0 ? frontIdImages[0] : null,
        id_card_back_url: backIdImages.length > 0 ? backIdImages[0] : null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates as any)
        .eq("id", user.id);

      if (error) {
        // Handle case where column might not exist yet (if user hasn't run the SQL snippet)
        if (error.code === '42703') {
          throw new Error("Database schema is missing ID card columns. Please run the SQL migration snippet in your Supabase dashboard.");
        }
        throw error;
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  const isIdVerified = frontIdImages.length > 0 && backIdImages.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your personal information and verification documents.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Identity Verification
                    {isIdVerified ? (
                      <ShieldCheck className="w-5 h-5 text-success" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-warning" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    Required for Self-Drive rentals. Upload your valid ID card or Driver's License.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isIdVerified && (
                <div className="bg-warning/10 border border-warning/20 text-warning p-4 rounded-md text-sm flex gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>
                    <strong>Action Required:</strong> You must upload the front and back of your ID card to book Self-Drive rentals.
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Front of ID</Label>
                  <p className="text-xs text-muted-foreground">Upload a clear photo of the front of your ID card.</p>
                  <MultiImageUpload
                    bucket="rental-images"
                    folder={`id-cards/${user?.id}`}
                    images={frontIdImages}
                    onImagesChange={setFrontIdImages}
                    maxImages={1}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Back of ID</Label>
                  <p className="text-xs text-muted-foreground">Upload a clear photo of the back of your ID card.</p>
                  <MultiImageUpload
                    bucket="rental-images"
                    folder={`id-cards/${user?.id}`}
                    images={backIdImages}
                    onImagesChange={setBackIdImages}
                    maxImages={1}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 border-t flex justify-between items-center py-4">
              <p className="text-xs text-muted-foreground">
                Your documents are securely stored and encrypted.
              </p>
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
