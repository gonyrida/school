/**
 * SITE CONFIG
 * ===========
 * Single source of truth for site-wide values that feed SEO meta tags,
 * structured data, the sitemap generator, and the OG/Twitter cards.
 *
 * In a production deployment, set `siteUrl` to your actual domain and update
 * `social` + `school` with the school's real contact details.
 */

export const siteConfig = {
  /** Public name of the website. Appears in `<title>` and og:site_name. */
  siteName: 'Norol Iman High School',

  /** Tagline used as default description when a page doesn't override. */
  defaultDescription:
    'A modern learning environment rooted in faith and excellence. Norol Iman Chroy Metrey School (NICS) — Phnom Penh, Cambodia.',

  /**
   * Production URL (no trailing slash). Used for canonical tags, OG, sitemap.
   * If you deploy to a different domain, change this value — that's the only
   * place it needs to be updated.
   */
  siteUrl: import.meta.env?.VITE_SITE_URL ?? 'https://norol-iman.edu.kh',

  /** Default social-share image. Should be ~1200×630 for OG, ~1200×600 for Twitter. */
  defaultOgImage: '/og-default.jpg',

  /** Default site language code. */
  defaultLocale: 'en',

  /** Social handles for Twitter Card metadata. Leave as empty string if unused. */
  social: {
    twitter: '', // e.g. '@norolimansch'
    facebook: '', // e.g. 'https://facebook.com/norolimansch'
  },

  /**
   * School information that feeds JSON-LD structured data.
   * Search engines use this for Knowledge Panel info, rich snippets, etc.
   */
  school: {
    legalName: 'Norol Iman Chroy Metrey School',
    alternateName: 'NICS',
    foundingDate: '2010',
    address: {
      streetAddress: '',
      addressLocality: 'Phnom Penh',
      addressCountry: 'KH',
    },
    contactPoint: {
      telephone: '+855-12-345-678',
      email: 'info@norol-iman.edu.kh',
    },
    sameAs: [
      // Facebook/Instagram/etc. profile URLs — fill in when available
    ] as string[],
  },
};

/**
 * Build a canonical URL by appending a route to `siteUrl`.
 * Examples: canonicalUrl('/') -> 'https://...edu.kh/'
 *           canonicalUrl('/about/school') -> 'https://...edu.kh/about/school'
 */
export function canonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.siteUrl.replace(/\/$/, '')}${cleanPath}`;
}
