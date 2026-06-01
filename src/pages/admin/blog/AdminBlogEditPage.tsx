import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useBlogAdmin } from '@/hooks/useBlogs';
import { supabase } from '@/lib/supabase';
import { BlogEditor } from '@/components/blog/BlogEditor';
import { BlogImageUpload } from '@/components/blog/BlogImageUpload';
import { BlogSEO } from '@/components/blog/BlogSEO';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import type { BlogFormData } from '@/types/blog';

export default function AdminBlogEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateBlog } = useBlogAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    cover_alt: '',
    published: false,
    seo: {},
  });

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setFormData({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt || '',
            content: data.content,
            cover_image: data.cover_image || '',
            cover_alt: data.cover_alt || '',
            published: data.published,
            seo: data.seo || {},
          });
        }
      } catch (error) {
        toast.error('Failed to load blog post');
        navigate('..');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const handleImageUpload = (url: string, alt: string) => {
    setFormData((prev) => ({
      ...prev,
      cover_image: url,
      cover_alt: alt,
    }));
  };

  const handleSEOChange = (seo: any) => {
    setFormData((prev) => ({
      ...prev,
      seo,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('Please enter a slug');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Please write some content');
      return;
    }

    if (!id) {
      toast.error('Blog ID not found');
      return;
    }

    setSaving(true);
    try {
      await updateBlog(id, formData);
      toast.success('Blog post updated successfully');
      navigate('..');
    } catch (error) {
      toast.error('Failed to update blog post');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('..')}
          className="rounded p-2 transition hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-ink-600" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Edit Blog Post</h1>
          <p className="mt-1 text-ink-500">Update your blog post content and settings</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <label className="block text-sm font-medium text-ink-900">
            Title
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="How to Study Effectively"
            className="mt-2 w-full rounded border border-gray-300 bg-white px-4 py-2 text-ink-900 placeholder-ink-400 transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-20"
          />
        </div>

        {/* Slug */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <label className="block text-sm font-medium text-ink-900">
            Slug
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder="how-to-study-effectively"
            className="mt-2 w-full rounded border border-gray-300 bg-white px-4 py-2 text-ink-900 placeholder-ink-400 transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-20"
          />
          <p className="mt-2 text-xs text-ink-400">
            🔗 URL: /blog/{formData.slug || 'slug'}
          </p>
        </div>

        {/* Excerpt */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <label className="block text-sm font-medium text-ink-900">
            Excerpt
            <span className="text-xs text-ink-400 font-normal ml-1">(short description for lists)</span>
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
            placeholder="A brief summary of your post..."
            maxLength={200}
            rows={2}
            className="mt-2 w-full rounded border border-gray-300 bg-white px-4 py-2 text-ink-900 placeholder-ink-400 transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-20"
          />
          <p className="mt-1 text-xs text-ink-400">
            {formData.excerpt.length}/200
          </p>
        </div>

        {/* Cover Image */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <label className="block text-sm font-medium text-ink-900 mb-3">
            Cover Image
          </label>
          {formData.cover_image && (
            <div className="mb-4 overflow-hidden rounded-lg">
              <img
                src={formData.cover_image}
                alt={formData.cover_alt}
                className="h-48 w-full object-cover"
              />
            </div>
          )}
          <BlogImageUpload onImageUpload={handleImageUpload} />
          {formData.cover_image && (
            <input
              type="text"
              value={formData.cover_alt}
              onChange={(e) => setFormData((prev) => ({ ...prev, cover_alt: e.target.value }))}
              placeholder="Alt text for image"
              className="mt-3 w-full rounded border border-gray-300 bg-white px-4 py-2 text-sm text-ink-900 placeholder-ink-400 transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-20"
            />
          )}
        </div>

        {/* Content Editor */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <label className="block text-sm font-medium text-ink-900 mb-3">
            Content
            <span className="text-red-500">*</span>
          </label>
          <BlogEditor
            value={formData.content}
            onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
            placeholder="Start writing your blog post..."
          />
        </div>

        {/* SEO Settings */}
        <BlogSEO blog={formData} onChange={handleSEOChange} />

        {/* Publish Toggle */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-brand-600 transition"
            />
            <div>
              <p className="font-medium text-ink-900">Publish this post</p>
              <p className="text-xs text-ink-500">
                Uncheck to save as draft
              </p>
            </div>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('..')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
