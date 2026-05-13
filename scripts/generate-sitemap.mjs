#!/usr/bin/env node
/* eslint-env node */
/**
 * Sitemap generator
 * =================
 * Outputs `public/sitemap.xml` so search engines can discover all pages.
 *
 * Run as part of the build: `npm run sitemap` (also runs automatically via
 * the `prebuild` script).
 *
 * Inputs:
 *  - PAGE_REGISTRY (always available)
 *  - Published events (only if VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
 *    are set in the environment)
 *
 * The script never fails the build: if Supabase isn't configured, events
 * are silently skipped and only the static pages end up in the sitemap.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ─────────────────────────────────────────────────────────────────────────────
// Config — duplicated here so this script doesn't need to import TS files
// ─────────────────────────────────────────────────────────────────────────────

const SITE_URL = (
  process.env.VITE_SITE_URL || 'https://officemuckup.com'
).replace(/\/$/, '');

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/about/school', changefreq: 'monthly', priority: 0.9 },
  { path: '/about/leader', changefreq: 'monthly', priority: 0.7 },
  { path: '/about/dormitory', changefreq: 'monthly', priority: 0.7 },
  { path: '/curriculum', changefreq: 'monthly', priority: 0.9 },
  { path: '/curriculum/kindergarten', changefreq: 'monthly', priority: 0.7 },
  { path: '/curriculum/elementary', changefreq: 'monthly', priority: 0.7 },
  { path: '/admissions', changefreq: 'monthly', priority: 0.9 },
  { path: '/events', changefreq: 'weekly', priority: 0.8 },
  { path: '/contact', changefreq: 'monthly', priority: 0.7 },
  { path: '/support', changefreq: 'monthly', priority: 0.6 },
];


// ─────────────────────────────────────────────────────────────────────────────
// Fetch events from Supabase (best-effort)
// ─────────────────────────────────────────────────────────────────────────────

async function fetchPublishedEvents() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.log('[sitemap] Supabase env vars not set — skipping events.');
    return [];
  }
  try {
    const res = await fetch(
      `${url}/rest/v1/events?status=eq.published&select=slug,updated_at,event_date`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      },
    );
    if (!res.ok) {
      console.warn(`[sitemap] Supabase responded ${res.status} — skipping events.`);
      return [];
    }
    const rows = await res.json();
    return rows.map((r) => ({
      path: `/events/${r.slug}`,
      lastmod: r.updated_at || r.event_date,
      changefreq: 'monthly',
      priority: 0.6,
    }));
  } catch (err) {
    console.warn('[sitemap] Failed to fetch events:', err.message);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Build XML
// ─────────────────────────────────────────────────────────────────────────────

function xmlEscape(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry({ path, lastmod, changefreq, priority }) {
  const loc = `${SITE_URL}${path}`;
  const parts = [`  <url>`, `    <loc>${xmlEscape(loc)}</loc>`];
  if (lastmod) parts.push(`    <lastmod>${xmlEscape(lastmod)}</lastmod>`);
  if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority !== undefined) parts.push(`    <priority>${priority}</priority>`);
  parts.push(`  </url>`);
  return parts.join('\n');
}

async function main() {
  const events = await fetchPublishedEvents();
  const today = new Date().toISOString().split('T')[0];

  const allRoutes = [
    ...STATIC_ROUTES.map((r) => ({ ...r, lastmod: today })),
    ...events,
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allRoutes.map(urlEntry),
    '</urlset>',
    '',
  ].join('\n');

  const outDir = resolve(ROOT, 'public');
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');

  console.log(
    `[sitemap] Wrote ${allRoutes.length} URLs to ${outPath} (${events.length} events).`,
  );
}

main().catch((err) => {
  console.error('[sitemap] Failed:', err);
  process.exit(0); // never fail the build
});
