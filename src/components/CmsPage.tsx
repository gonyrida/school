import { useEffect } from 'react';
import { useCmsPage } from '@/hooks/useCmsPage';
import { PageRenderer } from '@/cms/renderer/PageRenderer';

interface Props {
  pageKey: string;
  /** Optional fallback to render if the CMS page isn't yet loaded or doesn't exist. */
  fallback?: React.ReactNode;
}

/**
 * CmsPage — drop-in component that renders any CMS-backed page.
 *
 * Usage in routes (replaces a hardcoded page component):
 *
 *   <Route path="curriculum" element={<CmsPage pageKey="curriculum" />} />
 *
 * The page's content (sections, copy, images, SEO) all come from the CMS,
 * so admins can change them without touching code.
 */
export function CmsPage({ pageKey, fallback }: Props) {
  const { page, loading } = useCmsPage(pageKey);

  // Apply SEO metadata
  useEffect(() => {
    if (!page) return;
    const title = page.seo.metaTitle || page.title;
    if (title) document.title = `${title} | Norol Iman High School`;

    const ensureMeta = (name: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.name = name;
        document.head.appendChild(el);
      }
      return el;
    };
    const ensureOg = (property: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      return el;
    };

    if (page.seo.metaDescription) {
      ensureMeta('description').content = page.seo.metaDescription;
      ensureOg('og:description').content = page.seo.metaDescription;
    }
    if (page.seo.ogImage?.url) {
      ensureOg('og:image').content = page.seo.ogImage.url;
    }
    ensureOg('og:title').content = title;
  }, [page]);

  if (loading) {
    return (
      <div className="container-page py-32 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-brand-700 border-t-transparent" />
      </div>
    );
  }

  if (!page) {
    return (
      <>
        {fallback ?? (
          <div className="container-page py-32 text-center">
            <p className="eyebrow text-brand-700">Page not found</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-ink-900">
              This page hasn't been published yet
            </h1>
          </div>
        )}
      </>
    );
  }

  return <PageRenderer page={page} />;
}
