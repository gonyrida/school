import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { HOMEPAGE } from "@/data/content";

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <h2 className="section-title text-center mb-10">Title Of The School</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {HOMEPAGE.features.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group"
            >
              <ImageSlot className="aspect-[4/3] w-full mb-5" rounded="rounded-2xl" />
              <h3 className="font-display font-bold text-lg text-ink-900 mb-2">{f.title}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/about/dormitory" className="btn-primary">
            Explore Our Dormitory <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
