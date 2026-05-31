-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Create the profiles table
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

-- 2. Enable RLS
alter table public.profiles enable row level security;

-- 3. Drop any old conflicting policies
drop policy if exists "Users can view own profile"                on public.profiles;
drop policy if exists "Admins can view all profiles"             on public.profiles;
drop policy if exists "Users can update own profile"             on public.profiles;
drop policy if exists "Authenticated users can view all profiles" on public.profiles;
drop policy if exists "Service role can insert profiles"         on public.profiles;

-- 4. Allow any authenticated user to read all profiles
create policy "read_all_profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- 5. Allow users to update their own row
create policy "update_own_profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 6. Allow insert from anyone authenticated (Edge Function uses service_role which bypasses RLS anyway)
create policy "insert_own_profile"
  on public.profiles for insert
  with check (auth.uid() = id or auth.role() = 'service_role');

-- 7. Trigger: auto-create profile row when a new user signs up
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

-- 8. Backfill existing users who were created before the trigger existed
insert into public.profiles (id, email, full_name, role, created_at)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'full_name', ''),
  coalesce(raw_user_meta_data->>'role', 'editor'),
  created_at
from auth.users
on conflict (id) do nothing;
