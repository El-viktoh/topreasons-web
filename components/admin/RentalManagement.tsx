"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { DollarSign, MapPin, Home } from "lucide-react";
import TagInput from "@/components/TagInput";
import MultiImageUpload from "@/components/MultiImageUpload";

const carFeatures = ["AC", "GPS", "Automatic", "Bluetooth", "Leather Seats", "Sunroof", "Backup Camera"];

export default function RentalManagement() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "", description: "", type: "BASIC", city: "", address: "",
    price_per_day: "", images: [] as string[], features: [] as string[], available: true,
  });

  useEffect(() => { fetchUserAndRentals(); }, []);

  const fetchUserAndRentals = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
    fetchRentals();
  };

  const fetchRentals = async () => {
    try {
      const { data, error } = await supabase.from("rentals").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setRentals(data || []);
    } catch { toast.error("Failed to load rentals"); } finally { setLoading(false); }
  };

  const resetForm = () => setFormData({ title: "", description: "", type: "BASIC", city: "", address: "", price_per_day: "", images: [], features: [], available: true });

  const handleEdit = (rental: any) => {
    setEditing(rental);
    const rawFeatures = rental.features || [];
    const categoryFeature = rawFeatures.find((f: string) => f.startsWith('category:'));
    const displayFeatures = rawFeatures.filter((f: string) => !f.startsWith('category:'));
    const category = categoryFeature ? categoryFeature.replace('category:', '') : (rental.type === 'car' ? 'BASIC' : rental.type);

    setFormData({
      title: rental.title || "", description: rental.description || "", type: category,
      city: rental.location?.split(",")[1]?.trim() || "", address: rental.location?.split(",")[0]?.trim() || "",
      price_per_day: rental.price_per_day?.toString() || "", images: rental.images || [],
      features: displayFeatures, available: rental.available ?? true,
    });
    setCreating(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.city || !formData.price_per_day) { toast.error("Please fill in all required fields"); return; }
    const location = `${formData.address || formData.city}, ${formData.city}`.replace(/^,\s*/, "");
    
    // We store the category in features to bypass the DB constraint 'car' | 'apartment'
    const featuresWithCategory = [...formData.features.filter((f: string) => !f.startsWith('category:')), `category:${formData.type}`];

    const rentalData = {
      title: formData.title, description: formData.description, type: 'car', location,
      price_per_day: parseFloat(formData.price_per_day), image_url: formData.images[0] || null,
      images: formData.images, features: featuresWithCategory, available: formData.available,
    };

    try {
      if (editing) {
        const { error } = await supabase.from("rentals").update(rentalData).eq("id", editing.id);
        if (error) throw error;
        toast.success("Rental updated successfully");
      } else {
        const { error } = await supabase.from("rentals").insert(rentalData);
        if (error) throw error;
        toast.success("Rental created successfully");
      }
      setEditing(null); setCreating(false); resetForm(); fetchRentals();
    } catch (error: any) { toast.error(error.message || "Failed to save rental"); }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("rentals").delete().eq("id", id);
      if (error) throw error;
      toast.success("Rental deleted successfully");
      fetchRentals();
    } catch { toast.error("Failed to delete rental"); }
  };

  if (loading) return <div className="text-center py-8">Loading rentals...</div>;

  if (creating || editing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Rental" : "Create New Rental"}</CardTitle>
          <CardDescription>{editing ? "Update the rental listing details" : "Add a new rental to the platform"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Basic Information</h3>
            </div>
            <Separator />
            <div>
              <Label>Title *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Mercedes S-Class or Toyota Land Cruiser 2023" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Offer Category *</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BASIC">Basic</SelectItem>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="SALOON PLUS">Saloon Plus</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                    <SelectItem value="PREMIUM SUV'S">Premium SUV's</SelectItem>
                    <SelectItem value="4X4's">4x4's</SelectItem>
                    <SelectItem value="VANS">Vans</SelectItem>
                    <SelectItem value="Buses and Coaches">Buses and Coaches</SelectItem>
                    <SelectItem value="MINI VANS">Mini Vans</SelectItem>
                    <SelectItem value="EV'S">EV's</SelectItem>
                    <SelectItem value="UNCATEGORIZED">Uncategorized</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>City *</Label>
                <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="e.g., Accra" />
              </div>
            </div>
            <div>
              <Label className="flex items-center gap-2"><MapPin className="w-3 h-3" />Address / Area</Label>
              <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="e.g., East Legon or Airport Road" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Details & Features</h3>
            <Separator />
            <div>
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the rental..." rows={4} />
            </div>
            <div>
              <Label>Features</Label>
              <TagInput value={formData.features} onChange={(features) => setFormData({ ...formData, features })} placeholder="Type a feature and press Enter" maxTags={10} suggestions={carFeatures} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Pricing & Availability</h3>
            </div>
            <Separator />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Price Per Day *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">GHS</span>
                  <Input type="number" step="0.01" value={formData.price_per_day} onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })} placeholder="0.00" className="pl-12" />
                </div>
              </div>
              <div>
                <Label>Availability Status</Label>
                <Select value={formData.available ? "true" : "false"} onValueChange={(v) => setFormData({ ...formData, available: v === "true" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" />Available</div></SelectItem>
                    <SelectItem value="false"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" />Unavailable</div></SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Images (up to 5)</h3>
            <Separator />
            <MultiImageUpload bucket="rental-images" folder={userId || undefined} images={formData.images} onImagesChange={(images) => setFormData({ ...formData, images })} maxImages={5} maxSizeMB={5} />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} className="flex-1">{editing ? "Update Rental" : "Create Rental"}</Button>
            <Button type="button" variant="secondary" onClick={() => { setEditing(null); setCreating(false); resetForm(); }}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Manage Rentals</h2>
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="BASIC">Basic</SelectItem>
              <SelectItem value="STANDARD">Standard</SelectItem>
              <SelectItem value="SALOON PLUS">Saloon Plus</SelectItem>
              <SelectItem value="PREMIUM">Premium</SelectItem>
              <SelectItem value="PREMIUM SUV'S">Premium SUV's</SelectItem>
              <SelectItem value="4X4's">4x4's</SelectItem>
              <SelectItem value="VANS">Vans</SelectItem>
              <SelectItem value="Buses and Coaches">Buses and Coaches</SelectItem>
              <SelectItem value="MINI VANS">Mini Vans</SelectItem>
              <SelectItem value="EV'S">EV's</SelectItem>
              <SelectItem value="UNCATEGORIZED">Uncategorized</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setCreating(true)}>Add New Rental</Button>
        </div>
      </div>
      <div className="grid gap-4">
        {rentals.filter(rental => {
          if (categoryFilter === "ALL") return true;
          const category = rental.features?.find((f: string) => f.startsWith('category:'))?.replace('category:', '') || rental.type;
          return category === categoryFilter;
        }).map((rental) => (
          <Card key={rental.id}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <img src={rental.image_url} alt={rental.title} className="w-32 h-32 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold">{rental.title}</h3>
                      <p className="text-muted-foreground">{rental.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={rental.available ? "default" : "secondary"}>{rental.available ? "Available" : "Unavailable"}</Badge>
                      <Badge variant="outline">{rental.features?.find((f: string) => f.startsWith('category:'))?.replace('category:', '') || rental.type}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rental.description}</p>
                  <p className="text-lg font-bold mb-4">GHS {rental.price_per_day}/day</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(rental)}>Edit</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Rental</AlertDialogTitle>
                          <AlertDialogDescription>Are you sure you want to delete this rental? This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(rental.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
