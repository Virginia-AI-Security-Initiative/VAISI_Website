create table if not exists public.admin_emails (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  subject text,
  body text not null check (length(btrim(body)) > 0),
  distribution_context text not null default 'announcement_list'
    check (distribution_context in ('announcement_list', 'external_list')),
  audience text not null default 'VAISI announcement list'
    check (length(btrim(audience)) > 0),
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'archived')),
  sent_date date,
  style_weight text not null default 'primary'
    check (style_weight in ('primary', 'secondary', 'excluded')),
  source_notes text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_email_revisions (
  id bigint generated always as identity primary key,
  email_id uuid not null references public.admin_emails(id) on delete cascade,
  subject text,
  body text not null,
  distribution_context text not null
    check (distribution_context in ('announcement_list', 'external_list')),
  audience text not null,
  status text not null check (status in ('draft', 'sent', 'archived')),
  sent_date date,
  style_weight text not null
    check (style_weight in ('primary', 'secondary', 'excluded')),
  source_notes text,
  saved_by uuid references auth.users(id) on delete set null,
  saved_at timestamptz not null default now()
);

create index if not exists admin_emails_library_idx
  on public.admin_emails (distribution_context, status, updated_at desc);

create index if not exists admin_email_revisions_email_idx
  on public.admin_email_revisions (email_id, saved_at desc);

drop trigger if exists admin_emails_set_updated_at on public.admin_emails;
create trigger admin_emails_set_updated_at
before update on public.admin_emails
for each row execute function public.admin_set_updated_at();

create or replace function public.admin_capture_email_revision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if row(
    old.subject,
    old.body,
    old.distribution_context,
    old.audience,
    old.status,
    old.sent_date,
    old.style_weight,
    old.source_notes
  ) is distinct from row(
    new.subject,
    new.body,
    new.distribution_context,
    new.audience,
    new.status,
    new.sent_date,
    new.style_weight,
    new.source_notes
  ) then
    insert into public.admin_email_revisions (
      email_id,
      subject,
      body,
      distribution_context,
      audience,
      status,
      sent_date,
      style_weight,
      source_notes,
      saved_by
    ) values (
      old.id,
      old.subject,
      old.body,
      old.distribution_context,
      old.audience,
      old.status,
      old.sent_date,
      old.style_weight,
      old.source_notes,
      auth.uid()
    );
  end if;

  return new;
end;
$$;

drop trigger if exists admin_emails_capture_revision on public.admin_emails;
create trigger admin_emails_capture_revision
before update on public.admin_emails
for each row execute function public.admin_capture_email_revision();

alter table public.admin_emails enable row level security;
alter table public.admin_email_revisions enable row level security;

drop policy if exists "approved users can manage emails" on public.admin_emails;
create policy "approved users can manage emails"
on public.admin_emails
for all
to authenticated
using (public.admin_is_exec_member())
with check (public.admin_is_exec_member());

drop policy if exists "approved users can read email revisions" on public.admin_email_revisions;
create policy "approved users can read email revisions"
on public.admin_email_revisions
for select
to authenticated
using (public.admin_is_exec_member());

grant select, insert, update, delete on public.admin_emails to authenticated;
grant select on public.admin_email_revisions to authenticated;
grant usage, select on sequence public.admin_email_revisions_id_seq to authenticated;
