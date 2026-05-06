import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Download, Check } from "lucide-react";

const REQUIREMENTS = [
  "as vitae mattis tellus. Nullam quis",
  "as vitae mattis tellus. Nullam quis",
  "as vitae mattis tellus. Nullam quis",
  "as vitae mattis tellus. Nullam quis",
  "as vitae mattis tellus. Nullam quis",
];

const KEY_DATES = [
  { label: "Application Open:", value: "12-10-2025" },
  { label: "Application Close:", value: "12-10-2025" },
  { label: "Application Open:", value: "12-10-2025" },
  { label: "Application Open:", value: "12-10-2025" },
  { label: "Application Open:", value: "12-10-2025" },
];

export function RequirementSection({ withCta = true }: { withCta?: boolean }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <h2 className="section-title text-center mb-10">Requirement</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-surface-soft p-6"
          >
            <h3 className="font-display font-bold text-lg text-ink-900 text-center mb-5">Application Requirement</h3>
            <ul className="space-y-3">
              {REQUIREMENTS.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-ink-700">
                  <Check className="h-4 w-4 text-brand-700 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-surface-soft p-6"
          >
            <h3 className="font-display font-bold text-lg text-ink-900 text-center mb-5">Key Data &amp; Dateline</h3>
            <ul className="space-y-3">
              {KEY_DATES.map((d, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-ink-700">{d.label}</span>
                  <span className="font-medium text-ink-900">{d.value}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        {withCta && (
          <div className="text-center mt-10">
            <Link to="/admissions" className="btn-primary">
              <Download className="h-4 w-4" />
              See more Detail / Download Requirement
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
