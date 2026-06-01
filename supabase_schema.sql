-- ============================================================
-- School CMS – Supabase database schema
-- Run this once in the Supabase SQL Editor
-- (Dashboard → SQL Editor → New query → paste → Run)
-- ============================================================

-- ── pages ────────────────────────────────────────────────────
create table if not exists public.pages (
  key         text        primary key,
  title       text        not null default '',
  description text,
  status      text        not null default 'draft' check (status in ('draft', 'published')),
  sections    jsonb       not null default '[]'::jsonb,
  seo         jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.pages enable row level security;

-- Allow anyone to read published pages
create policy "Public can read published pages"
  on public.pages for select
  using (status = 'published');

-- Allow authenticated users (admins) full access
create policy "Admins have full access to pages"
  on public.pages for all
  to authenticated
  using (true)
  with check (true);

-- ── events ───────────────────────────────────────────────────
create table if not exists public.events (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        not null unique,
  title       text        not null default '',
  excerpt     text,
  body        text,
  category    text        not null default 'Academy'
                check (category in ('Academy', 'Sports', 'Arts', 'Community')),
  tags        text[]      not null default '{}',
  status      text        not null default 'draft' check (status in ('draft', 'published')),
  cover_image text,
  cover_alt   text,
  gallery     jsonb       not null default '[]'::jsonb,
  event_date  timestamptz,
  seo         jsonb       not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Public can read published events"
  on public.events for select
  using (status = 'published');

create policy "Admins have full access to events"
  on public.events for all
  to authenticated
  using (true)
  with check (true);

-- ── media (metadata table) ───────────────────────────────────
create table if not exists public.media (
  id         uuid        primary key default gen_random_uuid(),
  url        text        not null,
  filename   text        not null default '',
  folder     text        not null default 'uploads',
  alt        text        not null default '',
  mime_type  text        not null default '',
  size       bigint      not null default 0,
  created_at timestamptz not null default now()
);

alter table public.media enable row level security;

create policy "Public can read media"
  on public.media for select
  using (true);

create policy "Admins have full access to media"
  on public.media for all
  to authenticated
  using (true)
  with check (true);

-- ── Storage bucket for media files ───────────────────────────
-- Run this separately if the bucket doesn't already exist:
--
--   insert into storage.buckets (id, name, public)
--   values ('media', 'media', true)
--   on conflict (id) do nothing;
--
--   create policy "Public can read media files"
--     on storage.objects for select
--     using (bucket_id = 'media');
--
--   create policy "Admins can upload media files"
--     on storage.objects for insert
--     to authenticated
--     with check (bucket_id = 'media');
--
--   create policy "Admins can delete media files"
--     on storage.objects for delete
--     to authenticated
--     using (bucket_id = 'media');

-- ── blogs ────────────────────────────────────────────────────
create table if not exists public.blogs (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        not null unique,
  title       text        not null default '',
  excerpt     text,
  content     text        not null,
  cover_image text,
  cover_alt   text,
  published   boolean     not null default false,
  seo         jsonb       not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.blogs enable row level security;

create policy "Public can read published blogs"
  on public.blogs for select
  using (published = true);

create policy "Admins have full access to blogs"
  on public.blogs for all
  to authenticated
  using (true)
  with check (true);

-- ── Storage bucket for blog images ──────────────────────────
-- Run this separately if the bucket doesn't already exist:
--
--   insert into storage.buckets (id, name, public)
--   values ('blog-images', 'blog-images', true)
--   on conflict (id) do nothing;
--
--   create policy "Public can read blog images"
--     on storage.objects for select
--     using (bucket_id = 'blog-images');
--
--   create policy "Admins can upload blog images"
--     on storage.objects for insert
--     to authenticated
--     with check (bucket_id = 'blog-images');
--
--   create policy "Admins can delete blog images"
--     on storage.objects for delete
--     to authenticated
--     using (bucket_id = 'blog-images');
