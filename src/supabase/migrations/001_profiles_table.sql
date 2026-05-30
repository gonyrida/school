-- supabase/migrations/001_profiles_table.sql
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Create profiles table (mirrors auth.users)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  role        text not null default 'editor' check (role in ('admin', 'editor')),
  created_at  timestamptz default now(),
  last_sign_in_at timestamptz
);

-- 2. Enable Row Level Security
alter table public.profiles enable row level security;

-- 3. Admins can read all profiles; users can only read their own
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    auth.uid() = id
    or (
      select role from public.profiles where id = auth.uid()
    ) = 'admin'
  );

-- 4. Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 5. Auto-create a profile row when a new user signs up in Auth
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
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Update last_sign_in_at on login
create or replace function public.handle_user_login()
returns trigger language plpgsql security definer as $$
begin
  update public.profiles
  set last_sign_in_at = now()
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_login on auth.users;
create trigger on_auth_user_login
  after update of last_sign_in_at on auth.users
  for each row execute procedure public.handle_user_login();
