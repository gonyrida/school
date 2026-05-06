import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PageHero } from "@/components/ui/PageHero";
import { AdmissionTimeline } from "@/components/sections/AdmissionTimeline";
import { RequirementSection } from "@/components/sections/RequirementSection";
import { FAQS } from "@/data/content";

export default function AdmissionsPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(1);

  return (
    <>
      <PageHero
        title={
          <>
            Event : Guilde
            <br />
            Lodolor , consectetur adipiscing elit.
          </>
        }
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et . Maecenas vitae mattis tellus. Nullam quis imperdiet augue."
      />

      {/* Introduction */}
      <section className="py-16 sm:py-20">
        <div className="container-page grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 items-start">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-900 mb-4">Introduction</h2>
            <p className="text-sm text-ink-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis
              tellus. Nullam quis imperdiet augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. mauris.
              Maecenas vitae mattis tellus. Nullam quis imperdiet augue.
            </p>
          </div>
          <ImageSlot className="aspect-[4/3] w-full" />
        </div>
      </section>

      <AdmissionTimeline />
      <RequirementSection />

      {/* FAQ */}
      <section className="py-16">
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
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
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

      {/* Gallery */}
      <section className="py-16">
        <div className="container-page">
          <h2 className="section-title text-center mb-10">Gallery of student</h2>
          <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
            <div className="space-y-4">
              <ImageSlot className="aspect-[3/4] w-full" />
              <ImageSlot className="aspect-square w-full" />
              <ImageSlot className="aspect-[3/4] w-full" />
            </div>
            <div className="space-y-4">
              <ImageSlot className="aspect-square w-full" />
              <ImageSlot className="aspect-[3/4] w-full" />
              <ImageSlot className="aspect-square w-full" />
            </div>
            <div className="space-y-4">
              <ImageSlot className="aspect-[3/4] w-full" />
              <ImageSlot className="aspect-square w-full" />
              <ImageSlot className="aspect-[3/4] w-full" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
