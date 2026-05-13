# CMS v4 changelog

This pass added support for managing the Contact and News & Events pages
through the "Add Section" system, expanded the Card Grid with per-card
customization, made section title alignment apply to the title only, and
shipped a comprehensive SEO suite.

## What changed (file index)

```
src/
├── lib/siteConfig.ts                                  NEW  Site-wide SEO + JSON-LD config
├── hooks/usePageSEO.ts                                NEW  Centralized meta tag injection
├── cms/
│   ├── schema/
│   │   ├── sections.ts                                UPD  CardItem, CardsSection, +contact_info, contact_form, map
│   │   ├── defaults.ts                                UPD  New section defaults
│   │   └── pages.ts                                   UPD  Contact + Events seeded with rich content
│   ├── admin/sectionEditor/fieldConfig.ts             UPD  Card grid options, contact sections
│   └── renderer/
│       ├── sectionRenderers.tsx                       UPD  + ContactInfoRenderer, ContactFormRenderer, MapRenderer
│       └── PageRenderer.tsx                           UPD  Register new types
├── components/CmsPage.tsx                             UPD  Uses usePageSEO + structured data
├── pages/EventDetailPage.tsx                          UPD  Article JSON-LD + canonical
├── App.tsx                                            UPD  Contact + Events route through CmsPage
scripts/generate-sitemap.mjs                           NEW  Sitemap generator
public/robots.txt                                      NEW  Crawler rules
index.html                                             UPD  Default OG/Twitter tags
package.json                                           UPD  prebuild → generate-sitemap
```

## SEO suite

### Per-page meta tags

Every CMS-managed page now gets a complete tag set on render — title,
description, canonical, Open Graph (Facebook, LinkedIn, WhatsApp),
Twitter Card, and structured data — all driven from the CMS page's SEO
fields plus `siteConfig.ts`.

### Sitemap

`public/sitemap.xml` is generated automatically before every `npm run build`
(via the `prebuild` script). It includes:

- All registered static pages from `PAGE_REGISTRY`
- All published events (fetched from Supabase if env vars are set)

To regenerate manually: `npm run sitemap`.

### Configure for your domain

In `src/lib/siteConfig.ts`, update:

- `siteUrl` — your production domain (no trailing slash)
- `defaultOgImage` — path to your default social-share image
- `social.twitter` — Twitter handle (e.g. `@norolimansch`) for Twitter Cards
- `school` — legal name, founding date, address, contact details (these feed
  the JSON-LD Knowledge Panel data)

You can also set `VITE_SITE_URL` in `.env.production` to override `siteUrl`
without editing the source.

### Default social-share image

The `index.html` and `siteConfig.ts` reference `/og-default.jpg`. Place a
1200×630 image at `public/og-default.jpg` for proper social previews.
Without this file, pages will still render and be indexable, but link
previews on Facebook/Slack/Discord/etc. will not show an image.

### About client-side meta tags

This is a single-page React app, so meta tags are injected client-side via
`usePageSEO`. Google, Bing, and DuckDuckGo all execute JavaScript when
crawling and will read these tags correctly.

Some social-media scrapers (older Facebook crawlers, Slack on first visit)
don't execute JS and only see the defaults in `index.html`. If that matters
for your launch, deploy behind a service that injects route-specific meta
tags into the HTML response:

- **Vercel / Netlify** support Edge Functions / Edge Middleware
- **Cloudflare Workers** can rewrite HTML at the edge
- Or pre-render routes to static HTML with `vite-plugin-ssr` / Astro

The `usePageSEO` hook is structured so the same data can be consumed by a
prerender step later — no code rewrite needed.

### Structured data (JSON-LD)

The home page emits `EducationalOrganization` structured data — feeds the
Google Knowledge Panel with the school name, address, contact, and social
profiles. Event detail pages emit `Article` schema with headline, image,
publish/modified dates, and keywords.

### Image optimization

`<img>` tags throughout the renderer use the browser's lazy-loading
behavior by default (browsers lazy-load images below the fold). For images
above the fold that you want eagerly fetched, set `loading="eager"`
explicitly.

For best image performance:

1. Upload images at no larger than 2× the displayed size (e.g. 2400px for
   a hero shown at 1200px).
2. Prefer WebP (smaller than JPG/PNG at the same quality). The media
   library accepts all of JPG, PNG, WebP, GIF.
3. To bulk-optimize uploaded images, install `sharp` and run a script
   against your Supabase storage bucket. Skeleton:

   ```js
   // scripts/optimize-images.mjs
   import sharp from 'sharp';
   import { createClient } from '@supabase/supabase-js';
   const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SERVICE_ROLE_KEY);
   const { data } = await sb.storage.from('media').list();
   for (const file of data ?? []) {
     const { data: blob } = await sb.storage.from('media').download(file.name);
     const optimized = await sharp(await blob.arrayBuffer()).webp({ quality: 80 }).toBuffer();
     await sb.storage.from('media').update(file.name, optimized, { contentType: 'image/webp' });
   }
   ```

### Performance

- Code-split chunks: TipTap, dnd-kit, Supabase, framer-motion, React all
  in separate vendor bundles.
- Fonts preconnected in `index.html`.
- Build output ~205 KB gzip for the app, plus 53 KB for React/Supabase
  vendor each — fully usable on 3G.

## Card Grid additions

Per the request:

- **1-column layout** — new option in the layout dropdown (constrained to
  ~max-w-2xl so it doesn't stretch full-width).
- **Last card position for 2-column layouts** — when the total card count
  is odd, the lonely last card can sit left (default), centered, or right.
  Only shown in the editor when layout = grid-2.
- **Per-card background** — 8 presets (Default, None, White, Soft, Muted,
  Brand, Dark, Custom color) including admin-pickable color. Cards with
  Brand/Dark backgrounds automatically flip to white text.
- **Card button** — every card can have its own button with primary /
  outline / ghost variants, plus button alignment (left / center / right).
- **Description + List together** — new `Both` description mode renders
  the paragraph and the bullet list stacked.
- **Title-only alignment** — `titleAlign` now affects just the `<h2>`,
  not the surrounding eyebrow / description block.

## Contact page

The contact page is now fully CMS-managed via three new section types:

- **Contact Info** (`contact_info`) — labeled cards for address, phone,
  email. Each item has icon (lucide name), label, value, optional
  click-through URL (mailto:, tel:, https://maps...).
- **Contact Form** (`contact_form`) — editable form labels, submit
  button text, success message, and an optional `submitUrl` (works with
  Formspree, Netlify Forms, or any POST endpoint accepting JSON).
- **Map** (`map`) — embed any Google Maps URL with small/medium/large
  height presets.

All three are available in the Section Picker under the **Contact**
category, and can be used on any page (not just the contact page).

## Events page

Events page is now CMS-managed: admins can add hero, intro text, events
feed, CTA, etc. The default seed includes an `events_feed` section that
pulls the latest 12 published events automatically — no code changes
needed when new events are published.

## Migration notes

Existing pages with the old shape continue to work. The runtime migration
in `src/cms/schema/migrations.ts` upgrades them silently:

- Old card data (with top-level `image`/`icon`) → new `visual` shape
- Old `textAlign: 'left'` on cards → kept literal (admin can change to
  "Use section default" to inherit from the section)

If you have existing saved Contact / Events pages in your CMS database,
they'll keep their existing sections and any new defaults from the
registry will NOT be applied automatically. To get the new defaults:

1. Open the page in the admin
2. Use "Add Section" to manually add Contact Info, Contact Form, Map
3. Save

Or to start fresh, delete the row from the `pages` table and the next
load will use the new registry defaults.
