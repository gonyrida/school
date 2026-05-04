import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  return {
    title: `Curriculum · ${type.replaceAll("-", " ")}`,
  };
}

export default async function CurriculumPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("curriculum_pages")
    .select("title,description,subjects,approach,timetable,images,pdfs")
    .eq("type", type)
    .maybeSingle();

  if (!data) notFound();

  const html =
    typeof data.description === "object" && data.description && "html" in data.description
      ? String((data.description as any).html ?? "")
      : "";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {data.title}
      </h1>
      <div
        className="prose prose-zinc mt-8 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}

