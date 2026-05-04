-- School Website CMS (Supabase / Postgres)
-- Apply in Supabase SQL editor or migrations pipeline.

create extension if not exists pgcrypto;

-- -----------------------------
-- Roles / profiles
-- -----------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute procedure public.touch_updated_at();

-- -----------------------------
-- Auth helpers
-- -----------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'editor')
  );
$$;

-- -----------------------------
-- Settings (singleton)
-- -----------------------------

create table if not exists public.settings (
  id int primary key default 1,
  school_name text not null default 'School',
  address text,
  email text,
  phone text,
  logo_url text,
  social_links jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);

create trigger settings_touch_updated_at
before update on public.settings
for each row execute procedure public.touch_updated_at();

insert into public.settings (id)
values (1)
on conflict (id) do nothing;

-- -----------------------------
-- Homepage content (singleton)
-- -----------------------------

create table if not exists public.homepage_content (
  id int primary key default 1,
  hero_title text,
  hero_description text,
  hero_image_url text,
  principal_name text,
  principal_title text,
  principal_message text,
  stats jsonb not null default '[]'::jsonb,
  cta jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint homepage_singleton check (id = 1)
);

insert into public.homepage_content (id)
values (1)
on conflict (id) do nothing;

-- -----------------------------
-- Generic pages (About, Support, etc.)
-- -----------------------------

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type text not null,
  title text not null,
  banner_image_url text,
  content jsonb not null default '{}'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  video_url text,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger pages_touch_updated_at
before update on public.pages
for each row execute procedure public.touch_updated_at();

-- -----------------------------
-- Curriculum pages
-- -----------------------------

create table if not exists public.curriculum_pages (
  id uuid primary key default gen_random_uuid(),
  type text not null unique, -- overview | kindergarten | elementary
  title text not null,
  description jsonb not null default '{}'::jsonb,
  subjects jsonb not null default '[]'::jsonb,
  approach jsonb not null default '{}'::jsonb,
  timetable jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  pdfs jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Seed curriculum types
insert into public.curriculum_pages (type, title)
values
  ('overview', 'Curriculum Overview'),
  ('kindergarten', 'Kindergarten'),
  ('elementary', 'Elementary')
on conflict (type) do nothing;

-- -----------------------------
-- News & Events
-- -----------------------------

create table if not exists public.news_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  thumbnail_url text,
  content jsonb not null default '{}'::jsonb,
  category_id uuid references public.news_categories(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_posts_status_idx on public.news_posts(status);
create index if not exists news_posts_published_at_idx on public.news_posts(published_at desc nulls last);

create trigger news_posts_touch_updated_at
before update on public.news_posts
for each row execute procedure public.touch_updated_at();

-- -----------------------------
-- Admissions
-- -----------------------------

create table if not exists public.admissions_content (
  id int primary key default 1,
  process jsonb not null default '{}'::jsonb,
  requirements jsonb not null default '{}'::jsonb,
  tuition_fees jsonb not null default '{}'::jsonb,
  school_calendar jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint admissions_singleton check (id = 1)
);

insert into public.admissions_content (id)
values (1)
on conflict (id) do nothing;

create table if not exists public.admissions_faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.admissions_files (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

-- -----------------------------
-- Gallery
-- -----------------------------

create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  cover_image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references public.gallery_albums(id) on delete cascade,
  title text,
  image_url text not null,
  created_at timestamptz not null default now()
);

-- -----------------------------
-- Contact form submissions
-- -----------------------------

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

-- -----------------------------
-- Activity log
-- -----------------------------

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_logs_created_at_idx on public.activity_logs(created_at desc);

-- -----------------------------
-- RLS
-- -----------------------------

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.homepage_content enable row level security;
alter table public.pages enable row level security;
alter table public.curriculum_pages enable row level security;
alter table public.news_categories enable row level security;
alter table public.news_posts enable row level security;
alter table public.admissions_content enable row level security;
alter table public.admissions_faq enable row level security;
alter table public.admissions_files enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_images enable row level security;
alter table public.contact_messages enable row level security;
alter table public.activity_logs enable row level security;

-- Public read policies
create policy "public_read_settings"
on public.settings for select
to anon, authenticated
using (true);

create policy "public_read_homepage"
on public.homepage_content for select
to anon, authenticated
using (true);

create policy "public_read_published_pages"
on public.pages for select
to anon, authenticated
using (status = 'published');

create policy "public_read_curriculum"
on public.curriculum_pages for select
to anon, authenticated
using (true);

create policy "public_read_news_categories"
on public.news_categories for select
to anon, authenticated
using (true);

create policy "public_read_published_news"
on public.news_posts for select
to anon, authenticated
using (status = 'published');

create policy "public_read_admissions"
on public.admissions_content for select
to anon, authenticated
using (true);

create policy "public_read_admissions_faq"
on public.admissions_faq for select
to anon, authenticated
using (true);

create policy "public_read_admissions_files"
on public.admissions_files for select
to anon, authenticated
using (true);

create policy "public_read_gallery_albums"
on public.gallery_albums for select
to anon, authenticated
using (true);

create policy "public_read_gallery_images"
on public.gallery_images for select
to anon, authenticated
using (true);

-- Admin write policies
create policy "admin_all_profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_settings"
on public.settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_homepage"
on public.homepage_content for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_pages"
on public.pages for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_curriculum"
on public.curriculum_pages for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_news_categories"
on public.news_categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_news_posts"
on public.news_posts for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_admissions"
on public.admissions_content for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_admissions_faq"
on public.admissions_faq for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_admissions_files"
on public.admissions_files for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_gallery_albums"
on public.gallery_albums for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_gallery_images"
on public.gallery_images for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_activity_logs"
on public.activity_logs for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Contact messages: anyone can insert, only admin can read
create policy "public_insert_contact_messages"
on public.contact_messages for insert
to anon, authenticated
with check (true);

create policy "admin_read_contact_messages"
on public.contact_messages for select
to authenticated
using (public.is_admin());

-- Storage buckets (create these in Supabase UI if you prefer)
-- insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict do nothing;

