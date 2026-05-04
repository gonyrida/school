import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-1">
      <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:flex">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-sm font-semibold">
            Admin CMS
          </Link>
        </div>
        <nav className="mt-6 flex flex-col gap-1">
          <Link className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" href="/admin">
            Overview
          </Link>
          <Link className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" href="/admin/homepage">
            Homepage
          </Link>
          <Link className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" href="/admin/about">
            About
          </Link>
          <Link className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" href="/admin/curriculum">
            Curriculum
          </Link>
          <Link className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" href="/admin/news">
            News & Events
          </Link>
          <Link className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" href="/admin/admissions">
            Admissions
          </Link>
          <Link className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" href="/admin/gallery">
            Gallery
          </Link>
          <Link className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" href="/admin/settings">
            Settings
          </Link>
        </nav>
        <div className="mt-auto pt-4">
          <Button variant="outline" asChild className="w-full">
            <Link href="/">View site</Link>
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/admin" className="text-sm font-semibold">
              Admin CMS
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <AdminUserMenu />
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}

