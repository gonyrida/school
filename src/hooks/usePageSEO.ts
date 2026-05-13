import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig, canonicalUrl } from '@/lib/siteConfig';

/**
 * usePageSEO — applies a full set of SEO tags to <head> at render time:
 *  - <title>
 *  - meta description
 *  - canonical URL
 *  - Open Graph (Facebook, LinkedIn, WhatsApp, …)
 *  - Twitter Card
 *  - JSON-LD structured data (optional)
 *
 * Single-page apps inject these client-side. Search crawlers (Google,
 * Bing, DuckDuckGo) execute JS and read the resulting DOM, so they'll
 * see these tags fine. Some social previews (older Facebook scrapers,
 * Slack on first visit) need server-rendered tags — for those, deploy
 * behind a service like Cloudflare Workers / Vercel Edge to inject the
 * tags into the initial HTML response. See README for prerender notes.
 */

export interface SEOInput {
  /** Page title (without the site-name suffix — that's appended automatically). */
  title?: string;
  /** Meta description; falls back to siteConfig.defaultDescription. */
  description?: string;
  /** Image URL for og:image and twitter:image. Should be absolute. */
  ogImage?: string;
  /** Override the canonical path. Defaults to current pathname. */
  canonicalPath?: string;
  /** ISO language code ('en', 'km', 'ar', …). */
  locale?: string;
  /** og:type — 'website' for most pages, 'article' for blog/news posts. */
  type?: 'website' | 'article';
  /** Optional ISO date for article published time. */
  publishedTime?: string;
  /** Optional ISO date for article modified time. */
  modifiedTime?: string;
  /** Optional JSON-LD object. Will be JSON.stringify'd into a script tag. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function usePageSEO(input: SEOInput) {
  const location = useLocation();

  useEffect(() => {
    const titleValue = input.title
      ? `${input.title} | ${siteConfig.siteName}`
      : siteConfig.siteName;
    document.title = titleValue;

    const description = input.description ?? siteConfig.defaultDescription;
    const ogImage = absoluteUrl(input.ogImage ?? siteConfig.defaultOgImage);
    const canonical = canonicalUrl(input.canonicalPath ?? location.pathname);

    // Apply meta tags
    setMeta('description', description);
    setLink('canonical', canonical);

    // Open Graph
    setOg('og:type', input.type ?? 'website');
    setOg('og:site_name', siteConfig.siteName);
    setOg('og:locale', input.locale ?? siteConfig.defaultLocale);
    setOg('og:title', input.title ?? siteConfig.siteName);
    setOg('og:description', description);
    setOg('og:url', canonical);
    setOg('og:image', ogImage);
    setOg('og:image:width', '1200');
    setOg('og:image:height', '630');
    if (input.type === 'article') {
      if (input.publishedTime) setOg('article:published_time', input.publishedTime);
      if (input.modifiedTime) setOg('article:modified_time', input.modifiedTime);
    }

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', input.title ?? siteConfig.siteName);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);
    if (siteConfig.social.twitter) {
      setMeta('twitter:site', siteConfig.social.twitter);
      setMeta('twitter:creator', siteConfig.social.twitter);
    }

    // JSON-LD structured data — render into a single managed script tag
    setJsonLd(input.jsonLd);
  }, [
    input.title,
    input.description,
    input.ogImage,
    input.canonicalPath,
    input.locale,
    input.type,
    input.publishedTime,
    input.modifiedTime,
    // JSON-LD is compared by reference; callers should memoize complex objects
    input.jsonLd,
    location.pathname,
  ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setOg(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.href = href;
}

const JSON_LD_ID = 'page-jsonld';

function setJsonLd(data: SEOInput['jsonLd']) {
  // Always remove existing script first so we don't leak stale data between routes
  document.getElementById(JSON_LD_ID)?.remove();
  if (!data) return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = JSON_LD_ID;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function absoluteUrl(maybeRelative: string): string {
  if (/^https?:\/\//.test(maybeRelative)) return maybeRelative;
  if (maybeRelative.startsWith('/')) {
    return `${siteConfig.siteUrl.replace(/\/$/, '')}${maybeRelative}`;
  }
  return `${siteConfig.siteUrl.replace(/\/$/, '')}/${maybeRelative}`;
}

/**
 * Default site-wide JSON-LD: describes the school as an EducationalOrganization.
 * Use this on the home page; pages with more specific content (events,
 * articles) can provide their own.
 */
export function organizationJsonLd() {
  const { school } = siteConfig;
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: school.legalName,
    alternateName: school.alternateName,
    url: siteConfig.siteUrl,
    foundingDate: school.foundingDate,
    address: {
      '@type': 'PostalAddress',
      ...school.address,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'admissions',
      ...school.contactPoint,
    },
    sameAs: school.sameAs,
  };
}
