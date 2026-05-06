import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Calendar, Image as ImageIcon, Plus, Edit3, ArrowUpRight, CircleCheck, CircleAlert } from 'lucide-react';
import { cms } from '@/cms/api';
import type { Page } from '@/cms/schema/sections';
import type { EventPost, MediaItem } from '@/cms/api';
import { Skeleton } from '@/cms/admin/components/Skeleton';

interface OverviewData {
  pages: Page[];
  events: EventPost[];
  media: MediaItem[];
}

export default function OverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const [pages, events, media] = await Promise.all([
          cms.listPages(),
          cms.listEvents(),
          cms.listMedia(),
        ]);
        setData({ pages, events, media });
      } catch {
        // Silently fail — overview is best-effort
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const publishedPages = data?.pages.filter((p) => p.status === 'published').length ?? 0;
  const draftPages = data?.pages.filter((p) => p.status === 'draft').length ?? 0;
  const publishedEvents = data?.events.filter((e) => e.status === 'published').length ?? 0;

  const recentEvents = data?.events.slice(0, 4) ?? [];
  const recentlyEditedPages =
    data?.pages
      .slice()
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 5) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Welcome back</h1>
          <p className="text-sm text-ink-500">Here's what's happening across your site</p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/pages" className="btn-ghost !py-2 text-sm">
            <Edit3 className="h-4 w-4" /> Edit pages
          </Link>
          <Link to="/dashboard/events/new" className="btn-primary !py-2 text-sm">
            <Plus className="h-4 w-4" /> New event
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <StatCard
              icon={FileText}
              label="Total pages"
              value={data?.pages.length ?? 0}
              hint={`${publishedPages} published · ${draftPages} drafts`}
              to="/dashboard/pages"
            />
            <StatCard
              icon={Calendar}
              label="News & events"
              value={data?.events.length ?? 0}
              hint={`${publishedEvents} published`}
              to="/dashboard/events"
            />
            <StatCard
              icon={ImageIcon}
              label="Media files"
              value={data?.media.length ?? 0}
              hint="Across all folders"
              to="/dashboard/media"
            />
            <StatCard
              icon={CircleCheck}
              label="Published pages"
              value={publishedPages}
              hint={`${data?.pages.length ? Math.round((publishedPages / data.pages.length) * 100) : 0}% of pages live`}
              to="/dashboard/pages"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink-900">Recently edited pages</h2>
            <Link to="/dashboard/pages" className="text-sm font-medium text-brand-700 hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              {recentlyEditedPages.map((p) => (
                <Link
                  key={p.key}
                  to={`/dashboard/pages/${encodeURIComponent(p.key)}`}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-surface-soft"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">{p.title}</p>
                    <p className="text-xs text-ink-500">
                      {p.sections.length} sections · {new Date(p.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink-900">Recent events</h2>
            <Link to="/dashboard/events" className="text-sm font-medium text-brand-700 hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-ink-500">
              <CircleAlert className="h-8 w-8 text-ink-300" />
              <p className="mt-2 text-sm">No events yet</p>
              <Link to="/dashboard/events/new" className="btn-primary mt-3 !py-1.5 text-xs">
                Create first event
              </Link>
            </div>
          ) : (
            <div className="space-y-1.5">
              {recentEvents.map((e) => (
                <Link
                  key={e.id}
                  to={`/dashboard/events/${e.id}`}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-surface-soft"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">{e.title}</p>
                    <p className="text-xs text-ink-500">
                      {e.category} · {e.eventDate ? new Date(e.eventDate).toLocaleDateString() : 'no date'}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      e.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {e.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  to,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  value: number;
  hint: string;
  to: string;
}) {
  return (
    <Link to={to} className="card group p-5 hover:border-brand-700">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-ink-300 group-hover:text-brand-700" />
      </div>
      <p className="mt-4 font-display text-3xl font-bold text-ink-900">{value}</p>
      <p className="mt-0.5 text-sm font-semibold text-ink-700">{label}</p>
      <p className="mt-1 text-xs text-ink-500">{hint}</p>
    </Link>
  );
}
