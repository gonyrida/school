import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImageIcon } from 'lucide-react';
import { usePageEditor } from '@/cms/store/pageEditor';
import { MediaPicker } from '@/cms/admin/components/MediaPicker';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PageSettingsDrawer({ open, onClose }: Props) {
  const { page, updatePageMeta } = usePageEditor();
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  if (!page) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ink-300/20 px-5 py-4">
              <div>
                <h2 className="font-display text-lg font-bold text-ink-900">Page Settings</h2>
                <p className="text-xs text-ink-500">Status, SEO, and metadata</p>
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">General</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">Page title</label>
                    <input
                      type="text"
                      value={page.title}
                      onChange={(e) => updatePageMeta({ title: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">Description</label>
                    <textarea
                      value={page.description}
                      onChange={(e) => updatePageMeta({ description: e.target.value })}
                      rows={2}
                      className="input-field resize-y"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">Status</label>
                    <select
                      value={page.status}
                      onChange={(e) =>
                        updatePageMeta({ status: e.target.value as 'draft' | 'published' })
                      }
                      className="input-field"
                    >
                      <option value="draft">Draft (only visible in CMS)</option>
                      <option value="published">Published (visible on site)</option>
                    </select>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">SEO</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">Meta title</label>
                    <input
                      type="text"
                      value={page.seo.metaTitle}
                      onChange={(e) =>
                        updatePageMeta({ seo: { ...page.seo, metaTitle: e.target.value } })
                      }
                      placeholder={page.title}
                      maxLength={60}
                      className="input-field"
                    />
                    <p className="mt-1 text-xs text-ink-500">
                      {page.seo.metaTitle.length}/60 characters
                    </p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">Meta description</label>
                    <textarea
                      value={page.seo.metaDescription}
                      onChange={(e) =>
                        updatePageMeta({ seo: { ...page.seo, metaDescription: e.target.value } })
                      }
                      rows={3}
                      maxLength={160}
                      className="input-field resize-y"
                    />
                    <p className="mt-1 text-xs text-ink-500">
                      {page.seo.metaDescription.length}/160 characters
                    </p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">URL slug</label>
                    <input
                      type="text"
                      value={page.seo.slug}
                      onChange={(e) =>
                        updatePageMeta({ seo: { ...page.seo, slug: e.target.value } })
                      }
                      className="input-field font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">Open Graph image</label>
                    {page.seo.ogImage?.url ? (
                      <div className="relative overflow-hidden rounded-xl border border-ink-300/30">
                        <img src={page.seo.ogImage.url} alt="" className="h-32 w-full object-cover" />
                        <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/50 hover:flex">
                          <button
                            onClick={() => setMediaPickerOpen(true)}
                            className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium"
                          >
                            Replace
                          </button>
                          <button
                            onClick={() => updatePageMeta({ seo: { ...page.seo, ogImage: undefined } })}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setMediaPickerOpen(true)}
                        className="flex h-24 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-300/40 text-ink-500 hover:border-brand-700 hover:text-brand-700"
                      >
                        <ImageIcon className="h-5 w-5" /> Choose image
                      </button>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <MediaPicker
              open={mediaPickerOpen}
              onClose={() => setMediaPickerOpen(false)}
              onSelect={(item) =>
                updatePageMeta({ seo: { ...page.seo, ogImage: { url: item.url, alt: item.alt } } })
              }
              defaultFolder="hero"
            />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
