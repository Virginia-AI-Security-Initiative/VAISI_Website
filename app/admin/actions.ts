'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentExecAccess } from '@/lib/admin/data';
import type { ActionResult } from '@/lib/admin/types';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const emailDistributionValues = new Set(['announcement_list', 'external_list']);
const emailStatusValues = new Set(['draft', 'sent', 'archived']);
const emailStyleWeightValues = new Set(['primary', 'secondary', 'excluded']);

function actionFailure(error: unknown): ActionResult {
  const message = error instanceof Error ? error.message : 'The admin action failed.';
  return { ok: false, message };
}

function textField(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function optionalTextField(formData: FormData, key: string) {
  const value = textField(formData, key);
  return value.length > 0 ? value : null;
}

function requiredField(formData: FormData, key: string, label: string) {
  const value = textField(formData, key);

  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function optionalDate(value: string | null) {
  if (!value) {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('Use a valid date.');
  }

  return value;
}

function optionalTime(value: string | null) {
  if (!value) {
    return null;
  }

  if (!/^\d{2}:\d{2}$/.test(value)) {
    throw new Error('Use a valid time.');
  }

  return value;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

function enumField(formData: FormData, key: string, label: string, values: Set<string>) {
  const value = requiredField(formData, key, label);

  if (!values.has(value)) {
    throw new Error(`Choose a valid ${label.toLowerCase()}.`);
  }

  return value;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function emailFields(formData: FormData) {
  return {
    subject: optionalTextField(formData, 'subject'),
    body: requiredField(formData, 'body', 'Email body'),
    distribution_context: enumField(
      formData,
      'distributionContext',
      'Distribution context',
      emailDistributionValues
    ),
    audience: requiredField(formData, 'audience', 'Audience'),
    status: enumField(formData, 'status', 'Status', emailStatusValues),
    sent_date: optionalDate(optionalTextField(formData, 'sentDate')),
    style_weight: enumField(
      formData,
      'styleWeight',
      'Style influence',
      emailStyleWeightValues
    ),
    source_notes: optionalTextField(formData, 'sourceNotes'),
  };
}

function secondaryOwnerIds(formData: FormData, primaryOwnerId: string) {
  const ids = formData
    .getAll('secondaryOwnerIds')
    .map((value) => String(value))
    .filter((value) => value && value !== primaryOwnerId);

  return [...new Set(ids)];
}

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new Error('Sign in with an approved Google account first.');
  }

  const access = await getCurrentExecAccess(supabase, user.email);

  if (!access) {
    throw new Error('This Google account is not approved for the VAISI admin dashboard.');
  }

  return { supabase, user, access };
}

async function assertAssignableOwner(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, ownerId: string) {
  const { data, error } = await supabase
    .from('admin_exec_members')
    .select('id')
    .eq('id', ownerId)
    .eq('is_active', true)
    .eq('is_assignable', true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Choose an active exec owner.');
  }
}

export async function createTask(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdmin();
    const title = requiredField(formData, 'title', 'Task title');
    const primaryOwnerId = requiredField(formData, 'primaryOwnerId', 'Primary owner');
    const isDueTbd = formData.get('isDueTbd') === 'on';
    const dueDateValue = optionalTextField(formData, 'dueDate');
    const dueDate = isDueTbd ? null : optionalDate(dueDateValue);
    const externalUrl = optionalTextField(formData, 'externalUrl');

    if (!isDueTbd && !dueDate) {
      throw new Error('Add a due date or check TBD before saving this task.');
    }

    if (externalUrl && !/^https?:\/\//i.test(externalUrl)) {
      throw new Error('External links must start with http:// or https://.');
    }

    await assertAssignableOwner(supabase, primaryOwnerId);

    const { data, error } = await supabase
      .from('admin_tasks')
      .insert({
        title,
        description: optionalTextField(formData, 'description'),
        due_date: dueDate,
        is_due_tbd: isDueTbd,
        primary_owner_id: primaryOwnerId,
        external_url: externalUrl,
        created_by: user.id,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const secondaryIds = secondaryOwnerIds(formData, primaryOwnerId);
    if (secondaryIds.length > 0) {
      const { error: secondaryError } = await supabase.from('admin_task_secondary_owners').insert(
        secondaryIds.map((memberId) => ({
          task_id: data.id,
          member_id: memberId,
        }))
      );

      if (secondaryError) {
        throw new Error(secondaryError.message);
      }
    }

    revalidatePath('/admin');
    return { ok: true, message: 'Task created.' };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function setTaskCompletion(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const taskId = requiredField(formData, 'taskId', 'Task');
    const isCompleted = textField(formData, 'isCompleted') === 'true';

    const { error } = await supabase
      .from('admin_tasks')
      .update({ is_completed: isCompleted })
      .eq('id', taskId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/admin');
    return { ok: true, message: isCompleted ? 'Task completed.' : 'Task reopened.' };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function updateTask(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const taskId = requiredField(formData, 'taskId', 'Task');
    const title = requiredField(formData, 'title', 'Task title');
    const primaryOwnerId = requiredField(formData, 'primaryOwnerId', 'Primary owner');
    const isDueTbd = formData.get('isDueTbd') === 'on';
    const dueDateValue = optionalTextField(formData, 'dueDate');
    const dueDate = isDueTbd ? null : optionalDate(dueDateValue);
    const externalUrl = optionalTextField(formData, 'externalUrl');

    if (!isDueTbd && !dueDate) {
      throw new Error('Add a due date or check TBD before saving this task.');
    }

    if (externalUrl && !/^https?:\/\//i.test(externalUrl)) {
      throw new Error('External links must start with http:// or https://.');
    }

    await assertAssignableOwner(supabase, primaryOwnerId);

    const { error } = await supabase
      .from('admin_tasks')
      .update({
        title,
        description: optionalTextField(formData, 'description'),
        due_date: dueDate,
        is_due_tbd: isDueTbd,
        primary_owner_id: primaryOwnerId,
        external_url: externalUrl,
      })
      .eq('id', taskId);

    if (error) {
      throw new Error(error.message);
    }

    const secondaryIds = secondaryOwnerIds(formData, primaryOwnerId);
    const { error: deleteSecondaryError } = await supabase
      .from('admin_task_secondary_owners')
      .delete()
      .eq('task_id', taskId);

    if (deleteSecondaryError) {
      throw new Error(deleteSecondaryError.message);
    }

    if (secondaryIds.length > 0) {
      const { error: insertSecondaryError } = await supabase
        .from('admin_task_secondary_owners')
        .insert(
          secondaryIds.map((memberId) => ({
            task_id: taskId,
            member_id: memberId,
          }))
        );

      if (insertSecondaryError) {
        throw new Error(insertSecondaryError.message);
      }
    }

    revalidatePath('/admin');
    return { ok: true, message: 'Task updated.' };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function deleteTask(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const taskId = requiredField(formData, 'taskId', 'Task');

    const { error } = await supabase.from('admin_tasks').delete().eq('id', taskId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/admin');
    return { ok: true, message: 'Task deleted.' };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function createEvent(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdmin();
    const title = requiredField(formData, 'title', 'Event title');
    const primaryOwnerId = requiredField(formData, 'primaryOwnerId', 'Primary owner');
    const eventDate = optionalDate(requiredField(formData, 'eventDate', 'Event date'));
    const startTime = optionalTime(optionalTextField(formData, 'startTime'));
    const endTime = optionalTime(optionalTextField(formData, 'endTime'));

    if (!eventDate) {
      throw new Error('Event date is required.');
    }

    await assertAssignableOwner(supabase, primaryOwnerId);

    const { data, error } = await supabase
      .from('admin_events')
      .insert({
        title,
        description: optionalTextField(formData, 'description'),
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        location: optionalTextField(formData, 'location'),
        primary_owner_id: primaryOwnerId,
        created_by: user.id,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const secondaryIds = secondaryOwnerIds(formData, primaryOwnerId);
    if (secondaryIds.length > 0) {
      const { error: secondaryError } = await supabase.from('admin_event_secondary_owners').insert(
        secondaryIds.map((memberId) => ({
          event_id: data.id,
          member_id: memberId,
        }))
      );

      if (secondaryError) {
        throw new Error(secondaryError.message);
      }
    }

    revalidatePath('/admin');
    return { ok: true, message: 'Event created.' };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function updateEvent(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const eventId = requiredField(formData, 'eventId', 'Event');
    const title = requiredField(formData, 'title', 'Event title');
    const primaryOwnerId = requiredField(formData, 'primaryOwnerId', 'Primary owner');
    const eventDate = optionalDate(requiredField(formData, 'eventDate', 'Event date'));
    const startTime = optionalTime(optionalTextField(formData, 'startTime'));
    const endTime = optionalTime(optionalTextField(formData, 'endTime'));

    if (!eventDate) {
      throw new Error('Event date is required.');
    }

    await assertAssignableOwner(supabase, primaryOwnerId);

    const { error } = await supabase
      .from('admin_events')
      .update({
        title,
        description: optionalTextField(formData, 'description'),
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        location: optionalTextField(formData, 'location'),
        primary_owner_id: primaryOwnerId,
      })
      .eq('id', eventId);

    if (error) {
      throw new Error(error.message);
    }

    const secondaryIds = secondaryOwnerIds(formData, primaryOwnerId);
    const { error: deleteSecondaryError } = await supabase
      .from('admin_event_secondary_owners')
      .delete()
      .eq('event_id', eventId);

    if (deleteSecondaryError) {
      throw new Error(deleteSecondaryError.message);
    }

    if (secondaryIds.length > 0) {
      const { error: insertSecondaryError } = await supabase
        .from('admin_event_secondary_owners')
        .insert(
          secondaryIds.map((memberId) => ({
            event_id: eventId,
            member_id: memberId,
          }))
        );

      if (insertSecondaryError) {
        throw new Error(insertSecondaryError.message);
      }
    }

    revalidatePath('/admin');
    return { ok: true, message: 'Event updated.' };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function deleteEvent(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const eventId = requiredField(formData, 'eventId', 'Event');

    const { error } = await supabase.from('admin_events').delete().eq('id', eventId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/admin');
    return { ok: true, message: 'Event deleted.' };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function addExecAccess(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const name = requiredField(formData, 'name', 'Name');
    const email = normalizeEmail(requiredField(formData, 'email', 'Email'));

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new Error('Use a valid email address.');
    }

    const normalizedName = normalizeName(name);
    const existingMemberResult = await supabase
      .from('admin_exec_members')
      .select('id')
      .eq('normalized_name', normalizedName)
      .maybeSingle();

    if (existingMemberResult.error) {
      throw new Error(existingMemberResult.error.message);
    }

    let memberId = existingMemberResult.data?.id;

    if (memberId) {
      const { error } = await supabase
        .from('admin_exec_members')
        .update({ name, is_active: true, is_assignable: true })
        .eq('id', memberId);

      if (error) {
        throw new Error(error.message);
      }
    } else {
      const { data, error } = await supabase
        .from('admin_exec_members')
        .insert({ name, is_active: true, is_assignable: true })
        .select('id')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      memberId = data.id;
    }

    const { error } = await supabase
      .from('admin_exec_member_emails')
      .upsert(
        {
          member_id: memberId,
          email,
          is_active: true,
        },
        { onConflict: 'email' }
      );

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/admin');
    return { ok: true, message: 'Exec access added.' };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function removeExecAccess(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const emailId = requiredField(formData, 'emailId', 'Email access');

    const { data: accessEmail, error: accessError } = await supabase
      .from('admin_exec_member_emails')
      .select('member_id')
      .eq('id', emailId)
      .maybeSingle();

    if (accessError) {
      throw new Error(accessError.message);
    }

    if (!accessEmail) {
      throw new Error('Email access was not found.');
    }

    const { error } = await supabase
      .from('admin_exec_member_emails')
      .update({ is_active: false })
      .eq('id', emailId);

    if (error) {
      throw new Error(error.message);
    }

    const { data: remainingEmails, error: remainingError } = await supabase
      .from('admin_exec_member_emails')
      .select('id')
      .eq('member_id', accessEmail.member_id)
      .eq('is_active', true);

    if (remainingError) {
      throw new Error(remainingError.message);
    }

    if ((remainingEmails ?? []).length === 0) {
      const { error: memberError } = await supabase
        .from('admin_exec_members')
        .update({ is_active: false })
        .eq('id', accessEmail.member_id);

      if (memberError) {
        throw new Error(memberError.message);
      }
    }

    revalidatePath('/admin');
    return { ok: true, message: 'Exec access removed.' };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function createEmail(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdmin();
    const fields = emailFields(formData);
    const slugBase = slugify(fields.subject || fields.audience) || 'email';
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    const { data, error } = await supabase
      .from('admin_emails')
      .insert({
        ...fields,
        slug,
        created_by: user.id,
        updated_by: user.id,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/admin');
    return { ok: true, message: 'Email draft created.', id: data.id };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function updateEmail(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdmin();
    const emailId = requiredField(formData, 'emailId', 'Email');
    const fields = emailFields(formData);

    const { error } = await supabase
      .from('admin_emails')
      .update({ ...fields, updated_by: user.id })
      .eq('id', emailId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/admin');
    return { ok: true, message: 'Email saved. The previous version is in history.' };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function deleteEmailDraft(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdmin();
    const emailId = requiredField(formData, 'emailId', 'Email');

    const { data: email, error: emailError } = await supabase
      .from('admin_emails')
      .select('id, slug, status')
      .eq('id', emailId)
      .maybeSingle();

    if (emailError) {
      throw new Error(emailError.message);
    }

    if (!email) {
      throw new Error('That email draft was not found.');
    }

    if (email.status !== 'draft') {
      throw new Error('Only draft emails can be permanently deleted.');
    }

    const { error: deletionRecordError } = await supabase
      .from('admin_email_deletions')
      .upsert({
        slug: email.slug,
        deleted_by: user.id,
        deleted_at: new Date().toISOString(),
      });

    if (deletionRecordError) {
      throw new Error(deletionRecordError.message);
    }

    const { data: deletedEmail, error: deleteError } = await supabase
      .from('admin_emails')
      .delete()
      .eq('id', emailId)
      .eq('status', 'draft')
      .select('id')
      .maybeSingle();

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    if (!deletedEmail) {
      throw new Error('The draft changed before it could be deleted. Refresh and try again.');
    }

    revalidatePath('/admin');
    return {
      ok: true,
      message: 'Draft and its complete version history permanently deleted.',
    };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function restoreEmailRevision(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdmin();
    const emailId = requiredField(formData, 'emailId', 'Email');
    const revisionId = requiredField(formData, 'revisionId', 'Revision');

    const { data: revision, error: revisionError } = await supabase
      .from('admin_email_revisions')
      .select(
        'subject, body, distribution_context, audience, status, sent_date, style_weight, source_notes'
      )
      .eq('id', revisionId)
      .eq('email_id', emailId)
      .maybeSingle();

    if (revisionError) {
      throw new Error(revisionError.message);
    }

    if (!revision) {
      throw new Error('That saved version was not found.');
    }

    const { error } = await supabase
      .from('admin_emails')
      .update({ ...revision, updated_by: user.id })
      .eq('id', emailId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/admin');
    return { ok: true, message: 'Saved version restored. Your newer version remains in history.' };
  } catch (error) {
    return actionFailure(error);
  }
}
