import { motion } from "framer-motion";
import { Eye, Target, Heart } from "lucide-react";
import { HOMEPAGE } from "@/data/content";

const ICONS = [Eye, Target, Heart];

export function VisionMissionValues() {
  return (
    <section className="py-16 sm:py-24 bg-surface-muted">
      <div className="container-page">
        <h2 className="section-title text-center mb-12">Vision, Mission, and Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {HOMEPAGE.values.map((v, idx) => {
            const Icon = ICONS[idx];
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-soft">
                  <Icon className="h-7 w-7 text-brand-700" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-900 mb-3">{v.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed max-w-xs mx-auto">{v.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
