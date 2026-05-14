"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { BookOpen, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function Blog() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="relative py-24 px-4 overflow-hidden">
        <img src="/assets/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative z-10 container mx-auto text-center max-w-3xl">
          <div className="w-14 h-14 mx-auto mb-6 border border-primary/30 rounded-sm flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">
            Our <span className="text-primary">Blog</span>
          </h1>
          <p className="text-muted-foreground text-lg">Tips, guides, and stories about travelling across Ghana.</p>
        </div>
      </section>

      <section className="py-16 px-4 flex-1">
        <div className="container mx-auto max-w-5xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-sm p-6 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-card border border-border rounded-sm p-6 hover:border-primary/50 transition-colors group"
                >
                  {post.cover_image_url && (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-40 object-cover rounded-sm mb-4"
                    />
                  )}
                  <div className="flex items-center gap-2 text-xs text-primary uppercase tracking-widest mb-3">
                    <Calendar className="w-3 h-3" />
                    {post.published_at ? format(new Date(post.published_at), "MMM d, yyyy") : "Draft"}
                  </div>
                  <h2 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                  {post.excerpt && (
                    <p className="text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">By {post.author_name}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold uppercase tracking-tight mb-2">No Posts Yet</h3>
              <p className="text-muted-foreground">Check back soon for travel tips and guides about Ghana.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
