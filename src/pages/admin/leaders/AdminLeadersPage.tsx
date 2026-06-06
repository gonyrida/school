import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  X,
  Upload,
  Save,
  User,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  AlertCircle,
} from "lucide-react";
import { useLeaders } from "@/hooks/useLeaders";
import type { Leader, LeaderFormData } from "@/types/leader";

const EMPTY_FORM: LeaderFormData = {
  full_name: "",
  position: "",
  bio: "",
  email: "",
  phone: "",
  image_url: "",
  social_facebook: "",
  social_instagram: "",
  social_linkedin: "",
  sort_order: 0,
};

function LeaderFormModal({
  leader,
  onSave,
  onClose,
  uploadImage,
}: {
  leader?: Leader;
  onSave: (data: LeaderFormData) => Promise<void>;
  onClose: () => void;
  uploadImage: (file: File, id: string) => Promise<string>;
}) {
  const [form, setForm] = useState<LeaderFormData>(
    leader
      ? {
          full_name: leader.full_name,
          position: leader.position,
          bio: leader.bio,
          email: leader.email ?? "",
          phone: leader.phone ?? "",
          image_url: leader.image_url ?? "",
          social_facebook: leader.social_facebook ?? "",
          social_instagram: leader.social_instagram ?? "",
          social_linkedin: leader.social_linkedin ?? "",
          sort_order: leader.sort_order,
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Partial<LeaderFormData>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Partial<LeaderFormData> = {};
    if (!form.full_name.trim()) e.full_name = "Name is required";
    if (!form.position.trim()) e.position = "Position is required";
    if (!form.bio.trim()) e.bio = "Bio is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const [previewUrl, setPreviewUrl] = useState<string>(leader?.image_url ?? "");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please choose a file under 5MB.");
      return;
    }

    // Show instant local preview while uploading
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploading(true);

    try {
      const url = await uploadImage(file, leader?.id ?? `temp-${Date.now()}`);
      setForm((f) => ({ ...f, image_url: url }));
      setPreviewUrl(url);
      // Revoke the temporary blob URL
      URL.revokeObjectURL(localPreview);
    } catch (err) {
      console.error("Upload error:", err);
      setPreviewUrl(form.image_url ?? ''); // revert preview
      URL.revokeObjectURL(localPreview);
      alert("Image upload failed. If you haven't set up Supabase storage yet, the image will be saved as a data URL for demo purposes. Check the console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const field = (
    label: string,
    key: keyof LeaderFormData,
    type = "text",
    placeholder = ""
  ) => (
    <div>
      <label className="block text-xs font-semibold text-ink-700 mb-1.5">{label}</label>
      {key === "bio" ? (
        <textarea
          value={form[key] as string}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          rows={3}
          placeholder={placeholder}
          className="input-field resize-none"
        />
      ) : (
        <input
          type={type}
          value={form[key] as string}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className="input-field"
        />
      )}
      {errors[key] && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errors[key]}
        </p>
      )}
    </div>
  );

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
            {leader ? "Edit Leader" : "Add New Leader"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-muted transition-colors">
            <X className="h-4 w-4 text-ink-400" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-5">
          {/* Profile image */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-surface-muted flex-shrink-0">
              {previewUrl ? (
                <img src={previewUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-8 w-8 text-ink-300" />
                </div>
              )}
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="btn-outline text-sm py-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading…" : "Upload Photo"}
              </button>
              <p className="text-xs text-ink-400 mt-1">JPG, PNG or WebP. Max 5MB.</p>
            </div>
          </div>

          {field("Full Name *", "full_name", "text", "e.g. Dr. Ahmad Al-Hassan")}
          {field("Position / Title *", "position", "text", "e.g. Principal")}
          {field("Short Biography *", "bio", "text", "Write a short bio...")}

          <div className="grid grid-cols-2 gap-4">
            {field("Email", "email", "email", "name@nics.edu.kh")}
            {field("Phone", "phone", "tel", "+855 xx xxx xxxx")}
          </div>

          <div className="border-t border-ink-300/10 pt-4">
            <p className="text-xs font-semibold text-ink-500 mb-3 uppercase tracking-wider">Social Media (optional)</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Facebook className="h-4 w-4 text-ink-400 shrink-0" />
                <input
                  type="url"
                  value={form.social_facebook ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, social_facebook: e.target.value }))}
                  placeholder="Facebook profile URL"
                  className="input-field"
                />
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="h-4 w-4 text-ink-400 shrink-0" />
                <input
                  type="url"
                  value={form.social_instagram ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, social_instagram: e.target.value }))}
                  placeholder="Instagram profile URL"
                  className="input-field"
                />
              </div>
              <div className="flex items-center gap-3">
                <Linkedin className="h-4 w-4 text-ink-400 shrink-0" />
                <input
                  type="url"
                  value={form.social_linkedin ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, social_linkedin: e.target.value }))}
                  placeholder="LinkedIn profile URL"
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-ink-300/10 px-7 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="btn-outline">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="btn-primary">
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save Leader"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLeadersPage() {
  const { leaders, loading, createLeader, updateLeader, deleteLeader, uploadImage, reorderLeaders } = useLeaders();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Leader | undefined>();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSave = async (data: LeaderFormData) => {
    if (editing) {
      await updateLeader(editing.id, data);
    } else {
      await createLeader({ ...data, sort_order: leaders.length });
    }
  };

  const handleDelete = async (id: string) => {
    await deleteLeader(id);
    setConfirmDeleteId(null);
  };

  const handleDragStart = (id: string) => setDraggingId(id);
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;
    const from = leaders.findIndex((l) => l.id === draggingId);
    const to = leaders.findIndex((l) => l.id === targetId);
    if (from === -1 || to === -1) return;
    const reordered = [...leaders];
    const [item] = reordered.splice(from, 1);
    reordered.splice(to, 0, item);
    void reorderLeaders(reordered);
  };
  const handleDragEnd = () => setDraggingId(null);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Leadership Team</h1>
          <p className="text-sm text-ink-500 mt-1">
            Manage your school's leadership team. Drag to reorder — the first member (center of row 1) appears as the main highlighted leader.
          </p>
        </div>
        <button onClick={() => { setEditing(undefined); setModalOpen(true); }} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Leader
        </button>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-surface-muted animate-pulse" />
          ))}
        </div>
      ) : leaders.length === 0 ? (
        <div className="card p-12 text-center">
          <User className="h-10 w-10 text-ink-300 mx-auto mb-3" />
          <p className="font-medium text-ink-700 mb-1">No leaders yet</p>
          <p className="text-sm text-ink-400 mb-4">Add your first team member to get started.</p>
          <button onClick={() => { setEditing(undefined); setModalOpen(true); }} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Leader
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {leaders.map((leader, i) => (
            <div
              key={leader.id}
              draggable
              onDragStart={() => handleDragStart(leader.id)}
              onDragOver={(e) => handleDragOver(e, leader.id)}
              onDragEnd={handleDragEnd}
              className={`card flex items-center gap-4 p-4 cursor-grab transition-all ${
                draggingId === leader.id ? "opacity-50 scale-[0.98]" : ""
              }`}
            >
              <GripVertical className="h-5 w-5 text-ink-300 shrink-0" />
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-muted shrink-0">
                {leader.image_url ? (
                  <img src={leader.image_url} alt={leader.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-50">
                    <span className="text-sm font-bold text-brand-700">
                      {leader.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-ink-900 truncate">{leader.full_name}</p>
                  {i === 0 && (
                    <span className="text-xs bg-brand-700 text-white px-2 py-0.5 rounded-full">Main Leader</span>
                  )}
                  {i === 1 && leaders.length >= 3 && (
                    <span className="text-xs bg-surface-soft text-brand-700 border border-brand-100 px-2 py-0.5 rounded-full">Center Card</span>
                  )}
                </div>
                <p className="text-xs text-ink-400">{leader.position}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {leader.email && <Mail className="h-4 w-4 text-ink-300" />}
                {leader.phone && <Phone className="h-4 w-4 text-ink-300" />}
                <button
                  onClick={() => { setEditing(leader); setModalOpen(true); }}
                  className="p-2 rounded-xl hover:bg-surface-muted transition-colors"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4 text-ink-500" />
                </button>
                <button
                  onClick={() => setConfirmDeleteId(leader.id)}
                  className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <LeaderFormModal
            leader={editing}
            onSave={handleSave}
            onClose={() => { setModalOpen(false); setEditing(undefined); }}
            uploadImage={uploadImage}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
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
              <h3 className="font-display font-bold text-lg text-ink-900 mb-2">Delete Leader?</h3>
              <p className="text-sm text-ink-500 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmDeleteId(null)} className="btn-outline">Cancel</button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
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
