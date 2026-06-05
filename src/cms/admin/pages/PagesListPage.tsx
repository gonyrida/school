import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, FilePenLine, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { cms } from '@/cms/api';
import type { Page } from '@/cms/schema/sections';
import { Breadcrumbs } from '@/cms/admin/components/Breadcrumbs';
import { SkeletonStack } from '@/cms/admin/components/Skeleton';

export default function PagesListPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        const data = await cms.listPages();
        setPages(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load pages');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = pages.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Pages' }]} />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900">Pages</h1>
            <p className="text-sm text-ink-500">Manage every page on your website</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search pages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="input-field !w-auto"
        >
          <option value="all">All statuses</option>
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
                <th className="px-5 py-3 text-left">Page</th>
                <th className="px-5 py-3 text-left">Route</th>
                <th className="px-5 py-3 text-left">Sections</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Last updated</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-300/10 text-sm">
              {filtered.map((p) => (
                <tr key={p.key} className="hover:bg-surface-soft/50">
                  <td className="px-5 py-3">
                    <Link
                      to={`/dashboard/pages/${encodeURIComponent(p.key)}`}
                      className="font-semibold text-ink-900 hover:text-brand-700"
                    >
                      {p.title}
                    </Link>
                    {p.description && (
                      <p className="mt-0.5 text-xs text-ink-500 truncate max-w-md">{p.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-500">{p.seo.slug || '/' + p.key}</td>
                  <td className="px-5 py-3 text-ink-500">
                    {p.sections.length} section{p.sections.length === 1 ? '' : 's'}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        p.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={p.seo.slug || `/${p.key}`}
                        target="_blank"
                        className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                        title="View live"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/dashboard/pages/${encodeURIComponent(p.key)}`}
                        className="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-800"
                      >
                        <FilePenLine className="mr-1 inline h-3 w-3" /> Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-ink-500">
                    No pages match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
