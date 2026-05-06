import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Search, Loader2, Check, Trash2, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMediaStore } from '@/cms/store/mediaStore';
import type { MediaItem } from '@/cms/api';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
  defaultFolder?: string;
}

const FOLDERS = ['uploads', 'hero', 'banners', 'cards', 'gallery', 'staff', 'avatars', 'events'];

export function MediaPicker({ open, onClose, onSelect, defaultFolder }: Props) {
  const { items, loading, uploading, folder, search, setFolder, setSearch, refresh, upload, remove } =
    useMediaStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setFolder(defaultFolder ?? '');
      void refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultFolder]);

  const filtered = items.filter((item) =>
    !search ? true : item.filename.toLowerCase().includes(search.toLowerCase()),
  );

  const handleFiles = async (files: FileList | File[]) => {
    try {
      const valid = Array.from(files).filter((f) =>
        ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(f.type),
      );
      if (valid.length === 0) {
        toast.error('Please upload JPG, PNG, or WebP images.');
        return;
      }
      const uploaded = await upload(valid);
      toast.success(`Uploaded ${uploaded.length} image${uploaded.length > 1 ? 's' : ''}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const handleConfirm = () => {
    const item = items.find((i) => i.id === selectedId);
    if (item) {
      onSelect(item);
      onClose();
      setSelectedId(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this image? This cannot be undone.')) return;
    try {
      await remove(id);
      toast.success('Deleted');
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative flex h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink-300/20 px-6 py-4">
              <h2 className="font-display text-xl font-bold text-ink-900">Media Library</h2>
              <button onClick={onClose} className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 border-b border-ink-300/10 px-6 py-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  placeholder="Search images…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-ink-500" />
                <select
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  className="input-field !w-auto !py-2"
                >
                  <option value="">All folders</option>
                  {FOLDERS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                hidden
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn-primary !py-2 disabled:opacity-60"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <span>Upload</span>
              </button>
            </div>

            {/* Grid */}
            <div
              className={`flex-1 overflow-y-auto p-6 transition-colors ${dragActive ? 'bg-brand-50' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files.length > 0) {
                  void handleFiles(e.dataTransfer.files);
                }
              }}
            >
              {loading ? (
                <div className="flex h-40 items-center justify-center text-ink-500">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-300/40 text-center">
                  <Upload className="h-10 w-10 text-ink-400" />
                  <p className="mt-3 text-ink-500">Drop images here or click Upload</p>
                  <p className="text-xs text-ink-400">JPG, PNG, WebP, GIF</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {filtered.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        onDoubleClick={() => {
                          onSelect(item);
                          onClose();
                        }}
                        className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                          isSelected ? 'border-brand-700 ring-2 ring-brand-200' : 'border-transparent hover:border-ink-300/40'
                        }`}
                      >
                        <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
                        {isSelected && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-white">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        )}
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="absolute left-2 top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white group-hover:flex"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-6 text-left">
                          <p className="truncate text-xs font-medium text-white">{item.filename}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-ink-300/20 px-6 py-4">
              <p className="text-sm text-ink-500">
                {selectedId
                  ? items.find((i) => i.id === selectedId)?.filename
                  : `${filtered.length} image${filtered.length === 1 ? '' : 's'}`}
              </p>
              <div className="flex gap-2">
                <button onClick={onClose} className="btn-ghost">
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedId}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Select Image
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
