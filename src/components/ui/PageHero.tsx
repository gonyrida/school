import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  subtitle?: string;
  ctas?: ReactNode;
  align?: "center" | "left";
  size?: "sm" | "md" | "lg";
};

export function PageHero({
  title,
  subtitle,
  ctas,
  align = "center",
  size = "md",
}: Props) {
  const padY = size === "lg" ? "py-24 sm:py-32" : size === "sm" ? "py-14 sm:py-20" : "py-20 sm:py-28";
  return (
    <section className={`relative overflow-hidden checker-bg ${padY}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/80 pointer-events-none" />
      <div className="relative container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={align === "center" ? "text-center max-w-4xl mx-auto" : "max-w-3xl"}
        >
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-ink-900 leading-[1.1] tracking-tight text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-base sm:text-lg text-ink-500 max-w-2xl mx-auto text-balance">
              {subtitle}
            </p>
          )}
          {ctas && <div className={`mt-8 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>{ctas}</div>}
        </motion.div>
      </div>
    </section>
  );
}
