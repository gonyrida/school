import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Trash2, Edit3, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { cms } from '@/cms/api';
import type { EventPost } from '@/cms/api';
import { Breadcrumbs } from '@/cms/admin/components/Breadcrumbs';
import { SkeletonStack } from '@/cms/admin/components/Skeleton';
import { ConfirmDialog } from '@/cms/admin/components/ConfirmDialog';

const PAGE_SIZE = 10;

export default function EventsListPage() {
  const [events, setEvents] = useState<EventPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<'' | 'draft' | 'published'>('');
  const [page, setPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await cms.listEvents({
        category: category || undefined,
        status: status || undefined,
        search: search || undefined,
      });
      setEvents(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, status]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      void refresh();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return events.slice(start, start + PAGE_SIZE);
  }, [events, page]);

  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await cms.deleteEvent(confirmDeleteId);
      toast.success('Event deleted');
      setConfirmDeleteId(null);
      void refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'News & Events' }]} />
          <h1 className="mt-2 font-display text-2xl font-bold text-ink-900">News & Events</h1>
          <p className="text-sm text-ink-500">Create and manage news posts and events</p>
        </div>
        <Link to="/dashboard/events/new" className="btn-primary !py-2.5">
          <Plus className="h-4 w-4" /> New event
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field !w-auto"
        >
          <option value="">All categories</option>
          <option value="Academy">Academy</option>
          <option value="Sports">Sports</option>
          <option value="Arts">Arts</option>
          <option value="Community">Community</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="input-field !w-auto"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonStack count={6} className="h-16" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-300/20 bg-white">
          <table className="w-full">
            <thead className="bg-surface-soft text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-5 py-3 text-left">Title</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Event date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-300/10 text-sm">
              {paginated.map((e) => (
                <tr key={e.id} className="hover:bg-surface-soft/50">
                  <td className="px-5 py-3">
                    <Link
                      to={`/dashboard/events/${e.id}`}
                      className="flex items-center gap-3 font-semibold text-ink-900 hover:text-brand-700"
                    >
                      {e.coverImage?.url && (
                        <img
                          src={e.coverImage.url}
                          alt=""
                          className="h-10 w-14 rounded-md object-cover"
                        />
                      )}
                      <div>
                        <p>{e.title}</p>
                        {e.excerpt && (
                          <p className="mt-0.5 text-xs font-normal text-ink-500 truncate max-w-md">
                            {e.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-ink-500">{e.category}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        e.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {e.eventDate ? new Date(e.eventDate).toLocaleDateString() : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/dashboard/events/${e.id}`}
                        className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setConfirmDeleteId(e.id)}
                        className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-ink-500">
                    No events match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-500">
            Page {page} of {totalPages} • {events.length} total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost !py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-ghost !py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete this event?"
        description="This will permanently remove the event and its content."
        confirmLabel="Delete"
        confirmVariant="danger"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
