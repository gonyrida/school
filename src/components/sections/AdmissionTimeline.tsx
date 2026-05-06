import { motion } from "framer-motion";
import { HOMEPAGE } from "@/data/content";

export function AdmissionTimeline() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <h2 className="section-title text-center mb-12">Admission Step By Step</h2>
        <div className="relative max-w-3xl mx-auto">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-700/30" aria-hidden />
          <div className="space-y-10 sm:space-y-12">
            {HOMEPAGE.admissionSteps.map((s, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <motion.div
                  key={s.title + idx}
                  initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start relative"
                >
                  <div className={isLeft ? "sm:pr-10" : "sm:order-2 sm:pl-10"}>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-full bg-brand-700 text-white font-bold flex items-center justify-center text-sm shadow-glow">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-ink-900 mb-1">{s.title}</h3>
                        <p className="text-sm text-ink-500 leading-relaxed">{s.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className={isLeft ? "hidden sm:block" : "hidden sm:block sm:order-1"} aria-hidden />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
