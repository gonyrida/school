-- ============================================================
-- Blog System Setup - Supabase SQL
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New query
-- ============================================================

-- Step 1: Create blogs table
-- ============================================================
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

-- Step 2: Enable Row Level Security
-- ============================================================
alter table public.blogs enable row level security;

-- Step 3: Create RLS Policy - Public can read published blogs
-- ============================================================
create policy "Public can read published blogs"
  on public.blogs for select
  using (published = true);

-- Step 4: Create RLS Policy - Admins have full access
-- ============================================================
create policy "Admins have full access to blogs"
  on public.blogs for all
  to authenticated
  using (true)
  with check (true);

-- Step 5: Create storage bucket for blog images
-- ============================================================
-- Go to Storage → New bucket → Name: "blog-images" → Make Public
-- Or run this SQL in another query:

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Step 6: Create storage policies for blog images
-- ============================================================
create policy "Public can read blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "Admins can upload blog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-images');

create policy "Admins can delete blog images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-images');

-- ============================================================
-- ✅ Setup Complete!
-- ============================================================
-- 
-- You can now:
-- 1. Go to https://your-site.com/blog - see blog list
-- 2. Go to https://your-site.com/admin/blog - manage posts
-- 3. Create your first blog post!
--
-- ============================================================
