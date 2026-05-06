import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { SECTION_META, SECTION_TYPES, type SectionType } from '@/cms/schema/sections';
import { isAllowedSection } from '@/cms/schema/pages';

interface Props {
  open: boolean;
  pageKey: string;
  onClose: () => void;
  onSelect: (type: SectionType) => void;
}

export function SectionPicker({ open, pageKey, onClose, onSelect }: Props) {
  const available = SECTION_TYPES.filter((t) => isAllowedSection(pageKey, t));
  const byCategory = available.reduce<Record<string, SectionType[]>>((acc, t) => {
    const cat = SECTION_META[t].category;
    (acc[cat] ??= []).push(t);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink-900/60 backdrop-blur-sm p-4 pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ink-300/20 px-6 py-4">
              <div>
                <h2 className="font-display text-xl font-bold text-ink-900">Add Section</h2>
                <p className="text-sm text-ink-500">Choose a section type to insert</p>
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
              {Object.entries(byCategory).map(([category, types]) => (
                <div key={category}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">{category}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {types.map((type) => {
                      const meta = SECTION_META[type];
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const Icon = (Icons as any)[meta.icon] ?? Icons.Square;
                      return (
                        <button
                          key={type}
                          onClick={() => {
                            onSelect(type);
                            onClose();
                          }}
                          className="group flex items-start gap-3 rounded-xl border border-ink-300/20 p-4 text-left transition-all hover:border-brand-700 hover:bg-brand-50"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 group-hover:bg-brand-700 group-hover:text-white">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-ink-900">{meta.label}</p>
                            <p className="mt-0.5 text-xs text-ink-500">{meta.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
