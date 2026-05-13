import { useMemo } from 'react';
import { useCmsPage } from '@/hooks/useCmsPage';
import { PageRenderer } from '@/cms/renderer/PageRenderer';
import { usePageSEO, organizationJsonLd } from '@/hooks/usePageSEO';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  pageKey: string;
  /** Optional fallback to render if the CMS page isn't yet loaded or doesn't exist. */
  fallback?: React.ReactNode;
}

/**
 * CmsPage — drop-in component that renders any CMS-backed page.
 *
 * Usage in routes:
 *   <Route path="curriculum" element={<CmsPage pageKey="curriculum" />} />
 *
 * Handles:
 *  - fetching page data via cms.getPage(key)
 *  - applying all SEO tags (title, description, canonical, OG, Twitter, JSON-LD)
 *  - dynamic rendering of every section via PageRenderer
 */
export function CmsPage({ pageKey, fallback }: Props) {
  const { page, loading } = useCmsPage(pageKey);
  const { language } = useLanguage();

  // Compute SEO inputs — falls back to page title if metaTitle is empty,
  // falls back to first hero/banner title if `page.title` is empty too.
  const seoInputs = useMemo(() => {
    if (!page) {
      return {
        title: 'Loading…',
        description: undefined,
        canonicalPath: pageKey === 'home' ? '/' : `/${pageKey}`,
      };
    }
    const heroTitle =
      page.sections.find((s) => s.type === 'hero')?.data?.title as string | undefined;
    const title = page.seo.metaTitle || page.title || heroTitle;
    return {
      title,
      description: page.seo.metaDescription || undefined,
      ogImage: page.seo.ogImage?.url,
      canonicalPath: page.seo.slug || (pageKey === 'home' ? '/' : `/${pageKey}`),
      locale: language,
      // Attach organization JSON-LD on the home page so search engines
      // pick up the school identity. Other pages omit JSON-LD by default;
      // individual section types could provide their own in the future
      // (e.g. event pages → Event schema, FAQ → FAQPage schema).
      jsonLd: pageKey === 'home' ? organizationJsonLd() : undefined,
    };
  }, [page, pageKey, language]);

  usePageSEO(seoInputs);

  if (loading) {
    return (
      <div className="container-page py-32 text-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-brand-700 border-t-transparent"
          aria-label="Loading page"
        />
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
