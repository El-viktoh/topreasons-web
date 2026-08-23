"use client";

import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, X } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "./RichTextEditor";

interface BlogFormData {
  title: string; slug: string; excerpt: string; content: string;
  cover_image_url: string; author_name: string; published: boolean;
}

const emptyForm: BlogFormData = { title: "", slug: "", excerpt: "", content: "", cover_image_url: "", author_name: "Top Reasons", published: false };

export default function BlogManagement() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogFormData>(emptyForm);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const payload = { ...data, published_at: data.published ? new Date().toISOString() : null };
      if (editingId) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success(editingId ? "Post updated" : "Post created");
      setDialogOpen(false); resetForm();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] }); toast.success("Post deleted"); },
    onError: (err: any) => toast.error(err.message),
  });

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };
  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt || "", content: post.content, cover_image_url: post.cover_image_url || "", author_name: post.author_name, published: post.published });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) { toast.error("Title and content are required"); return; }
    saveMutation.mutate({ ...form, slug: form.slug || generateSlug(form.title) });
  };

  const handleCoverUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    const ext = file.name.split(".").pop();
    const path = `covers/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file, { contentType: file.type });
    if (error) { toast.error("Failed to upload cover image"); setCoverUploading(false); return; }
    const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(path);
    setForm((prev) => ({ ...prev, cover_image_url: urlData.publicUrl }));
    toast.success("Cover image uploaded");
    setCoverUploading(false);
    e.target.value = "";
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold uppercase tracking-tight">Blog Posts</h2>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Posts</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Drafts</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground rounded-sm">
              <Plus className="w-4 h-4 mr-2" />New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="uppercase tracking-tight">{editingId ? "Edit Post" : "New Post"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })} className="rounded-sm text-lg font-bold border-0 border-b border-border px-0 focus-visible:ring-0" placeholder="Your post title..." />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-sm text-sm" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Cover Image</Label>
                {form.cover_image_url ? (
                  <div className="relative mt-2">
                    <img src={form.cover_image_url} alt="Cover" className="w-full h-48 object-cover rounded-sm" />
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/80 h-8 w-8" onClick={() => setForm({ ...form, cover_image_url: "" })}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="mt-2 border-2 border-dashed border-border rounded-sm p-8 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => coverInputRef.current?.click()}>
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">{coverUploading ? "Uploading..." : "Click to upload cover image"}</p>
                  </div>
                )}
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Excerpt</Label>
                <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="rounded-sm" placeholder="A brief summary of your post..." />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Content</Label>
                <RichTextEditor content={form.content} onChange={(html) => setForm((prev) => ({ ...prev, content: html }))} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Author</Label>
                  <Input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className="rounded-sm" />
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <Switch checked={form.published} onCheckedChange={(checked) => setForm({ ...form, published: checked })} />
                  <Label className="text-sm">{form.published ? "Published" : "Draft"}</Label>
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground rounded-sm" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editingId ? "Update Post" : "Publish Post"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-3">
          {posts.filter(post => statusFilter === "ALL" || (statusFilter === "PUBLISHED" ? post.published : !post.published)).map((post) => (
            <div key={post.id} className="bg-card border border-border rounded-sm p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {post.cover_image_url && <img src={post.cover_image_url} alt="" className="w-16 h-12 object-cover rounded-sm shrink-0" />}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {post.published ? <Eye className="w-4 h-4 text-primary shrink-0" /> : <EyeOff className="w-4 h-4 text-muted-foreground shrink-0" />}
                    <h3 className="font-bold truncate">{post.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">/{post.slug} · {post.author_name}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}><Edit className="w-4 h-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                      <AlertDialogDescription>Are you sure you want to delete this post? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(post.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">No blog posts yet. Create your first one!</p>
      )}
    </div>
  );
}
