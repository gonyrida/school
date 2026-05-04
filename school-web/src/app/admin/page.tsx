import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Welcome{user?.email ? `, ${user.email}` : ""}. Manage content and settings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Homepage, pages, curriculum, admissions.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600 dark:text-zinc-300">
            This will show quick stats once database tables are connected.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>News</CardTitle>
            <CardDescription>Drafts, published posts, categories.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600 dark:text-zinc-300">
            We’ll add recent activity and publishing workflow next.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
            <CardDescription>Images, PDFs, gallery albums.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600 dark:text-zinc-300">
            Storage buckets and file manager will live here.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

