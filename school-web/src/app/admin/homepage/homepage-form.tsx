"use client";

import * as React from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type HomepageContent = {
  hero_title: string | null;
  hero_description: string | null;
  hero_image_url: string | null;
  principal_name: string | null;
  principal_title: string | null;
  principal_message: string | null;
};

export function HomepageForm({ initial }: { initial: HomepageContent }) {
  const [saving, setSaving] = React.useState(false);
  const [state, setState] = React.useState<HomepageContent>(initial);

  async function save() {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("homepage_content")
        .upsert({ id: 1, ...state }, { onConflict: "id" });

      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Homepage updated");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Hero</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Edit the headline and supporting text. Image upload will be added next.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Hero title</label>
            <Input
              value={state.hero_title ?? ""}
              onChange={(e) => setState((s) => ({ ...s, hero_title: e.target.value }))}
              placeholder="Inspire future leaders."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Hero image URL</label>
            <Input
              value={state.hero_image_url ?? ""}
              onChange={(e) => setState((s) => ({ ...s, hero_image_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Hero description</label>
          <Textarea
            value={state.hero_description ?? ""}
            onChange={(e) => setState((s) => ({ ...s, hero_description: e.target.value }))}
            placeholder="Short description that appears under the hero title."
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Principal message</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Displayed on the homepage as a featured section.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={state.principal_name ?? ""}
              onChange={(e) => setState((s) => ({ ...s, principal_name: e.target.value }))}
              placeholder="Dr. Jane Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={state.principal_title ?? ""}
              onChange={(e) => setState((s) => ({ ...s, principal_title: e.target.value }))}
              placeholder="Principal"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Message</label>
          <Textarea
            value={state.principal_message ?? ""}
            onChange={(e) => setState((s) => ({ ...s, principal_message: e.target.value }))}
            placeholder="Write a short welcome message..."
          />
        </div>
      </section>

      <div className="flex items-center justify-end gap-2">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

