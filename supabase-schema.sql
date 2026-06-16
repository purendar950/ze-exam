-- ExamZen starter schema
-- Run this in Supabase SQL Editor, then wire the frontend auth methods.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  username text unique not null,
  email text unique not null,
  plan text not null default 'free',
  role text not null default 'student',
  premium_expiry timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  test_id text not null,
  created_at timestamptz not null default now(),
  unique(user_id, test_id)
);

create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  test_id text not null,
  test_title text not null,
  total int not null,
  correct int not null,
  wrong int not null,
  unattempted int not null,
  percentage int not null,
  remaining_seconds int,
  completed_at timestamptz not null default now()
);

create table if not exists public.premium_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(10,2) not null,
  coupon_code text,
  payment_provider text,
  payment_status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.bookmarks enable row level security;
alter table public.results enable row level security;
alter table public.premium_orders enable row level security;

create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id);

create policy "bookmarks_all_own" on public.bookmarks
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "results_all_own" on public.results
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "orders_all_own" on public.premium_orders
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
