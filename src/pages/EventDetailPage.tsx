import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { cms } from '@/cms/api';
import type { EventPost } from '@/cms/api';

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventPost | null>(null);
  const [related, setRelated] = useState<EventPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    void (async () => {
      try {
        const all = await cms.listEvents({ status: 'published' });
        const found = all.find((e) => e.slug === slug) ?? null;
        setEvent(found);
        setRelated(all.filter((e) => e.id !== found?.id).slice(0, 3));

        // Apply SEO
        if (found) {
          document.title = `${found.seo.metaTitle || found.title} | Norol Iman High School`;
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="container-page py-32 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-brand-700 border-t-transparent" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container-page py-32 text-center">
        <p className="eyebrow text-brand-700">Not found</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink-900">Event not found</h1>
        <Link to="/events" className="btn-primary mt-6 inline-flex">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="py-12 sm:py-16">
        <div className="container-page grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10">
          <article>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 mb-3">
              {event.title}
            </h1>
            <div className="text-xs text-ink-500 border-t border-b border-ink-300/20 py-2 mb-6 flex flex-wrap gap-4">
              {event.eventDate && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {new Date(event.eventDate).toLocaleDateString()}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Tag className="h-3 w-3" /> {event.category}
              </span>
            </div>

            {event.excerpt && (
              <p className="text-base text-ink-700 leading-relaxed mb-6">{event.excerpt}</p>
            )}

            {event.coverImage?.url ? (
              <img
                src={event.coverImage.url}
                alt={event.coverImage.alt}
                className="aspect-[16/10] w-full rounded-2xl object-cover mb-6"
              />
            ) : (
              <ImageSlot className="aspect-[16/10] w-full mb-6" />
            )}

            <div
              className="prose prose-ink max-w-none prose-headings:font-display prose-a:text-brand-700"
              dangerouslySetInnerHTML={{ __html: event.body }}
            />

            {event.gallery.length > 0 && (
              <>
                <h2 className="section-title mt-10 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {event.gallery.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={img.alt}
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              </>
            )}

            {event.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {related.length > 0 && (
            <aside>
              <h3 className="font-display text-lg font-bold text-ink-900 mb-4">Related events</h3>
              <div className="space-y-3">
                {related.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/events/${r.slug}`} className="card p-4 flex gap-3 hover:border-brand-700">
                      {r.coverImage?.url ? (
                        <img
                          src={r.coverImage.url}
                          alt={r.coverImage.alt}
                          className="w-20 h-20 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <ImageSlot className="w-20 h-20 shrink-0" rounded="rounded-lg" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-display font-bold text-sm text-ink-900 line-clamp-2">{r.title}</p>
                        <p className="text-xs text-ink-500 mt-1">
                          {r.eventDate ? new Date(r.eventDate).toLocaleDateString() : ''}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-brand-700">
                          Read more <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </aside>
          )}
        </div>
      </section>
    </>
  );
}
