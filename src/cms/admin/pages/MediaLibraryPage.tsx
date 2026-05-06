import { useEffect, useRef, useState } from 'react';
import { Upload, Search, FolderOpen, Loader2, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMediaStore } from '@/cms/store/mediaStore';
import { Breadcrumbs } from '@/cms/admin/components/Breadcrumbs';
import { ConfirmDialog } from '@/cms/admin/components/ConfirmDialog';
import { Skeleton } from '@/cms/admin/components/Skeleton';
import type { MediaItem } from '@/cms/api';

const FOLDERS = ['uploads', 'hero', 'banners', 'cards', 'gallery', 'staff', 'avatars', 'events'];

export default function MediaLibraryPage() {
  const { items, loading, uploading, folder, search, setFolder, setSearch, refresh, upload, remove, updateAlt } =
    useMediaStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = items.filter((m) =>
    !search ? true : m.filename.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    try {
      const valid = Array.from(files).filter((f) =>
        ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(f.type),
      );
      if (valid.length === 0) {
        toast.error('Please upload JPG, PNG, WebP, or GIF images.');
        return;
      }
      const uploaded = await upload(valid);
      toast.success(`Uploaded ${uploaded.length} image${uploaded.length > 1 ? 's' : ''}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedIds) {
        await remove(id);
      }
      toast.success(`Deleted ${selectedIds.size} image${selectedIds.size > 1 ? 's' : ''}`);
      setSelectedIds(new Set());
      setConfirmBulkDelete(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Media Library' }]} />
        <h1 className="mt-2 font-display text-2xl font-bold text-ink-900">Media Library</h1>
        <p className="text-sm text-ink-500">Manage all images used across your website</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search by filename…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-ink-500" />
          <select value={folder} onChange={(e) => setFolder(e.target.value)} className="input-field !w-auto">
            <option value="">All folders</option>
            {FOLDERS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        {selectedIds.size > 0 && (
          <button onClick={() => setConfirmBulkDelete(true)} className="btn-ghost !py-2 text-sm text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" /> Delete {selectedIds.size}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn-primary !py-2 disabled:opacity-60">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          <span>Upload images</span>
        </button>
      </div>

      {/* Grid */}
      <div
        className={`min-h-[400px] rounded-2xl border-2 border-dashed p-4 transition-colors ${
          dragActive ? 'border-brand-700 bg-brand-50' : 'border-transparent'
        }`}
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <Upload className="h-12 w-12 text-ink-400" />
            <p className="mt-3 text-ink-500">Drag and drop images here, or click Upload</p>
            <p className="text-xs text-ink-400">JPG, PNG, WebP, GIF</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filtered.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`group relative aspect-square overflow-hidden rounded-xl border-2 ${
                    isSelected ? 'border-brand-700 ring-2 ring-brand-200' : 'border-transparent'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="h-full w-full cursor-pointer object-cover"
                    onClick={() => setEditing(item)}
                  />
                  <button
                    onClick={() => toggleSelect(item.id)}
                    className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                      isSelected
                        ? 'bg-brand-700 text-white'
                        : 'bg-white/80 text-ink-700 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {isSelected ? <Check className="h-3.5 w-3.5" /> : <span className="h-3 w-3 rounded-full border-2 border-current" />}
                  </button>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-6">
                    <p className="truncate text-xs font-medium text-white">{item.filename}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit alt text modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ink-300/20 px-5 py-4">
              <h3 className="font-display text-lg font-bold text-ink-900">Image details</h3>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <img src={editing.url} alt={editing.alt} className="aspect-video w-full rounded-xl object-cover" />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-ink-500">Filename</p>
                  <p className="font-medium text-ink-900 truncate">{editing.filename}</p>
                </div>
                <div>
                  <p className="text-ink-500">Folder</p>
                  <p className="font-medium text-ink-900">{editing.folder}</p>
                </div>
                <div>
                  <p className="text-ink-500">Size</p>
                  <p className="font-medium text-ink-900">{(editing.size / 1024).toFixed(1)} KB</p>
                </div>
                <div>
                  <p className="text-ink-500">Uploaded</p>
                  <p className="font-medium text-ink-900">{new Date(editing.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Alt text</label>
                <input
                  type="text"
                  defaultValue={editing.alt}
                  onBlur={async (e) => {
                    if (e.target.value !== editing.alt) {
                      await updateAlt(editing.id, e.target.value);
                      toast.success('Alt text saved');
                    }
                  }}
                  className="input-field"
                  placeholder="Describe the image for screen readers"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmBulkDelete}
        title={`Delete ${selectedIds.size} image${selectedIds.size > 1 ? 's' : ''}?`}
        description="This action cannot be undone."
        confirmLabel="Delete all"
        confirmVariant="danger"
        onCancel={() => setConfirmBulkDelete(false)}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
