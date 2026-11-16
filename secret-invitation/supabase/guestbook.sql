create table if not exists public.guestbook (
  id         bigint generated always as identity primary key,
  name       text not null check (char_length(name) between 1 and 20),
  message    text not null check (char_length(message) between 1 and 300),
  created_at timestamptz not null default now()
);

alter table public.guestbook add column if not exists is_public boolean not null default false;

alter table public.guestbook enable row level security;

drop policy if exists "guestbook read"        on public.guestbook;
drop policy if exists "guestbook public read" on public.guestbook;
drop policy if exists "guestbook write"       on public.guestbook;

create policy "guestbook public read" on public.guestbook for select to anon using (is_public);
create policy "guestbook write"       on public.guestbook for insert to anon with check (true);

revoke all on public.guestbook from anon;
grant select, insert on public.guestbook to anon;
