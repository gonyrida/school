import { motion } from "framer-motion";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PageHero } from "@/components/ui/PageHero";
import { CURRICULUM_SUBJECTS } from "@/data/content";

type Props = {
  title: string;
  subtitle?: string;
  variant: "kindergarten" | "elementary";
};

export function CurriculumLevelPage({ title, subtitle, variant }: Props) {
  const showProgramClass = variant === "kindergarten";

  return (
    <>
      <PageHero
        title={title}
        subtitle={
          subtitle ??
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et. Maecenas vitae mattis tellus. Nullam quis imperdiet augue."
        }
      />

      {/* Introduction */}
      <section className="py-16 sm:py-20">
        <div className="container-page grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 items-start">
          <ImageSlot className={variant === "kindergarten" ? "aspect-square w-full" : "aspect-[4/3] w-full lg:order-2"} />
          <div className={variant === "kindergarten" ? "" : "lg:order-1"}>
            <h2 className="font-display text-2xl font-bold text-ink-900 mb-4">Introduction</h2>
            <p className="text-sm text-ink-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis
              tellus. Nullam quis imperdiet augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. mauris.
              Maecenas vitae mattis tellus. Nullam quis imperdiet augue.
            </p>
          </div>
        </div>
      </section>

      {/* Foundation Skill */}
      <section className="py-12">
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold text-ink-900 mb-6">Foundation Skill</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-surface-soft p-6 text-center"
              >
                <ImageSlot className="w-14 h-14 mx-auto mb-4" rounded="rounded-full" />
                <h3 className="font-display font-bold text-base text-ink-900 mb-3">
                  lorem orem ipsum dolor sit amet, consectetur
                </h3>
                <p className="text-sm text-ink-500 leading-relaxed">
                  orem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Learning Areas Khmer */}
      <section className="bg-surface-muted py-16">
        <div className="container-page">
          <h2 className="section-title text-center mb-10">Core Learning Areas Khmer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CURRICULUM_SUBJECTS.khmer.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.05 }}
                className="card p-5 flex items-center gap-4"
              >
                <ImageSlot className="w-10 h-10 shrink-0" rounded="rounded-full" />
                <p className="text-sm text-ink-700">lorem orem ipsum dolor</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Learning Areas Arabic */}
      <section className="bg-surface-muted py-16">
        <div className="container-page">
          <h2 className="section-title text-center mb-10">Core Learning Areas Arabic</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CURRICULUM_SUBJECTS.arabic.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.05 }}
                className="card p-5 flex items-center gap-4"
              >
                <ImageSlot className="w-10 h-10 shrink-0" rounded="rounded-full" />
                <p className="text-sm text-ink-700">lorem orem ipsum dolor</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Program & Class - kindergarten only */}
      {showProgramClass && (
        <section className="py-16">
          <div className="container-page">
            <h2 className="section-title text-center mb-10">Our Program &amp; Class</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-surface-muted p-5">
                  <ImageSlot className="w-12 h-12 mb-4" rounded="rounded-lg" />
                  <h3 className="font-display font-bold text-base text-brand-700 mb-2">Primary</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">
                    A Website is an extension of yourself and we can help you to express it properly. Your website is
                    your number one marketing asset because we live in a digital age.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Class Activity */}
      <section className="py-12">
        <div className="container-page">
          <h2 className="section-title text-center mb-10">Class Activity</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <ImageSlot className="aspect-[4/3] w-full mb-3" rounded="rounded-xl" />
                <h3 className="font-display font-bold text-base text-ink-900 mb-1">Title</h3>
                <p className="text-xs text-ink-500 line-clamp-2">
                  Lorem ipsum dolor sit amet, dolor sit amet, dolor sit amet, consectetur ad…
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Daily — staff portrait row */}
      <section className="py-12 pb-24">
        <div className="container-page">
          <h2 className="section-title text-center mb-10">Daily</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <ImageSlot className="w-28 h-28 mx-auto mb-3" rounded="rounded-full" />
                <p className="font-display font-semibold text-ink-900">Full Name</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Title section closing — elementary only */}
      {variant === "elementary" && (
        <section className="bg-surface-muted py-16">
          <div className="container-page">
            <h2 className="font-display text-2xl font-bold text-ink-900 mb-4">Title Of The School</h2>
            <p className="text-sm text-ink-500 leading-relaxed max-w-3xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis
              tellus. Nullam quis imperdiet augue.
            </p>
          </div>
        </section>
      )}
    </>
  );
}

export default function KindergartenPage() {
  return (
    <CurriculumLevelPage
      title={
        <>
          Kindergarten: Guilde
          <br />
          Lodolor , consectetur adipiscing elit.
        </> as any
      }
      variant="kindergarten"
    />
  );
}
