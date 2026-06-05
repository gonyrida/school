import { motion } from "framer-motion";
import {
  School,
  Building2,
  BookOpen,
  Star,
  Sparkles,
  Trophy,
  GraduationCap,
  Home,
  Layers,
} from "lucide-react";
import type { FeeItem } from "@/types/fee";

// Map icon name strings to components
const ICON_MAP: Record<string, React.ElementType> = {
  School,
  Building2,
  BookOpen,
  Star,
  Sparkles,
  Trophy,
  GraduationCap,
  Home,
  Layers,
};

const BADGE_STYLES: Record<string, string> = {
  Popular: "bg-accent-gold/10 text-amber-700 border-amber-200",
  Recommended: "bg-brand-50 text-brand-700 border-brand-100",
  Required: "bg-red-50 text-red-600 border-red-100",
  Default: "bg-surface-muted text-ink-500 border-ink-300/30",
};

function getBadgeStyle(badge: string): string {
  return BADGE_STYLES[badge] ?? BADGE_STYLES.Default;
}

interface FeeCardProps {
  fee: FeeItem;
  index: number;
}

function FeeCard({ fee, index }: FeeCardProps) {
  const IconComponent = fee.icon ? ICON_MAP[fee.icon] ?? BookOpen : BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col rounded-3xl bg-white border border-ink-300/10 shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-700 via-brand-500 to-brand-300" />

      <div className="flex flex-col flex-1 p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-700 transition-colors duration-300">
            <IconComponent className="h-6 w-6 text-brand-700 group-hover:text-white transition-colors duration-300" />
          </div>
          {fee.badge && (
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeStyle(fee.badge)}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
              {fee.badge}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="font-display font-bold text-xl text-ink-900 mb-2">{fee.title}</h3>
        <p className="text-sm text-ink-500 leading-relaxed flex-1 mb-6">{fee.description}</p>

        {/* Price */}
        <div className="border-t border-ink-300/10 pt-5">
          <div className="flex items-end gap-1.5">
            <span className="text-sm font-medium text-ink-400 mb-1">{fee.currency}</span>
            <span className="font-display text-4xl font-extrabold text-ink-900 tracking-tight leading-none">
              {fee.amount.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-ink-400 mt-1">{fee.period}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface Props {
  fees: FeeItem[];
  hideHeader?: boolean;
}

export function FeesTuitionSection({ fees, hideHeader = false }: Props) {
  if (!fees.length) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        {/* Section header */}
        {!hideHeader && (
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Transparent Pricing</p>
            <h2 className="section-title mb-4">Fees &amp; Tuition</h2>
            <p className="text-sm text-ink-500 max-w-xl mx-auto leading-relaxed">
              We believe in transparent pricing. All fees are clearly outlined to help
              families plan and make informed decisions.
            </p>
          </div>
        )}

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fees.map((fee, i) => (
            <FeeCard key={fee.id} fee={fee} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-ink-400 mt-8"
        >
          * Fees are subject to change. Contact our admissions office for the most up-to-date information.
        </motion.p>
      </div>
    </section>
  );
}
