create table if not exists public.admin_email_deletions (
  slug text primary key check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  deleted_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz not null default now()
);

alter table public.admin_email_deletions enable row level security;

drop policy if exists "approved users can manage email deletions"
on public.admin_email_deletions;

create policy "approved users can manage email deletions"
on public.admin_email_deletions
for all
to authenticated
using (public.admin_is_exec_member())
with check (public.admin_is_exec_member());

grant select, insert, update, delete
on public.admin_email_deletions
to authenticated;
