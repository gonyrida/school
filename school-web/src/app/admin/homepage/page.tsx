import { createClient } from "@/lib/supabase/server";
import { HomepageForm } from "@/app/admin/homepage/homepage-form";

export default async function AdminHomepageModule() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("homepage_content")
    .select(
      "hero_title,hero_description,hero_image_url,principal_name,principal_title,principal_message"
    )
    .eq("id", 1)
    .maybeSingle();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Homepage</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage homepage sections. This module writes to `homepage_content` in Supabase.
        </p>
      </div>

      <HomepageForm
        initial={{
          hero_title: data?.hero_title ?? null,
          hero_description: data?.hero_description ?? null,
          hero_image_url: data?.hero_image_url ?? null,
          principal_name: data?.principal_name ?? null,
          principal_title: data?.principal_title ?? null,
          principal_message: data?.principal_message ?? null,
        }}
      />
    </div>
  );
}

