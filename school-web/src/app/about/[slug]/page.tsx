import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

type PageRow = {
  title: string;
  banner_image_url: string | null;
  content: unknown;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replaceAll("-", " "),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("pages")
    .select("title,banner_image_url,content,status,type")
    .eq("slug", slug)
    .maybeSingle();

  if (!data || data.type !== "about" || data.status !== "published") notFound();

  const row = data as unknown as PageRow;
  const html =
    typeof row.content === "object" && row.content && "html" in row.content
      ? String((row.content as any).html ?? "")
      : "";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16">
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {row.title}
      </h1>
      {row.banner_image_url ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={row.banner_image_url}
            alt=""
            className="h-56 w-full object-cover sm:h-72"
          />
        </div>
      ) : null}
      <div
        className="prose prose-zinc mt-8 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}

