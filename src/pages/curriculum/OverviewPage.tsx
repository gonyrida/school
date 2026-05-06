import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PageHero } from "@/components/ui/PageHero";
import { HOMEPAGE, CURRICULUM_SUBJECTS } from "@/data/content";

function SubjectGrid({ items, bg }: { items: string[]; bg: "muted" | "white" }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${bg === "muted" ? "" : ""}`}>
      {items.map((s, i) => (
        <motion.div
          key={s + i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: (i % 6) * 0.05 }}
          className="card p-5 flex items-center gap-4"
        >
          <ImageSlot className="w-10 h-10 shrink-0" rounded="rounded-full" />
          <p className="text-sm text-ink-700">{s}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function CurriculumOverviewPage() {
  return (
    <>
      <PageHero
        title="Curriculum Overview"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et. Maecenas vitae mattis tellus. Nullam quis imperdiet augue."
        ctas={
          <Link to="/admissions" className="btn-primary">
            Explore Admission
          </Link>
        }
      />

      {/* Education Pathway */}
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
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="card p-5"
              >
                <ImageSlot className="aspect-[4/3] w-full mb-5" rounded="rounded-xl" />
                <h3 className="font-display font-bold text-lg text-ink-900 mb-1">{p.title}</h3>
                <p className="text-sm font-semibold text-accent-green mb-3">{p.ageRange}</p>
                <p className="text-sm text-ink-500 line-clamp-2 mb-5">{p.description}</p>
                <Link to={p.href} className="btn-primary w-full !py-2.5 text-sm">
                  View Curriculum
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Pathway secondary row */}
      <section className="py-12">
        <div className="container-page">
          <h2 className="section-title text-center mb-3">Education Pathway</h2>
          <p className="text-center text-sm text-ink-500 max-w-2xl mx-auto mb-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et. Maecenas vitae mattis tellus. Nullam quis
            imperdiet augue.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-surface-muted p-5 flex items-center gap-5">
                <ImageSlot className="w-14 h-14 shrink-0" rounded="rounded-full" />
                <p className="text-sm text-ink-700">lorem orem ipsum dolor</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Learning Areas Khmer */}
      <section className="bg-surface-muted py-16">
        <div className="container-page">
          <h2 className="section-title text-center mb-10">Core Learning Areas Khmer</h2>
          <SubjectGrid items={CURRICULUM_SUBJECTS.khmer} bg="muted" />
        </div>
      </section>

      {/* Core Learning Areas Arabic */}
      <section className="bg-surface-muted py-16">
        <div className="container-page">
          <h2 className="section-title text-center mb-10">Core Learning Areas Arabic</h2>
          <SubjectGrid items={CURRICULUM_SUBJECTS.arabic} bg="muted" />
        </div>
      </section>
    </>
  );
}
