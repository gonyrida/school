import { motion } from "framer-motion";
import { Asterisk } from "lucide-react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PageHero } from "@/components/ui/PageHero";

const SUPPORT_WAYS = [
  {
    title: "How you can support Us",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et. Maecenas vitae mattis tellus. Nullam quis imperdiet augue.",
  },
  {
    title: "How you can support Us",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et. Maecenas vitae mattis tellus. Nullam quis imperdiet augue.",
  },
  {
    title: "How you can support Us",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et. Maecenas vitae mattis tellus. Nullam quis imperdiet augue.",
  },
];

const SPONSORS = [
  { name: "Full Name", role: "Role", email: "Email", phone: "Phone number" },
  { name: "Full Name", role: "Role", email: "Email", phone: "Phone number" },
  { name: "Full Name", role: "Role", email: "Email", phone: "Phone number" },
];

export default function SupportPage() {
  return (
    <>
      <PageHero
        title="Support Our School"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et . Maecenas vitae mattis tellus. Nullam quis imperdiet augue."
      />

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <h2 className="section-title text-center mb-2">How you can support Us</h2>
          <p className="text-center text-sm text-ink-500 max-w-2xl mx-auto mb-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et . Maecenas vitae mattis tellus. Nullam quis
            imperdiet augue.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SUPPORT_WAYS.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl bg-surface-muted p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Asterisk className="h-5 w-5 text-brand-700" strokeWidth={2.5} />
                  <h3 className="font-display font-bold text-base text-ink-900">{w.title}</h3>
                </div>
                <p className="text-sm text-ink-500 leading-relaxed">{w.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Let's keep in touch / sponsors */}
      <section className="py-16">
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold text-brand-700 mb-2">Let's keep in touch</h2>
          <p className="text-sm text-ink-500 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SPONSORS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`card p-5 flex items-center gap-5 ${i === 2 ? "md:col-start-1" : ""}`}
              >
                <ImageSlot className="w-14 h-14 shrink-0" rounded="rounded-full" />
                <div className="space-y-1">
                  <p className="font-display font-bold text-ink-900">{s.name}</p>
                  <p className="text-xs text-ink-500">{s.role}</p>
                  <p className="text-xs text-ink-500 flex items-center gap-1.5">
                    <Asterisk className="h-3 w-3" /> {s.email}
                  </p>
                  <p className="text-xs text-ink-500 flex items-center gap-1.5">
                    <Asterisk className="h-3 w-3" /> {s.phone}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Storytelling intro blocks */}
      <section className="py-16 space-y-16">
        <div className="container-page grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
          <ImageSlot className="aspect-[4/3] w-full" />
          <div>
            <h3 className="font-display text-xl font-bold text-ink-900 mb-3">Introduction</h3>
            <p className="text-sm text-ink-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis
              tellus. Nullam quis imperdiet augue.
            </p>
          </div>
        </div>

        <div className="container-page grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <h3 className="font-display text-xl font-bold text-ink-900 mb-3">Introduction</h3>
            <p className="text-sm text-ink-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis
              tellus. Nullam quis imperdiet augue.
            </p>
          </div>
          <ImageSlot className="aspect-[4/3] w-full" />
        </div>

        <div className="container-page grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
          <ImageSlot className="aspect-[4/3] w-full" />
          <div>
            <h3 className="font-display text-xl font-bold text-ink-900 mb-3">Introduction</h3>
            <p className="text-sm text-ink-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis
              tellus.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
