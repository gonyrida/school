import { motion } from "framer-motion";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PageHero } from "@/components/ui/PageHero";
import { LEADERS } from "@/data/content";

function PersonCard({
  name,
  role,
  bio,
  size = "md",
  highlight = false,
}: {
  name: string;
  role: string;
  bio: string;
  size?: "sm" | "md" | "lg";
  highlight?: boolean;
}) {
  const sizes = {
    sm: { img: "w-24 h-24", title: "text-base", padding: "p-5" },
    md: { img: "w-28 h-28", title: "text-lg", padding: "p-6" },
    lg: { img: "w-32 h-32", title: "text-xl", padding: "p-7" },
  } as const;
  const s = sizes[size];
  return (
    <div className={`card ${s.padding} text-center ${highlight ? "shadow-glow" : ""}`}>
      <ImageSlot className={`${s.img} mx-auto mb-4`} rounded="rounded-full" />
      <h3 className={`font-display font-bold ${s.title} text-ink-900 mb-1`}>{name}</h3>
      <p className="text-sm font-medium text-brand-700 mb-3">{role}</p>
      <p className="text-xs text-ink-500 leading-relaxed line-clamp-2">{bio}</p>
    </div>
  );
}

export default function LeaderPage() {
  return (
    <>
      <PageHero
        title="Meet Our Leader"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris."
      />

      {/* Message from leader */}
      <section className="py-16 sm:py-24">
        <div className="container-page grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 mb-5">Message from Leader</h2>
            <div className="prose prose-sm max-w-none text-ink-500 leading-relaxed space-y-3">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
                Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae
                mattis tellus. Nullam quis imperdiet augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula
                consectetur, ultrices mauris. Maecenas vitae mattis tellus.
              </p>
              <p>
                Nullam quis imperdiet augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices
                mauris. Maecenas igula consectetur, ultrices mauris.
              </p>
            </div>
            <p className="mt-6 font-display font-bold text-ink-900">{LEADERS.principal.name}</p>
          </div>
          <ImageSlot className="aspect-[4/5] w-full" />
        </div>
      </section>

      {/* Principle Card */}
      <section className="bg-surface-muted py-16 sm:py-24">
        <div className="container-page">
          <h2 className="section-title text-center mb-10">Principle Card</h2>
          <div className="max-w-md mx-auto mb-6">
            <PersonCard
              name={LEADERS.principal.name}
              role={LEADERS.principal.role}
              bio={LEADERS.principal.bio}
              size="lg"
              highlight
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {LEADERS.team.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <PersonCard {...p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Card grid */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <h2 className="section-title text-center mb-10">Staff Card</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {LEADERS.staff.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.05 }}
              >
                <PersonCard {...s} size="sm" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
