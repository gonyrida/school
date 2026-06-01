import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlogBySlug } from '@/hooks/useBlogs';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Loader } from 'lucide-react';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { blog, loading, error } = useBlogBySlug(slug || '');

  if (!slug) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-page text-center">
          <p className="text-ink-500">Blog not found</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-page flex justify-center">
          <Loader className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-page">
          <button
            onClick={() => navigate('/blog')}
            className="mb-8 inline-flex items-center gap-2 text-brand-600 transition hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </button>
          <p className="text-ink-500">Blog post not found</p>
        </div>
      </div>
    );
  }

  // Prepare SEO title - use custom SEO title if available, otherwise default
  const seoTitle = blog.seo?.title || `${blog.title} | Norol Iman High School Blog`;
  const seoDescription = blog.seo?.description || blog.excerpt || blog.content.substring(0, 150);
  const seoKeywords = blog.seo?.keywords || '';
  const ogImage = blog.seo?.ogImage || blog.cover_image;
  const canonicalUrl = `${window.location.origin}/blog/${slug}`;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        {seoKeywords && <meta name="keywords" content={seoKeywords} />}
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.seo?.ogTitle || blog.title} />
        <meta property="og:description" content={blog.seo?.ogDescription || seoDescription} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:url" content={canonicalUrl} />
        
        {/* Article */}
        <meta property="article:published_time" content={blog.created_at} />
        <meta property="article:modified_time" content={blog.updated_at} />
        <meta property="article:author" content="Norol Iman High School" />
        
        {/* Canonical */}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Cover Image */}
        {blog.cover_image && (
          <div className="h-96 w-full overflow-hidden bg-gray-100">
            <img
              src={blog.cover_image}
              alt={blog.cover_alt || blog.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="bg-white py-16">
          <div className="container-page max-w-2xl">
            {/* Back Button */}
            <button
              onClick={() => navigate('/blog')}
              className="mb-8 inline-flex items-center gap-2 text-brand-600 transition hover:text-brand-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to blog
            </button>

            {/* Article Header */}
            <article>
              <header className="mb-8 border-b border-gray-200 pb-8">
                <h1 className="font-display text-4xl font-bold text-ink-900">
                  {blog.title}
                </h1>
                <div className="mt-4 flex items-center gap-4 text-sm text-ink-500">
                  <time dateTime={blog.created_at}>
                    {formatDate(blog.created_at)}
                  </time>
                  {blog.updated_at !== blog.created_at && (
                    <>
                      <span>•</span>
                      <span>Updated {formatDate(blog.updated_at)}</span>
                    </>
                  )}
                </div>
              </header>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none text-ink-900 [&>*:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </article>

            {/* Related Articles */}
            <div className="mt-16 border-t border-gray-200 pt-8">
              <p className="text-sm font-semibold text-ink-500">
                👉 Want to read more? Visit the <a href="/blog" className="text-brand-600 hover:text-brand-700">blog home</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
