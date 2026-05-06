import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { PageHero } from '@/components/ui/PageHero';
import { cms } from '@/cms/api';
import type { EventPost } from '@/cms/api';
import { useCmsPage } from '@/hooks/useCmsPage';

const CATEGORIES = ['All', 'Academy', 'Sports', 'Arts', 'Community'] as const;

export default function EventsPage() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>('All');
  const [query, setQuery] = useState('');
  const [events, setEvents] = useState<EventPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Page-level header content (eyebrow/title/etc.) is still admin-managed
  // through the "events" page in the CMS, but the listing itself is dynamic.
  const { page } = useCmsPage('events');

  useEffect(() => {
    void (async () => {
      try {
        const list = await cms.listEvents({ status: 'published' });
        setEvents(list);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchCat = active === 'All' || e.category === active;
      const matchQ = !query || e.title.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [events, active, query]);

  const heroTitle =
    page?.sections.find((s) => s.type === 'hero')?.data?.title ?? 'News & Events';
  const heroSubtitle =
    page?.sections.find((s) => s.type === 'hero')?.data?.subtitle ??
    'Latest news, upcoming events, and community highlights from our school.';

  return (
    <>
      <PageHero title={heroTitle as string} subtitle={heroSubtitle as string} />

      <section className="py-12">
        <div className="container-page">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="font-display text-2xl font-bold text-ink-900">All events</h2>
            <div className="relative w-full sm:w-auto sm:min-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full rounded-full bg-surface-muted border-0 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/30"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`chip ${active === c ? 'chip-active' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card p-5 h-40 animate-pulse bg-surface-soft" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-ink-500">No events match your filters.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((evt, idx) => (
                <motion.article
                  key={evt.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (idx % 4) * 0.05 }}
                  className="card p-5 grid grid-cols-[1fr_auto] gap-5 relative"
                >
                  <div className="flex flex-col">
                    <h3 className="font-display font-bold text-lg text-ink-900 mb-1.5">{evt.title}</h3>
                    <p className="text-xs text-ink-500 mb-2">
                      {evt.eventDate ? new Date(evt.eventDate).toLocaleDateString() : '—'} · {evt.category}
                    </p>
                    <p className="text-sm text-ink-500 line-clamp-2 mb-4">{evt.excerpt}</p>
                    <div className="mt-auto">
                      <Link
                        to={`/events/${evt.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:gap-2 transition-all"
                      >
                        Read more <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  {evt.coverImage?.url ? (
                    <img
                      src={evt.coverImage.url}
                      alt={evt.coverImage.alt}
                      className="w-32 h-32 sm:w-36 sm:h-36 rounded-lg object-cover"
                    />
                  ) : (
                    <ImageSlot className="w-32 h-32 sm:w-36 sm:h-36" rounded="rounded-lg" />
                  )}
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
