create extension if not exists citext;
create extension if not exists pgcrypto;

create table if not exists public.admin_exec_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) > 0),
  normalized_name text generated always as (lower(btrim(name))) stored,
  is_active boolean not null default true,
  is_assignable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (normalized_name)
);

create table if not exists public.admin_exec_member_emails (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.admin_exec_members(id) on delete cascade,
  email citext not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (email::text ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);

create table if not exists public.admin_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(btrim(title)) > 0),
  description text,
  due_date date,
  is_due_tbd boolean not null default false,
  primary_owner_id uuid not null references public.admin_exec_members(id),
  external_url text,
  is_completed boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (is_due_tbd or due_date is not null),
  check (external_url is null or external_url ~* '^https?://')
);

create table if not exists public.admin_task_secondary_owners (
  task_id uuid not null references public.admin_tasks(id) on delete cascade,
  member_id uuid not null references public.admin_exec_members(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (task_id, member_id)
);

create table if not exists public.admin_events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(btrim(title)) > 0),
  description text,
  event_date date not null,
  start_time time,
  end_time time,
  location text,
  primary_owner_id uuid not null references public.admin_exec_members(id),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time is null or start_time is null or end_time > start_time)
);

create table if not exists public.admin_event_secondary_owners (
  event_id uuid not null references public.admin_events(id) on delete cascade,
  member_id uuid not null references public.admin_exec_members(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, member_id)
);

create index if not exists admin_exec_member_emails_active_email_idx
  on public.admin_exec_member_emails (email)
  where is_active;

create index if not exists admin_tasks_sort_idx
  on public.admin_tasks (is_completed, is_due_tbd, due_date, created_at);

create index if not exists admin_tasks_primary_owner_idx
  on public.admin_tasks (primary_owner_id);

create index if not exists admin_task_secondary_member_idx
  on public.admin_task_secondary_owners (member_id);

create index if not exists admin_events_sort_idx
  on public.admin_events (event_date, start_time, created_at);

create index if not exists admin_events_primary_owner_idx
  on public.admin_events (primary_owner_id);

create index if not exists admin_event_secondary_member_idx
  on public.admin_event_secondary_owners (member_id);

create or replace function public.admin_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_exec_members_set_updated_at on public.admin_exec_members;
create trigger admin_exec_members_set_updated_at
before update on public.admin_exec_members
for each row execute function public.admin_set_updated_at();

drop trigger if exists admin_exec_member_emails_set_updated_at on public.admin_exec_member_emails;
create trigger admin_exec_member_emails_set_updated_at
before update on public.admin_exec_member_emails
for each row execute function public.admin_set_updated_at();

drop trigger if exists admin_tasks_set_updated_at on public.admin_tasks;
create trigger admin_tasks_set_updated_at
before update on public.admin_tasks
for each row execute function public.admin_set_updated_at();

drop trigger if exists admin_events_set_updated_at on public.admin_events;
create trigger admin_events_set_updated_at
before update on public.admin_events
for each row execute function public.admin_set_updated_at();

create or replace function public.admin_is_exec_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_exec_member_emails access_email
    join public.admin_exec_members member
      on member.id = access_email.member_id
    where access_email.is_active
      and member.is_active
      and lower(access_email.email::text) = lower(auth.jwt() ->> 'email')
  );
$$;

alter table public.admin_exec_members enable row level security;
alter table public.admin_exec_member_emails enable row level security;
alter table public.admin_tasks enable row level security;
alter table public.admin_task_secondary_owners enable row level security;
alter table public.admin_events enable row level security;
alter table public.admin_event_secondary_owners enable row level security;

drop policy if exists "approved users can read exec members" on public.admin_exec_members;
create policy "approved users can read exec members"
on public.admin_exec_members
for select
to authenticated
using (
  public.admin_is_exec_member()
  or exists (
    select 1
    from public.admin_exec_member_emails access_email
    where access_email.member_id = admin_exec_members.id
      and lower(access_email.email::text) = lower(auth.jwt() ->> 'email')
  )
);

drop policy if exists "approved users can manage exec members" on public.admin_exec_members;
create policy "approved users can manage exec members"
on public.admin_exec_members
for all
to authenticated
using (public.admin_is_exec_member())
with check (public.admin_is_exec_member());

drop policy if exists "approved users can read exec emails" on public.admin_exec_member_emails;
create policy "approved users can read exec emails"
on public.admin_exec_member_emails
for select
to authenticated
using (
  public.admin_is_exec_member()
  or lower(email::text) = lower(auth.jwt() ->> 'email')
);

drop policy if exists "approved users can manage exec emails" on public.admin_exec_member_emails;
create policy "approved users can manage exec emails"
on public.admin_exec_member_emails
for all
to authenticated
using (public.admin_is_exec_member())
with check (public.admin_is_exec_member());

drop policy if exists "approved users can manage tasks" on public.admin_tasks;
create policy "approved users can manage tasks"
on public.admin_tasks
for all
to authenticated
using (public.admin_is_exec_member())
with check (public.admin_is_exec_member());

drop policy if exists "approved users can manage task owners" on public.admin_task_secondary_owners;
create policy "approved users can manage task owners"
on public.admin_task_secondary_owners
for all
to authenticated
using (public.admin_is_exec_member())
with check (public.admin_is_exec_member());

drop policy if exists "approved users can manage events" on public.admin_events;
create policy "approved users can manage events"
on public.admin_events
for all
to authenticated
using (public.admin_is_exec_member())
with check (public.admin_is_exec_member());

drop policy if exists "approved users can manage event owners" on public.admin_event_secondary_owners;
create policy "approved users can manage event owners"
on public.admin_event_secondary_owners
for all
to authenticated
using (public.admin_is_exec_member())
with check (public.admin_is_exec_member());

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.admin_exec_members to authenticated;
grant select, insert, update, delete on public.admin_exec_member_emails to authenticated;
grant select, insert, update, delete on public.admin_tasks to authenticated;
grant select, insert, update, delete on public.admin_task_secondary_owners to authenticated;
grant select, insert, update, delete on public.admin_events to authenticated;
grant select, insert, update, delete on public.admin_event_secondary_owners to authenticated;
grant execute on function public.admin_is_exec_member() to authenticated;

insert into public.admin_exec_members (name, is_assignable)
values
  ('Seth', true),
  ('Andrew', true),
  ('Shubs', true),
  ('Marcus', true),
  ('Aran', true),
  ('Urav', true),
  ('Kasia', true),
  ('Nia', true),
  ('Jason', true),
  ('Elias', true),
  ('Lily', true),
  ('Charlie', true),
  ('Matthew', true),
  ('VAISI Club', false)
on conflict (normalized_name) do update
set is_active = true,
    is_assignable = excluded.is_assignable;

with seed_emails(name, email) as (
  values
    ('Seth', 'sethlifland11@gmail.com'),
    ('Andrew', 'and2broughton@gmail.com'),
    ('Aran', 'aran.jothi@gmail.com'),
    ('Elias', 'eliaskrasny@gmail.com'),
    ('Jason', 'jasonchin098@gmail.com'),
    ('Kasia', 'kasia0esmeralda0wasiak@gmail.com'),
    ('Lily', 'lilyeggs03@gmail.com'),
    ('Charlie', 'maddenmobile580@gmail.com'),
    ('Marcus', 'msoutherland910@gmail.com'),
    ('Matthew', 'matthewjjanickic@gmail.com'),
    ('Nia', 'niamucher@gmail.com'),
    ('Shubs', 'shrubsdaone@gmail.com'),
    ('Urav', 'uravtanna@gmail.com'),
    ('VAISI Club', 'vaisi.club@gmail.com')
)
insert into public.admin_exec_member_emails (member_id, email)
select member.id, seed_emails.email
from seed_emails
join public.admin_exec_members member
  on member.normalized_name = lower(seed_emails.name)
on conflict (email) do update
set member_id = excluded.member_id,
    is_active = true;
