alter table public.admin_emails
add column if not exists recipient text;

alter table public.admin_email_revisions
add column if not exists recipient text;

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
    old.recipient,
    old.status,
    old.sent_date,
    old.style_weight,
    old.source_notes
  ) is distinct from row(
    new.subject,
    new.body,
    new.distribution_context,
    new.audience,
    new.recipient,
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
      recipient,
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
      old.recipient,
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

update public.admin_emails
set recipient = 'aboutai@virginia.edu'
where slug = 'outreach-ailist'
  and recipient is null;
