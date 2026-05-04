import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewsIndexPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("news_posts")
    .select("id,title,slug,thumbnail_url,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(12);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">News & Events</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Latest announcements and upcoming events.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(posts ?? []).map((p) => (
          <Link key={p.id} href={`/news/${p.slug}`} className="group">
            <Card className="h-full transition-colors group-hover:border-zinc-300 dark:group-hover:border-zinc-700">
              <CardHeader>
                <CardTitle className="line-clamp-2">{p.title}</CardTitle>
                <CardDescription>
                  {p.published_at ? new Date(p.published_at).toLocaleDateString() : "—"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {p.thumbnail_url ? (
                  <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.thumbnail_url}
                      alt=""
                      className="aspect-[16/10] w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-dashed border-zinc-200 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    No thumbnail
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}

