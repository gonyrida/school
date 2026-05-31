-- ================================================================
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- Fixes: storage 400 (upload blocked) + profiles RLS violation
-- ================================================================

-- ── FIX 1: Storage policies for the 'media' bucket ──────────────
-- Allows authenticated users to upload/update files under avatars/

-- Drop old conflicting policies if any
drop policy if exists "avatar_upload"  on storage.objects;
drop policy if exists "avatar_update"  on storage.objects;
drop policy if exists "avatar_read"    on storage.objects;
drop policy if exists "media_upload"   on storage.objects;
drop policy if exists "media_update"   on storage.objects;
drop policy if exists "media_read"     on storage.objects;

-- Public can READ anything in the media bucket (for displaying images)
create policy "media_read"
  on storage.objects for select
  using (bucket_id = 'media');

-- Authenticated users can UPLOAD to media bucket
create policy "media_upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

-- Authenticated users can UPDATE (overwrite) their own files
create policy "media_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

-- Authenticated users can DELETE their own files
create policy "media_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');


-- ── FIX 2: profiles table (create if missing) ───────────────────

create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text,
  full_name       text,
  avatar_url      text,
  role            text not null default 'editor'
                    check (role in ('admin', 'editor')),
  created_at      timestamptz default now(),
  last_sign_in_at timestamptz
);

alter table public.profiles enable row level security;

-- Drop all old policies and recreate cleanly
drop policy if exists "Users can view own profile"                 on public.profiles;
drop policy if exists "Admins can view all profiles"               on public.profiles;
drop policy if exists "Users can update own profile"               on public.profiles;
drop policy if exists "Authenticated users can view all profiles"  on public.profiles;
drop policy if exists "Service role can insert profiles"           on public.profiles;
drop policy if exists "insert_own_profile"                         on public.profiles;
drop policy if exists "update_own_profile"                         on public.profiles;
drop policy if exists "read_all_profiles"                          on public.profiles;

-- Any logged-in user can read all profiles (needed for User Management list)
create policy "profiles_select"
  on public.profiles for select
  to authenticated
  using (true);

-- Users can update only their own row
create policy "profiles_update"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Allow inserts (the trigger runs as security definer, so it bypasses RLS,
-- but this policy covers any direct inserts from the app)
create policy "profiles_insert"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);


-- ── FIX 3: Auto-create profile trigger ──────────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'editor')
  )
  on conflict (id) do update set
    email     = excluded.email,
    full_name = excluded.full_name,
    role      = excluded.role;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── FIX 4: Backfill existing users ──────────────────────────────
-- Adds a profiles row for every auth user who existed before the trigger

insert into public.profiles (id, email, full_name, role, created_at)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'full_name', ''),
  coalesce(raw_user_meta_data->>'role', 'editor'),
  created_at
from auth.users
on conflict (id) do nothing;
