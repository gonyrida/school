import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Image as ImageIcon, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { cms } from '@/cms/api';
import type { EventPost } from '@/cms/api';
import { Breadcrumbs } from '@/cms/admin/components/Breadcrumbs';
import { RichTextEditor } from '@/cms/admin/components/RichTextEditor';
import { MediaPicker } from '@/cms/admin/components/MediaPicker';
import { ConfirmDialog } from '@/cms/admin/components/ConfirmDialog';
import { Skeleton } from '@/cms/admin/components/Skeleton';

type FormState = Omit<EventPost, 'id' | 'createdAt' | 'updatedAt'>;

const empty: FormState = {
  slug: '',
  title: '',
  excerpt: '',
  body: '',
  category: 'Academy',
  tags: [],
  status: 'draft',
  coverImage: undefined,
  gallery: [],
  eventDate: null,
  seo: { metaTitle: '', metaDescription: '', slug: '' },
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export default function EventEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';

  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [galleryPickerOpen, setGalleryPickerOpen] = useState(false);
  const [ogPickerOpen, setOgPickerOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (isNew) return;
    void (async () => {
      try {
        const event = await cms.getEvent(id!);
        if (event) {
          setForm({
            slug: event.slug,
            title: event.title,
            excerpt: event.excerpt,
            body: event.body,
            category: event.category,
            tags: event.tags,
            status: event.status,
            coverImage: event.coverImage,
            gallery: event.gallery,
            eventDate: event.eventDate,
            seo: event.seo,
          });
          setSlugTouched(true);
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const handleTitleChange = (title: string) => {
    update({ title });
    if (!slugTouched) {
      const newSlug = slugify(title);
      update({ slug: newSlug, seo: { ...form.seo, slug: newSlug } });
    }
  };

  const handleSubmit = async (publish?: boolean) => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.slug.trim()) {
      toast.error('Slug is required');
      return;
    }
    setSaving(true);
    try {
      const payload: FormState = {
        ...form,
        status: publish !== undefined ? (publish ? 'published' : 'draft') : form.status,
      };
      if (isNew) {
        const created = await cms.createEvent(payload);
        toast.success('Event created');
        navigate(`/dashboard/events/${created.id}`);
      } else {
        await cms.updateEvent(id!, payload);
        toast.success('Event saved');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isNew) return;
    try {
      await cms.deleteEvent(id);
      toast.success('Event deleted');
      navigate('/dashboard/events');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      update({ tags: [...form.tags, t] });
    }
    setTagInput('');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/events')}
            className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <Breadcrumbs
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'News & Events', to: '/dashboard/events' },
                { label: isNew ? 'New event' : form.title || 'Untitled' },
              ]}
            />
            <h1 className="mt-1 font-display text-xl font-bold text-ink-900">
              {isNew ? 'New event' : form.title || 'Untitled'}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <button onClick={() => setConfirmDelete(true)} className="btn-ghost !py-2 text-sm text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
          <button onClick={() => handleSubmit(false)} disabled={saving} className="btn-ghost !py-2 text-sm disabled:opacity-50">
            Save draft
          </button>
          <button onClick={() => handleSubmit(true)} disabled={saving} className="btn-primary !py-2 text-sm disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Main column */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="input-field !text-lg !font-display !font-bold"
                  placeholder="Event title…"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    update({ slug: e.target.value, seo: { ...form.seo, slug: e.target.value } });
                  }}
                  className="input-field font-mono text-sm"
                  placeholder="event-url-slug"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => update({ excerpt: e.target.value })}
                  rows={2}
                  className="input-field resize-y"
                  placeholder="Short summary shown in listings"
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">Content</h3>
            <RichTextEditor
              value={form.body}
              onChange={(body) => update({ body })}
              placeholder="Write the event content…"
            />
          </div>

          <div className="card p-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">Gallery</h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {form.gallery.map((img, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-ink-300/20">
                  <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                  <button
                    onClick={() => update({ gallery: form.gallery.filter((_, idx) => idx !== i) })}
                    className="absolute right-1.5 top-1.5 hidden h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white group-hover:flex"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setGalleryPickerOpen(true)}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-ink-300/40 text-ink-500 hover:border-brand-700 hover:text-brand-700"
              >
                <Plus className="h-5 w-5" />
                <span className="text-xs font-medium">Add</span>
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Meta title</label>
                <input
                  type="text"
                  value={form.seo.metaTitle}
                  onChange={(e) => update({ seo: { ...form.seo, metaTitle: e.target.value } })}
                  maxLength={60}
                  className="input-field"
                  placeholder={form.title}
                />
                <p className="mt-1 text-xs text-ink-500">{form.seo.metaTitle.length}/60</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Meta description</label>
                <textarea
                  value={form.seo.metaDescription}
                  onChange={(e) => update({ seo: { ...form.seo, metaDescription: e.target.value } })}
                  maxLength={160}
                  rows={3}
                  className="input-field resize-y"
                />
                <p className="mt-1 text-xs text-ink-500">{form.seo.metaDescription.length}/160</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">OG image</label>
                {form.seo.ogImage?.url ? (
                  <div className="relative overflow-hidden rounded-xl border border-ink-300/30">
                    <img src={form.seo.ogImage.url} alt="" className="h-32 w-full object-cover" />
                    <button
                      onClick={() => update({ seo: { ...form.seo, ogImage: undefined } })}
                      className="absolute right-2 top-2 rounded-lg bg-red-600 px-2 py-1 text-xs font-medium text-white"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setOgPickerOpen(true)}
                    className="flex h-24 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-300/40 text-ink-500 hover:border-brand-700 hover:text-brand-700"
                  >
                    <ImageIcon className="h-5 w-5" /> Choose image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">Status</h3>
            <select
              value={form.status}
              onChange={(e) => update({ status: e.target.value as 'draft' | 'published' })}
              className="input-field"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="card p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">Cover image</h3>
            {form.coverImage?.url ? (
              <div className="relative overflow-hidden rounded-xl">
                <img src={form.coverImage.url} alt={form.coverImage.alt} className="h-40 w-full object-cover" />
                <div className="mt-2 flex gap-2">
                  <button onClick={() => setCoverPickerOpen(true)} className="btn-ghost flex-1 !py-1.5 text-xs">
                    Replace
                  </button>
                  <button
                    onClick={() => update({ coverImage: undefined })}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={form.coverImage.alt}
                  onChange={(e) =>
                    update({ coverImage: { ...form.coverImage!, alt: e.target.value } })
                  }
                  placeholder="Alt text"
                  className="input-field mt-2 !py-2 text-sm"
                />
              </div>
            ) : (
              <button
                onClick={() => setCoverPickerOpen(true)}
                className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-300/40 text-ink-500 hover:border-brand-700 hover:text-brand-700"
              >
                <ImageIcon className="h-6 w-6" />
                <span className="text-sm font-medium">Choose cover</span>
              </button>
            )}
          </div>

          <div className="card p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">Details</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    update({ category: e.target.value as EventPost['category'] })
                  }
                  className="input-field"
                >
                  <option value="Academy">Academy</option>
                  <option value="Sports">Sports</option>
                  <option value="Arts">Arts</option>
                  <option value="Community">Community</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Event date</label>
                <input
                  type="date"
                  value={form.eventDate ?? ''}
                  onChange={(e) => update({ eventDate: e.target.value || null })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700"
                    >
                      {tag}
                      <button
                        onClick={() => update({ tags: form.tags.filter((_, idx) => idx !== i) })}
                        className="text-brand-700 hover:text-brand-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tag…"
                    className="input-field !py-2 text-sm"
                  />
                  <button onClick={addTag} className="btn-ghost !py-2 text-sm">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MediaPicker
        open={coverPickerOpen}
        onClose={() => setCoverPickerOpen(false)}
        onSelect={(item) => update({ coverImage: { url: item.url, alt: item.alt } })}
        defaultFolder="events"
      />
      <MediaPicker
        open={galleryPickerOpen}
        onClose={() => setGalleryPickerOpen(false)}
        onSelect={(item) => update({ gallery: [...form.gallery, { url: item.url, alt: item.alt }] })}
        defaultFolder="events"
      />
      <MediaPicker
        open={ogPickerOpen}
        onClose={() => setOgPickerOpen(false)}
        onSelect={(item) => update({ seo: { ...form.seo, ogImage: { url: item.url, alt: item.alt } } })}
        defaultFolder="events"
      />
      <ConfirmDialog
        open={confirmDelete}
        title="Delete this event?"
        description="This will permanently remove the event."
        confirmLabel="Delete"
        confirmVariant="danger"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
