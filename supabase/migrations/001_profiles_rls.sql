-- ============================================================
-- NICS School — profiles table + RLS
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Create profiles table (mirrors auth.users)
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text,
  full_name       text,
  avatar_url      text,
  role            text not null default 'admin'
                    check (role in ('admin')),
  created_at      timestamptz default now(),
  last_sign_in_at timestamptz
);

-- 2. RLS
alter table public.profiles enable row level security;

-- Drop old policies if re-running
drop policy if exists "Users can view own profile"   on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- Any authenticated user can read all profiles
-- (needed so the User Management page can list everyone)
create policy "Authenticated users can view all profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- Users can update only their own row
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Service role (Edge Functions) can insert/upsert
create policy "Service role can insert profiles"
  on public.profiles for insert
  with check (true);   -- service_role bypasses RLS anyway, but this keeps it explicit

-- 3. Trigger: auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'admin')
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

-- 4. Trigger: keep last_sign_in_at in sync
create or replace function public.handle_user_login()
returns trigger language plpgsql security definer as $$
begin
  update public.profiles
  set last_sign_in_at = new.last_sign_in_at
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_login on auth.users;
create trigger on_auth_user_login
  after update of last_sign_in_at on auth.users
  for each row execute procedure public.handle_user_login();

-- ============================================================
-- STORAGE: create 'avatars' bucket (public read)
-- Run this separately if the bucket doesn't exist yet:
-- ============================================================
-- insert into storage.buckets (id, name, public)
-- values ('avatars', 'avatars', true)
-- on conflict do nothing;
