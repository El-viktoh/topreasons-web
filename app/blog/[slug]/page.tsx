"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="py-16 px-4 flex-1">
        <div className="container mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : post ? (
            <article>
              {post.cover_image_url && (
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-sm mb-8"
                />
              )}
              <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 border-b border-border pb-6">
                <span>By {post.author_name}</span>
                {post.published_at && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(post.published_at), "MMMM d, yyyy")}
                  </span>
                )}
              </div>
              <div
                className="prose prose-invert max-w-none text-foreground leading-relaxed [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_img]:rounded-sm [&_img]:my-4 [&_img]:max-w-full [&_a]:text-primary [&_a]:underline [&_hr]:border-border [&_hr]:my-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">Post Not Found</h2>
              <p className="text-muted-foreground mb-6">This blog post doesn't exist or has been removed.</p>
              <Link href="/blog" className="text-primary hover:underline">Back to Blog</Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
