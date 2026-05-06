import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { HOMEPAGE } from "@/data/content";

export function TestimonialSection() {
  const [active, setActive] = useState(0);
  const items = HOMEPAGE.testimonials;

  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <h2 className="section-title text-center mb-12">Testimonial</h2>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {items.map((t, i) => {
              const isActive = i === active;
              return (
                <motion.button
                  key={t.name}
                  onClick={() => setActive(i)}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.04 : 0.96,
                    opacity: isActive ? 1 : 0.7,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className={`text-left card p-6 cursor-pointer transition-shadow ${
                    isActive ? "shadow-glow ring-1 ring-brand-700/20" : "hover:shadow-soft"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <ImageSlot className="w-12 h-12" rounded="rounded-full" />
                    <div>
                      <p className="font-semibold text-ink-900 text-sm">{t.name}</p>
                      <p className="text-xs text-ink-500">{t.position}</p>
                    </div>
                    <Quote className="ml-auto h-5 w-5 text-brand-700/40" />
                  </div>
                  <p className="text-sm text-ink-500 leading-relaxed line-clamp-5">{t.quote}</p>
                  <p className="mt-4 text-xs text-ink-300">{t.date}</p>
                </motion.button>
              );
            })}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-8 bg-brand-700" : "w-2 bg-ink-300/40"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
