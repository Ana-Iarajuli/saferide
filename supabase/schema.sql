-- SafeRide accounts: run once in Supabase → SQL Editor (safe to re-run).
-- Supabase Auth stores emails and password hashes (auth.users); this adds unique usernames.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null check (username ~ '^[A-Za-z0-9_]{3,20}$'),
  created_at timestamptz not null default now()
);

-- usernames are unique regardless of case ("Rider" and "rider" can't both exist)
create unique index if not exists profiles_username_key on public.profiles (lower(username));

alter table public.profiles enable row level security;

drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles are public" on public.profiles for select using (true);

-- Create the profile when someone signs up. The username comes from signUp({ options: { data: { username } } }).
-- If it's taken, the unique index makes the whole sign-up fail, so no account is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username) values (new.id, new.raw_user_meta_data ->> 'username');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Registration form check: is this username still free?
create or replace function public.username_available(name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (select 1 from public.profiles where lower(username) = lower(name));
$$;

revoke execute on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;

-- Username login: email for a username. Only the server (secret key) may call this,
-- so emails are never exposed to browsers. Used by netlify/functions/login.mjs.
create or replace function public.email_for_login(identifier text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select u.email
  from auth.users u
  join public.profiles p on p.id = u.id
  where lower(p.username) = lower(identifier);
$$;

revoke execute on function public.email_for_login(text) from public, anon, authenticated;
grant execute on function public.email_for_login(text) to service_role;

-- ---------------------------------------------------------------------------
-- School reviews (schools.html / school.html). Added later: re-running this whole file is safe.
-- Schools themselves live in public/content/schools.json; school_id is that file's "id".
-- ---------------------------------------------------------------------------

create table if not exists public.school_reviews (
  id bigint generated always as identity primary key,
  school_id text not null check (school_id ~ '^[a-z0-9-]{1,64}$'),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text not null default '' check (char_length(comment) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, user_id) -- one review per person per school; writing again updates it
);

create index if not exists school_reviews_school_idx on public.school_reviews (school_id, created_at desc);

alter table public.school_reviews enable row level security;

drop policy if exists "Reviews are public" on public.school_reviews;
create policy "Reviews are public" on public.school_reviews for select using (true);

drop policy if exists "Users add their own review" on public.school_reviews;
create policy "Users add their own review" on public.school_reviews for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users edit their own review" on public.school_reviews;
create policy "Users edit their own review" on public.school_reviews for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users delete their own review" on public.school_reviews;
create policy "Users delete their own review" on public.school_reviews for delete to authenticated
  using (user_id = auth.uid());

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists school_reviews_touch on public.school_reviews;
create trigger school_reviews_touch before update on public.school_reviews
  for each row execute function public.touch_updated_at();

-- average and count per school, for the school cards
create or replace view public.school_ratings
with (security_invoker = true) as
  select school_id, round(avg(rating)::numeric, 1) as average, count(*)::int as count
  from public.school_reviews
  group by school_id;

grant select on public.school_ratings to anon, authenticated;
