import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { HOMEPAGE } from "@/data/content";

export function EducationPathway() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="text-center mb-10">
          <h2 className="section-title">Education Pathway</h2>
          <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-accent-green" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {HOMEPAGE.pathways.map((p, idx) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="card p-5 hover:shadow-glow transition-shadow group"
            >
              <ImageSlot className="aspect-[4/3] w-full mb-5" rounded="rounded-xl" />
              <h3 className="font-display font-bold text-lg text-ink-900 mb-1">{p.title}</h3>
              <p className="text-sm font-semibold text-accent-green mb-3">{p.ageRange}</p>
              <p className="text-sm text-ink-500 line-clamp-2 mb-5">{p.description}</p>
              <Link to={p.href} className="btn-primary w-full !py-2.5 text-sm">
                View Curriculum
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
