import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  AdminDashboardData,
  AdminEmail,
  AdminEmailRevision,
  AdminEvent,
  AdminTask,
  CurrentExecAccess,
  ExecMember,
  ExecMemberEmail,
} from '@/lib/admin/types';
import { adminEmailSeeds } from '@/lib/admin/email-seeds';

type MemberRow = Omit<ExecMember, 'emails'>;
type TaskOwnerRow = { task_id: string; member_id: string };
type EventOwnerRow = { event_id: string; member_id: string };

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function ensureData<T>(data: T | null, error: { message: string } | null): T {
  if (error) {
    throw new Error(error.message);
  }

  if (data === null) {
    throw new Error('Supabase returned no data.');
  }

  return data;
}

export async function getCurrentExecAccess(
  supabase: SupabaseClient,
  email: string
): Promise<CurrentExecAccess | null> {
  const normalizedEmail = normalizeEmail(email);

  const emailResult = await supabase
    .from('admin_exec_member_emails')
    .select('id, member_id, email, is_active, created_at, updated_at')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (emailResult.error) {
    throw new Error(emailResult.error.message);
  }

  if (!emailResult.data?.is_active) {
    return null;
  }

  const memberResult = await supabase
    .from('admin_exec_members')
    .select('id, name, normalized_name, is_active, is_assignable, created_at, updated_at')
    .eq('id', emailResult.data.member_id)
    .maybeSingle();

  if (memberResult.error) {
    throw new Error(memberResult.error.message);
  }

  if (!memberResult.data?.is_active) {
    return null;
  }

  return {
    email: emailResult.data as ExecMemberEmail,
    member: {
      ...(memberResult.data as MemberRow),
      emails: [emailResult.data as ExecMemberEmail],
    },
  };
}

export async function ensureAdminEmailSeeds(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase.from('admin_emails').select('slug');

  if (error) {
    throw new Error(error.message);
  }

  const existingSlugs = new Set((data ?? []).map((row) => String(row.slug)));
  const missingSeeds = adminEmailSeeds.filter((seed) => !existingSlugs.has(seed.slug));

  if (missingSeeds.length === 0) {
    return;
  }

  const { error: insertError } = await supabase.from('admin_emails').insert(
    missingSeeds.map((seed) => ({
      ...seed,
      created_by: userId,
      updated_by: userId,
    }))
  );

  if (insertError) {
    throw new Error(insertError.message);
  }
}

export async function getAdminDashboardData(
  supabase: SupabaseClient
): Promise<AdminDashboardData> {
  const [
    membersResult,
    memberEmailsResult,
    tasksResult,
    taskOwnersResult,
    eventsResult,
    eventOwnersResult,
    adminEmailsResult,
    emailRevisionsResult,
  ] = await Promise.all([
    supabase
      .from('admin_exec_members')
      .select('id, name, normalized_name, is_active, is_assignable, created_at, updated_at')
      .order('name', { ascending: true }),
    supabase
      .from('admin_exec_member_emails')
      .select('id, member_id, email, is_active, created_at, updated_at')
      .order('email', { ascending: true }),
    supabase
      .from('admin_tasks')
      .select(
        'id, title, description, due_date, is_due_tbd, primary_owner_id, external_url, is_completed, created_at, updated_at'
      )
      .order('is_completed', { ascending: true })
      .order('is_due_tbd', { ascending: true })
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false }),
    supabase.from('admin_task_secondary_owners').select('task_id, member_id'),
    supabase
      .from('admin_events')
      .select(
        'id, title, description, event_date, start_time, end_time, location, primary_owner_id, created_at, updated_at'
      )
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false }),
    supabase.from('admin_event_secondary_owners').select('event_id, member_id'),
    supabase
      .from('admin_emails')
      .select(
        'id, slug, subject, body, distribution_context, audience, status, sent_date, style_weight, source_notes, created_by, updated_by, created_at, updated_at'
      )
      .order('updated_at', { ascending: false }),
    supabase
      .from('admin_email_revisions')
      .select(
        'id, email_id, subject, body, distribution_context, audience, status, sent_date, style_weight, source_notes, saved_by, saved_at'
      )
      .order('saved_at', { ascending: false })
      .limit(250),
  ]);

  const memberRows = ensureData(membersResult.data, membersResult.error) as MemberRow[];
  const memberEmailRows = ensureData(
    memberEmailsResult.data,
    memberEmailsResult.error
  ) as ExecMemberEmail[];
  const taskRows = ensureData(tasksResult.data, tasksResult.error) as Omit<
    AdminTask,
    'secondary_owner_ids'
  >[];
  const taskOwnerRows = ensureData(taskOwnersResult.data, taskOwnersResult.error) as TaskOwnerRow[];
  const eventRows = ensureData(eventsResult.data, eventsResult.error) as Omit<
    AdminEvent,
    'secondary_owner_ids'
  >[];
  const eventOwnerRows = ensureData(
    eventOwnersResult.data,
    eventOwnersResult.error
  ) as EventOwnerRow[];
  const adminEmailRows = ensureData(
    adminEmailsResult.data,
    adminEmailsResult.error
  ) as AdminEmail[];
  const emailRevisionRows = ensureData(
    emailRevisionsResult.data,
    emailRevisionsResult.error
  ) as AdminEmailRevision[];

  const emailsByMember = new Map<string, ExecMemberEmail[]>();
  for (const email of memberEmailRows) {
    const memberEmails = emailsByMember.get(email.member_id) ?? [];
    memberEmails.push(email);
    emailsByMember.set(email.member_id, memberEmails);
  }

  const taskOwnersByTask = new Map<string, string[]>();
  for (const owner of taskOwnerRows) {
    const ownerIds = taskOwnersByTask.get(owner.task_id) ?? [];
    ownerIds.push(owner.member_id);
    taskOwnersByTask.set(owner.task_id, ownerIds);
  }

  const eventOwnersByEvent = new Map<string, string[]>();
  for (const owner of eventOwnerRows) {
    const ownerIds = eventOwnersByEvent.get(owner.event_id) ?? [];
    ownerIds.push(owner.member_id);
    eventOwnersByEvent.set(owner.event_id, ownerIds);
  }

  return {
    members: memberRows.map((member) => ({
      ...member,
      emails: emailsByMember.get(member.id) ?? [],
    })),
    tasks: taskRows.map((task) => ({
      ...task,
      secondary_owner_ids: taskOwnersByTask.get(task.id) ?? [],
    })),
    events: eventRows.map((event) => ({
      ...event,
      secondary_owner_ids: eventOwnersByEvent.get(event.id) ?? [],
    })),
    emails: adminEmailRows,
    emailRevisions: emailRevisionRows,
  };
}
