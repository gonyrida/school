import { useState } from 'react';
import { X } from 'lucide-react';
import type { Blog } from '@/types/blog';

interface BlogSEOProps {
  blog?: Partial<Blog>;
  onChange: (seo: any) => void;
}

export function BlogSEO({ blog, onChange }: BlogSEOProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [seo, setSeo] = useState(blog?.seo || {});

  const handleChange = (field: string, value: string) => {
    const updated = { ...seo, [field]: value };
    setSeo(updated);
    onChange(updated);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between font-medium text-ink-900"
      >
        <span>SEO Settings</span>
        <span className={`transition ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
          <div>
            <label className="block text-sm font-medium text-ink-900">
              Meta Title
              <span className="ml-1 text-xs text-ink-400">
                ({(seo.title || '').length}/60)
              </span>
            </label>
            <input
              type="text"
              maxLength={60}
              value={seo.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="How to Study Effectively | NICS Blog"
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-ink-900 placeholder-ink-400 transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900">
              Meta Description
              <span className="ml-1 text-xs text-ink-400">
                ({(seo.description || '').length}/160)
              </span>
            </label>
            <textarea
              maxLength={160}
              value={seo.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Learn effective study techniques for students..."
              rows={2}
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-ink-900 placeholder-ink-400 transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900">Keywords</label>
            <input
              type="text"
              value={seo.keywords || ''}
              onChange={(e) => handleChange('keywords', e.target.value)}
              placeholder="study, tips, learning, education"
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-ink-900 placeholder-ink-400 transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900">
              OG Title
              <span className="ml-1 text-xs text-ink-400">
                (for social media)
              </span>
            </label>
            <input
              type="text"
              value={seo.ogTitle || ''}
              onChange={(e) => handleChange('ogTitle', e.target.value)}
              placeholder="How to Study Effectively | NICS Blog"
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-ink-900 placeholder-ink-400 transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900">
              OG Description
              <span className="ml-1 text-xs text-ink-400">
                (for social media)
              </span>
            </label>
            <textarea
              value={seo.ogDescription || ''}
              onChange={(e) => handleChange('ogDescription', e.target.value)}
              placeholder="Learn effective study techniques..."
              rows={2}
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-ink-900 placeholder-ink-400 transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
            💡 <strong>Tip:</strong> Good SEO helps your blog appear in search results. Keep 
            descriptions between 150-160 characters.
          </div>
        </div>
      )}
    </div>
  );
}
