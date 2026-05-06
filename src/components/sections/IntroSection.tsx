import { motion } from "framer-motion";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { HOMEPAGE } from "@/data/content";

export function IntroSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <ImageSlot className="aspect-[4/3] w-full" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="eyebrow mb-3">{HOMEPAGE.intro.eyebrow}</p>
          <h2 className="section-title mb-6">{HOMEPAGE.intro.title}</h2>
          <p className="text-ink-500 leading-relaxed">{HOMEPAGE.intro.body}</p>
        </motion.div>
      </div>
    </section>
  );
}
