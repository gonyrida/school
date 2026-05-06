import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PageHero } from "@/components/ui/PageHero";
import { FAQS } from "@/data/content";

const STATS = [
  { value: "10+", label: "Years of operation" },
  { value: "10+", label: "Resident students" },
  { value: "10+", label: "Caring staff" },
];

export default function DormitoryPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(1);

  return (
    <>
      <PageHero
        title="Dormitory"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus."
      />

      {/* Stats + Our History */}
      <section className="bg-surface-muted py-16 sm:py-20">
        <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-900 mb-6">Message from Leader</h2>
            <div className="grid grid-cols-3 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="card p-4 text-center">
                  <ImageSlot className="w-10 h-10 mx-auto mb-2" rounded="rounded-lg" />
                  <p className="font-display font-extrabold text-2xl text-ink-900">{s.value}</p>
                  <p className="text-xs text-ink-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-900 mb-4">Our History</h2>
            <p className="text-sm text-ink-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis
              tellus. Nullam quis imperdiet augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa
              mi. Aliquam in hendrerit urna.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <h2 className="section-title mb-8">Frequently Ask Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const open = openIdx === i;
              return (
                <div key={i} className="rounded-2xl bg-surface-muted overflow-hidden">
                  <button
                    onClick={() => setOpenIdx(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className={`text-sm ${open ? "font-semibold text-ink-900" : "text-ink-700"}`}>{f.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm text-ink-500 leading-relaxed">{f.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student Life narrative blocks */}
      <section className="pb-16 sm:pb-24">
        <div className="container-page space-y-10">
          <h2 className="section-title">Student Life</h2>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
            <ImageSlot className="aspect-[4/3] w-full" />
            <p className="text-sm text-ink-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis
              tellus.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
            <p className="text-sm text-ink-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.
            </p>
            <ImageSlot className="aspect-[4/3] w-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
            <ImageSlot className="aspect-[4/3] w-full" />
            <p className="text-sm text-ink-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <ImageSlot key={i} className="aspect-square w-full" />
            ))}
          </div>

          <div className="checker-bg p-8 rounded-2xl">
            <h3 className="font-display text-xl font-bold text-ink-900 mb-2">Title Of The School</h3>
            <p className="text-sm text-ink-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
