import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  DollarSign,
  AlertCircle,
  School,
  Building2,
  BookOpen,
} from "lucide-react";
import { useFees } from "@/hooks/useFees";
import type { FeeItem, FeeFormData, FeeCategory } from "@/types/fee";

const CATEGORY_OPTIONS: { value: FeeCategory; label: string; icon: React.ElementType }[] = [
  { value: "school", label: "School Fee", icon: School },
  { value: "dormitory", label: "Dormitory + Food Fee", icon: Building2 },
  { value: "tuition", label: "Tuition Fee", icon: BookOpen },
];

const BADGE_OPTIONS = ["", "Popular", "Recommended", "Required", "New"];
const ICON_OPTIONS = ["School", "Building2", "BookOpen", "Star", "Trophy", "GraduationCap", "Home", "Layers"];
const CURRENCY_OPTIONS = ["USD", "KHR", "EUR"];
const PERIOD_OPTIONS = ["per year", "per semester", "per month", "per term"];

const EMPTY_FORM: FeeFormData = {
  title: "",
  description: "",
  amount: 0,
  currency: "USD",
  period: "per year",
  category: "school",
  badge: "",
  icon: "BookOpen",
  sort_order: 0,
  is_active: true,
};

function FeeFormModal({
  fee,
  onSave,
  onClose,
}: {
  fee?: FeeItem;
  onSave: (data: FeeFormData) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FeeFormData>(
    fee
      ? {
          title: fee.title,
          description: fee.description,
          amount: fee.amount,
          currency: fee.currency,
          period: fee.period,
          category: fee.category,
          badge: fee.badge ?? "",
          icon: fee.icon ?? "BookOpen",
          sort_order: fee.sort_order,
          is_active: fee.is_active,
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FeeFormData, string>>>({});

  const validate = () => {
    const e: Partial<Record<keyof FeeFormData, string>> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.amount || form.amount <= 0) e.amount = "Enter a valid amount";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({ ...form, badge: form.badge || undefined, icon: form.icon || undefined });
      onClose();
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-7 py-5 border-b border-ink-300/10">
          <h2 className="font-display font-bold text-lg text-ink-900">
            {fee ? "Edit Fee Item" : "Add Fee Item"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-muted transition-colors">
            <X className="h-4 w-4 text-ink-400" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-5">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setForm((f) => ({ ...f, category: value }))}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-xs font-medium transition-all ${
                    form.category === value
                      ? "border-brand-700 bg-brand-50 text-brand-700"
                      : "border-ink-300/20 text-ink-500 hover:border-ink-300/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Annual School Fee"
              className="input-field"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Describe what this fee covers..."
              className="input-field resize-none"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.description}</p>}
          </div>

          {/* Amount, Currency, Period */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">Amount *</label>
              <input
                type="number"
                min={0}
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: parseFloat(e.target.value) || 0 }))}
                className="input-field"
              />
              {errors.amount && <p className="text-xs text-red-500 mt-1"><AlertCircle className="h-3 w-3 inline" /> {errors.amount}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                className="input-field"
              >
                {CURRENCY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">Period</label>
              <select
                value={form.period}
                onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
                className="input-field"
              >
                {PERIOD_OPTIONS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Badge & Icon */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">Badge (optional)</label>
              <select
                value={form.badge ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                className="input-field"
              >
                {BADGE_OPTIONS.map((b) => <option key={b} value={b}>{b || "None"}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">Icon</label>
              <select
                value={form.icon ?? "BookOpen"}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                className="input-field"
              >
                {ICON_OPTIONS.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? "bg-brand-700" : "bg-ink-300/30"}`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${form.is_active ? "translate-x-5" : ""}`}
              />
            </button>
            <label className="text-sm text-ink-700">Show on public page</label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-ink-300/10 px-7 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="btn-outline">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="btn-primary">
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save Fee"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminFeesPage() {
  const { fees, loading, createFee, updateFee, deleteFee } = useFees();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FeeItem | undefined>();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSave = async (data: FeeFormData) => {
    if (editing) {
      await updateFee(editing.id, data);
    } else {
      await createFee({ ...data, sort_order: fees.length });
    }
  };

  const CATEGORY_LABELS: Record<FeeCategory, string> = {
    school: "School Fee",
    dormitory: "Dormitory + Food",
    tuition: "Tuition Fee",
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Fees &amp; Tuition</h1>
          <p className="text-sm text-ink-500 mt-1">
            Manage school fee cards shown on the Admissions page.
          </p>
        </div>
        <button onClick={() => { setEditing(undefined); setModalOpen(true); }} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Fee
        </button>
      </header>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-surface-muted animate-pulse" />
          ))}
        </div>
      ) : fees.length === 0 ? (
        <div className="card p-12 text-center">
          <DollarSign className="h-10 w-10 text-ink-300 mx-auto mb-3" />
          <p className="font-medium text-ink-700 mb-1">No fee items yet</p>
          <p className="text-sm text-ink-400 mb-4">Create your first fee card to display on the Admissions page.</p>
          <button onClick={() => { setEditing(undefined); setModalOpen(true); }} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Fee
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="divide-y divide-ink-300/10">
            {fees.map((fee) => (
              <div key={fee.id} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <DollarSign className="h-5 w-5 text-brand-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-ink-900">{fee.title}</p>
                    <span className="text-xs bg-surface-soft text-brand-700 border border-brand-100 px-2 py-0.5 rounded-full">
                      {CATEGORY_LABELS[fee.category]}
                    </span>
                    {fee.badge && (
                      <span className="text-xs bg-accent-gold/10 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                        {fee.badge}
                      </span>
                    )}
                    {!fee.is_active && (
                      <span className="text-xs bg-ink-300/10 text-ink-400 px-2 py-0.5 rounded-full">Hidden</span>
                    )}
                  </div>
                  <p className="text-xs text-ink-400 mt-0.5">
                    {fee.currency} {fee.amount.toLocaleString()} {fee.period}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setEditing(fee); setModalOpen(true); }}
                    className="p-2 rounded-xl hover:bg-white transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4 text-ink-500" />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(fee.id)}
                    className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <FeeFormModal
            fee={editing}
            onSave={handleSave}
            onClose={() => { setModalOpen(false); setEditing(undefined); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-display font-bold text-lg text-ink-900 mb-2">Delete Fee Item?</h3>
              <p className="text-sm text-ink-500 mb-6">This will remove it from the public Admissions page.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmDeleteId(null)} className="btn-outline">Cancel</button>
                <button
                  onClick={async () => { await deleteFee(confirmDeleteId); setConfirmDeleteId(null); }}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
