import { motion } from "framer-motion";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PageHero } from "@/components/ui/PageHero";
import { LeadershipSection } from "@/components/sections/LeadershipSection";
import { useLeaders } from "@/hooks/useLeaders";
import { LEADERS } from "@/data/content";

export default function LeaderPage() {
  const { leaders, loading } = useLeaders();

  return (
    <>
      <PageHero
        title="Meet Our Leaders"
        subtitle="Guided by vision, driven by purpose. Our leadership team brings together decades of experience in education, Islamic studies, and community development."
      />

      {/* Message from leader */}
      <section className="py-16 sm:py-24">
        <div className="container-page grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <div>
            <p className="eyebrow mb-3">A Message From Our Principal</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 mb-5">
              Message from Our Leader
            </h2>
            <div className="prose prose-sm max-w-none text-ink-500 leading-relaxed space-y-4">
              <p>
                At Norol Iman Islamic School, we believe that every child deserves an education
                that nurtures not only their intellect but also their character, faith, and sense
                of community. Our school was founded on the principle that academic excellence
                and Islamic values are not in conflict — they are complementary.
              </p>
              <p>
                We have built a community where students are inspired to think critically, act
                compassionately, and lead with integrity. Our dedicated teachers, supportive
                staff, and engaged parents work together to create an environment where every
                student can thrive.
              </p>
              <p>
                I invite you to visit our campus, meet our team, and discover how Norol Iman
                can be the foundation for your child's lifelong success.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div>
                <p className="font-display font-bold text-ink-900">{LEADERS.principal.name}</p>
                <p className="text-sm text-brand-700">{LEADERS.principal.role}</p>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ImageSlot className="aspect-[4/5] w-full" />
          </motion.div>
        </div>
      </section>

      {/* Dynamic Leadership Section */}
      {!loading && leaders.length > 0 && (
        <LeadershipSection leaders={leaders} />
      )}

      {loading && (
        <section className="py-16 sm:py-24 bg-surface-muted">
          <div className="container-page">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-surface-soft animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Staff Section */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <div className="text-center mb-10">
            <p className="eyebrow mb-3">Our Faculty</p>
            <h2 className="section-title mb-3">Dedicated Staff</h2>
            <p className="text-sm text-ink-500 max-w-xl mx-auto">
              Our experienced faculty members are passionate educators committed to bringing
              out the best in every student.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {LEADERS.staff.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.05 }}
                className="card p-5 text-center hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full checker-bg flex items-center justify-center">
                  <span className="text-sm font-bold text-brand-700">
                    {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm text-ink-900 mb-1">{s.name}</h3>
                <p className="text-xs font-medium text-brand-700 mb-2">{s.role}</p>
                <p className="text-xs text-ink-400 leading-relaxed line-clamp-2">{s.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
