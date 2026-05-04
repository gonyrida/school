import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.replaceAll("-", " ") };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("news_posts")
    .select("title,thumbnail_url,content,published_at,status")
    .eq("slug", slug)
    .maybeSingle();

  if (!data || data.status !== "published") notFound();

  const html =
    typeof data.content === "object" && data.content && "html" in data.content
      ? String((data.content as any).html ?? "")
      : "";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {data.published_at ? new Date(data.published_at).toLocaleDateString() : "—"}
      </p>
      <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {data.title}
      </h1>
      {data.thumbnail_url ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.thumbnail_url} alt="" className="aspect-[16/9] w-full object-cover" />
        </div>
      ) : null}
      <div
        className="prose prose-zinc mt-10 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}

