export default function Home() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
        <div className="flex flex-col items-start gap-6">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Premium School Website + Admin CMS
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Build a modern, database-driven school website.
          </h1>
          <p className="max-w-2xl text-pretty text-base text-zinc-600 dark:text-zinc-300 sm:text-lg">
            Next.js 15, Tailwind, Supabase Auth/DB/Storage — with an admin dashboard that
            lets non-technical staff manage everything.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90"
              href="/"
            >
              Explore site
            </a>
            <a
              className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              href="/admin"
            >
              Admin login
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="space-y-2">
              <p className="text-base font-semibold">Dynamic content</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                All public pages are database-driven.
              </p>
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
              Update homepage, about pages, curriculum, news/events, admissions, and more —
              without touching code.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="space-y-2">
              <p className="text-base font-semibold">Secure admin</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Auth + RLS protected data.
              </p>
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
              Admins sign in via Supabase Authentication, with role-based permissions and
              protected routes.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="space-y-2">
              <p className="text-base font-semibold">Media & files</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Images + PDFs in Supabase Storage.
              </p>
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
              Upload hero banners, galleries, thumbnails, downloadable forms, and curriculum
              PDFs.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
