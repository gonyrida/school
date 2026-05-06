import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 p-6">
              {confirmVariant === 'danger' && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-ink-900">{title}</h3>
                {description && <p className="mt-1.5 text-sm text-ink-500">{description}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-ink-300/10 bg-surface-soft px-6 py-3">
              <button onClick={onCancel} className="btn-ghost !py-2 text-sm">
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`!py-2 text-sm ${
                  confirmVariant === 'danger'
                    ? 'inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 font-semibold text-white hover:bg-red-700'
                    : 'btn-primary'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
