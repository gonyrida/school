import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { EVENTS } from "@/data/content";

const CATEGORIES = ["All", "Academy", "Sports", "Arts", "Community"];

export function EventsSection() {
  const [active, setActive] = useState("All");
  const filtered = useMemo(
    () => (active === "All" ? EVENTS : EVENTS.filter((e) => e.category === active)),
    [active]
  );

  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="section-title">Event &amp; Achievement</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`chip ${active === c ? "chip-active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.slice(0, 3).map((evt, idx) => (
            <motion.article
              key={evt.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.07 }}
              className="card p-4 sm:p-5 grid grid-cols-[1fr_auto] gap-5 relative"
            >
              {evt.isNews && (
                <div className="absolute top-3 right-3 rotate-12 bg-brand-700 text-white text-[10px] font-bold tracking-widest px-2 py-0.5 rounded">
                  NEWS
                </div>
              )}
              <div className="flex flex-col">
                <h3 className="font-display font-bold text-lg text-ink-900 mb-1.5">{evt.title}</h3>
                <p className="text-xs text-ink-500 mb-2">
                  {new Date(evt.date).toLocaleDateString()} · {evt.location}
                </p>
                <p className="text-sm text-ink-500 line-clamp-2 mb-4">{evt.excerpt}</p>
                <div className="mt-auto">
                  <Link
                    to={`/events/${evt.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:gap-2 transition-all"
                  >
                    View More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <ImageSlot className="w-32 h-32 sm:w-36 sm:h-36" rounded="rounded-lg" />
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/events" className="btn-primary">
            View More
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
