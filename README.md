# Norol Iman High School — Website + CMS

A production-style React/Vite site with a section-based CMS built into the existing admin dashboard. Admins manage every page, news/event, image, and SEO field without touching code; the public site renders dynamically from CMS data.

The public website UI was **not redesigned** — only the admin dashboard was extended into a full CMS, and existing public pages were rewired to read from CMS data instead of hardcoded content.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

The CMS works in two modes:

1. **Demo mode (default)** — runs without any backend. All pages, events, and images persist in browser localStorage. Perfect for design review and exploring the CMS.
2. **Production (Supabase)** — set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`. The app auto-detects Supabase and routes everything through it.

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Build

```bash
npm run build        # type-check + production bundle
npm run preview      # preview the prod build
```

---

## CMS architecture

```
┌─────────────────────────┐         ┌──────────────────────┐
│  Admin dashboard        │         │  Public website      │
│  /dashboard/pages       │         │  /, /about/school…   │
│  /dashboard/events      │         └──────────┬───────────┘
│  /dashboard/media       │                    │
└────────────┬────────────┘                    │
             │ writes                          │ reads
             ▼                                 ▼
       ┌───────────────────────────────────────────┐
       │   cms API (single interface)              │
       │   src/cms/api/index.ts                    │
       └────┬─────────────────────────────────┬────┘
            │ if Supabase configured          │ otherwise
            ▼                                 ▼
       ┌──────────┐                    ┌─────────────┐
       │ Supabase │                    │ localStorage│
       │ Postgres │                    │ (demo mode) │
       └──────────┘                    └─────────────┘
```

Every part of the system flows through the `cms` API in `src/cms/api/index.ts`. The admin writes; the public site reads. Nothing is hardcoded except fallback content.

### Section-based pages

A page is just an ordered list of **sections**. Each section has:

| Field | Purpose |
|---|---|
| `id` | UUID |
| `type` | One of 12 registered types (`hero`, `cards`, `gallery`, …) |
| `data` | Type-specific object validated by Zod |
| `visible` | Toggle to hide without deleting |
| `order` | Drag-and-drop position |

The same data shape powers both the admin editor and the public renderer.

---

## Folder structure

```
src/
├── App.tsx                         Routes (public + admin)
├── components/
│   ├── CmsPage.tsx                 Drop-in CMS-driven page wrapper
│   ├── auth/ProtectedRoute.tsx
│   ├── layout/                     Header, Footer, DashboardLayout
│   └── ui/, sections/              Existing public-site UI (unchanged)
│
├── cms/                            ───────── CMS lives here ─────────
│   ├── schema/
│   │   ├── sections.ts             Zod schemas for every section type
│   │   └── pages.ts                Page registry + default sections
│   │
│   ├── api/
│   │   ├── index.ts                CMSApi interface + Supabase impl
│   │   └── localStore.ts           localStorage fallback
│   │
│   ├── store/
│   │   ├── pageEditor.ts           Zustand: page being edited
│   │   └── mediaStore.ts           Zustand: media library
│   │
│   ├── renderer/
│   │   ├── sectionRenderers.tsx    One React component per section type
│   │   └── PageRenderer.tsx        Dynamic dispatcher (type → component)
│   │
│   └── admin/
│       ├── components/             RichTextEditor, MediaPicker,
│       │                            ConfirmDialog, Breadcrumbs, Skeleton
│       ├── sectionEditor/
│       │   ├── fieldConfig.ts      Form field definitions per type
│       │   ├── FieldRenderer.tsx   Renders any field config to UI
│       │   ├── SectionList.tsx     Drag-and-drop list of sections
│       │   ├── SectionPicker.tsx   "Add section" modal
│       │   └── SectionEditorPanel.tsx
│       └── pages/
│           ├── PagesListPage.tsx
│           ├── PageBuilderPage.tsx 3-column editor (list / preview / form)
│           ├── PageSettingsDrawer.tsx (status + SEO)
│           ├── EventsListPage.tsx
│           ├── EventEditPage.tsx
│           └── MediaLibraryPage.tsx
│
├── hooks/
│   ├── useAuth.tsx
│   └── useCmsPage.ts               Fetch a CMS page by key
│
├── lib/
│   └── supabase.ts
│
└── pages/                          Public + dashboard route components
```

---

## Section types

Twelve types ship with the CMS. Each has a Zod schema, a renderer, and an editor field config — all three must agree.

| Type | Use for |
|---|---|
| `hero` | Top-of-page headline with optional CTA buttons |
| `banner` | Full-width promo strip |
| `rich_text` | TipTap-edited prose |
| `stats` | Numerical highlights (e.g. "500+ students") |
| `cards` | Grid of cards (image + title + description + link) |
| `gallery` | Image grid, masonry, or carousel |
| `principal_message` | Quote from leadership with portrait |
| `cta` | Conversion-focused block with buttons |
| `testimonials` | Quotes from parents/students |
| `faq` | Accordion of Q&A |
| `video` | YouTube/Vimeo embed |
| `timeline` | Numbered steps (e.g. admissions process) |

### Adding a new section type

Four files. Pattern is the same every time.

1. **Schema** — add a Zod schema and register it in `src/cms/schema/sections.ts`:
   ```ts
   export const PricingSectionSchema = z.object({
     title: z.string().min(1),
     plans: z.array(z.object({...})).min(1),
   });
   // ...add 'pricing' to SECTION_TYPES, SECTION_SCHEMAS, SECTION_META
   ```
2. **Renderer** — build the React component in `src/cms/renderer/sectionRenderers.tsx`.
3. **Component map** — register it in `src/cms/renderer/PageRenderer.tsx` (`SECTION_COMPONENTS`).
4. **Field config** — define form fields in `src/cms/admin/sectionEditor/fieldConfig.ts` (`SECTION_FIELDS`).

That's it. The new type now appears in the section picker, has a working editor form, and renders on the public site.

### Per-page section restrictions

`src/cms/schema/pages.ts` lists every CMS-managed page and (optionally) restricts which section types are allowed. Example:

```ts
{
  key: 'about/leader',
  allowedSections: ['hero', 'principal_message', 'cards', 'rich_text'],
  defaultSections: [...],
}
```

The admin section picker filters available types per page automatically.

---

## Database schema (Supabase)

Run this SQL in your Supabase project to set up the schema.

```sql
-- ─────────────────────────────────────────────────────────────────
-- Profiles (admin/editor accounts)
-- ─────────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────
-- Pages (one row per CMS-managed page)
-- ─────────────────────────────────────────────────────────────────
create table public.pages (
  key text primary key,
  title text not null,
  description text default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  sections jsonb not null default '[]'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
create index pages_status_idx on public.pages(status);

-- ─────────────────────────────────────────────────────────────────
-- Events (news + events)
-- ─────────────────────────────────────────────────────────────────
create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text default '',
  body text default '',
  category text not null check (category in ('Academy', 'Sports', 'Arts', 'Community')),
  tags text[] default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  cover_image text,
  cover_alt text,
  gallery jsonb default '[]'::jsonb,
  event_date date,
  seo jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index events_status_idx on public.events(status);
create index events_category_idx on public.events(category);
create index events_event_date_idx on public.events(event_date desc);

-- ─────────────────────────────────────────────────────────────────
-- Media library
-- ─────────────────────────────────────────────────────────────────
create table public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  filename text not null,
  folder text not null default 'uploads',
  alt text default '',
  mime_type text not null,
  size integer not null,
  created_at timestamptz default now()
);
create index media_folder_idx on public.media(folder);
create index media_created_at_idx on public.media(created_at desc);

-- ─────────────────────────────────────────────────────────────────
-- Storage bucket (run in Supabase Storage)
-- ─────────────────────────────────────────────────────────────────
-- Create a public bucket named 'media' via the Supabase dashboard,
-- or with this SQL:
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict do nothing;
```

### Row-level security

```sql
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.events enable row level security;
alter table public.media enable row level security;

-- Helper: is the caller an admin/editor?
create or replace function public.is_editor() returns boolean as $$
  select exists(
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  )
$$ language sql stable security definer;

-- Profiles: read your own; admins can read all
create policy "profiles_read_own" on public.profiles
  for select using (auth.uid() = id or public.is_editor());

-- Pages: published pages readable by everyone; admins can read drafts and write
create policy "pages_read_published" on public.pages
  for select using (status = 'published' or public.is_editor());
create policy "pages_write_editor" on public.pages
  for all using (public.is_editor()) with check (public.is_editor());

-- Events: same model
create policy "events_read_published" on public.events
  for select using (status = 'published' or public.is_editor());
create policy "events_write_editor" on public.events
  for all using (public.is_editor()) with check (public.is_editor());

-- Media: read by anyone, write by editors
create policy "media_read_all" on public.media for select using (true);
create policy "media_write_editor" on public.media
  for all using (public.is_editor()) with check (public.is_editor());

-- Storage bucket: public read, authenticated write
create policy "media_storage_read" on storage.objects
  for select using (bucket_id = 'media');
create policy "media_storage_write" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "media_storage_delete" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
```

### Creating the first admin user

The project ships with **no baked-in credentials**. After running the schema:

1. Go to Supabase → Authentication → Users → "Add user", create one with email + password.
2. Insert a matching `profiles` row with `role = 'admin'`:
   ```sql
   insert into public.profiles (id, full_name, role)
   values ('<uuid-from-auth.users>', 'Your Name', 'admin');
   ```
3. Sign in at `/login`.

If Supabase is not configured, the dashboard is open in demo mode at `/dashboard`.

---

## Admin workflow

### Edit a page

1. Dashboard → **Pages** → click any page row.
2. Drag sections in the left rail to reorder.
3. Click any section to edit its fields in the right panel.
4. Eye icon hides a section without deleting; copy duplicates; trash deletes.
5. Click **Save**. Use **Publish** in Settings to make the page live.
6. **View live** opens the public page in a new tab.

### Add a section

Click **Add section** at the bottom of the section list. The picker shows only types allowed for the current page, grouped by category (Header / Content / Media / Conversion). Each new section is seeded with sensible defaults.

### News & events

Dashboard → **News & Events** → New event. The form supports:

- Title, slug (auto-generated from title, editable), excerpt, body (TipTap)
- Category, tags, event date, status (draft/published)
- Cover image, gallery
- Full SEO subform (meta title with 60-char counter, meta description with 160-char counter, OG image)

Save Draft writes without publishing. Publish makes it live and visible in `/events`.

### Media library

Dashboard → **Media Library** for full-screen browsing. Drag-and-drop upload, folder filter, search, multi-select with bulk delete, click any image to edit alt text.

The **media picker** modal opens from any image field in the section editor — same library, smaller window, with a folder hint defaulted to the current context (e.g. picking a hero background defaults to the `hero` folder).

---

## Dynamic rendering

The `<CmsPage pageKey="..." />` component is a drop-in for any public route:

```tsx
// in App.tsx
<Route path="curriculum" element={<CmsPage pageKey="curriculum" fallback={<CurriculumOverviewPage />} />} />
```

It fetches the page from the CMS, applies SEO (`document.title`, meta tags, OG), and feeds the page through `<PageRenderer>`. The renderer sorts sections by `order`, looks up each `type` in `SECTION_COMPONENTS`, validates `data` against the Zod schema, and renders.

If the CMS hasn't loaded yet (first visit, no Supabase configured, etc.), the optional `fallback` keeps the original hardcoded page rendering — so the site never goes blank during a transition.

---

## Tech stack

- **React 18** + **Vite** + **TypeScript** (strict)
- **Tailwind CSS** with the existing design tokens (brand color `#1f2f7d`, Plus Jakarta Sans + Inter)
- **react-router-dom v6** for routing
- **Zustand** for client-side state (page editor, media library)
- **Zod** for schema validation
- **react-hook-form** + `@hookform/resolvers` for the events form
- **TipTap v2** for the rich text editor
- **@dnd-kit** for drag-and-drop
- **react-hot-toast** for toast notifications
- **framer-motion** for the existing public-site animations
- **lucide-react** for icons
- **@supabase/supabase-js** for the production backend

---

## Best practices baked in

- **Schema-first.** Every section type has a single source of truth in Zod. The editor form, the renderer, and the persistence layer all read from it.
- **No hardcoded content** on CMS-backed pages. The public site renders from data, not from JSX.
- **Type-safe end-to-end.** TypeScript strict mode, no `any` in the public API surface.
- **Validation on render.** A bad `data` payload shows a clear error in dev and silently skips in prod, so a corrupted draft never crashes the site.
- **Progressive backend.** localStorage in demo, Postgres + Storage in production. Identical interface either way.
- **Pessimistic save.** Editor never auto-saves mid-edit; admins explicitly click Save. The browser also warns on unload if there are unsaved changes.
- **Per-page section restrictions** prevent admins from putting a "principal message" section on the contact page.
- **Permission model** via RLS — published content is public, drafts are admin-only.
- **Code-split bundles** for TipTap, dnd-kit, Supabase, framer-motion (see `vite.config.ts`).

---

## What's deferred

A few things were intentionally left for follow-up rather than half-done:

- **Versioning / undo history.** Each save overwrites the previous version. Adding a `page_revisions` table is straightforward when needed.
- **Scheduled publishing.** Status is binary (draft/published). A `publish_at` timestamp + a daily cron would add scheduling.
- **Image optimization.** Uploads are stored as-is. A serverless function that creates WebP variants on upload would help large galleries.
- **Multi-language.** Schema supports a single locale. Adding `locale` to page rows + a language switcher is the path.
- **User management UI.** The Users page is a placeholder — admin creation is currently done via the Supabase dashboard + SQL.
- **Real-time collaboration.** Two editors editing the same page will last-write-wins. Adding Supabase Realtime channels would prevent it.

None of these blocks the CMS from being production-usable today.
