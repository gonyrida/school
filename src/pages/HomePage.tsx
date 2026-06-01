import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IntroSection } from "@/components/sections/IntroSection";
import { EducationPathway } from "@/components/sections/EducationPathway";
import { EventsSection } from "@/components/sections/EventsSection";
import { VisionMissionValues } from "@/components/sections/VisionMissionValues";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { AdmissionTimeline } from "@/components/sections/AdmissionTimeline";
import { RequirementSection } from "@/components/sections/RequirementSection";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { ContactFormSection } from "@/components/sections/ContactFormSection";
import { useTranslation } from "@/hooks/useTranslation";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="relative checker-bg py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white pointer-events-none" />
        <div className="relative container-page grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink-900 leading-[1.05] tracking-tight">
              {t("home.hero_title")}
            </h1>
            <p className="mt-5 text-base text-ink-500 max-w-xl">
              {t("home.hero_subtitle")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/admissions" className="btn-primary">
                {t("home.primary_cta")}
              </Link>
              <Link to="/curriculum" className="btn-outline">
                {t("home.secondary_cta")} <ArrowRight className="icon-no-flip h-4 w-4" />
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <ImageSlot className="aspect-[4/3] w-full" />
          </motion.div>
        </div>
      </section>

      <IntroSection />
      <EducationPathway />
      <EventsSection />
      <VisionMissionValues />
      <FeaturesSection />
      <AdmissionTimeline />
      <RequirementSection />
      <GalleryPreview />
      <TestimonialSection />
      <ContactFormSection />
    </>
  );
}