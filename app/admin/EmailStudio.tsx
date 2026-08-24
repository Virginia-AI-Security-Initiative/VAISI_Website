'use client';

import { FormEvent, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Archive,
  Check,
  Clock3,
  Copy,
  Download,
  FilePenLine,
  History,
  Mail,
  Plus,
  RotateCcw,
  Save,
  Search,
  Send,
  Trash2,
} from 'lucide-react';
import {
  createEmail,
  deleteEmailDraft,
  restoreEmailRevision,
  updateEmail,
} from '@/app/admin/actions';
import RichTextEmailEditor, {
  emailBodyToHtml,
  emailBodyToPlainText,
} from '@/app/admin/RichTextEmailEditor';
import type {
  ActionResult,
  AdminEmail,
  AdminEmailDistribution,
  AdminEmailRevision,
  AdminEmailStatus,
  AdminEmailStyleWeight,
} from '@/lib/admin/types';

type EmailStudioProps = {
  emails: AdminEmail[];
  revisions: AdminEmailRevision[];
};

type EditorDraft = {
  subject: string;
  body: string;
  distributionContext: AdminEmailDistribution;
  audience: string;
  recipient: string;
  status: AdminEmailStatus;
  sentDate: string;
  styleWeight: AdminEmailStyleWeight;
  sourceNotes: string;
};

type ContextFilter = 'all' | AdminEmailDistribution;
type StatusFilter = 'all' | AdminEmailStatus;

const emptyDraft: EditorDraft = {
  subject: '',
  body: '',
  distributionContext: 'announcement_list',
  audience: 'VAISI announcement list',
  recipient: '',
  status: 'draft',
  sentDate: '',
  styleWeight: 'primary',
  sourceNotes: '',
};

const inputClass =
  'mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition-[border-color,box-shadow] duration-150 focus:border-orange-500 focus:ring-2 focus:ring-orange-200';

const outlookBodyStyle = [
  'font-family:Aptos,Calibri,sans-serif',
  'font-size:16px',
  'font-weight:400',
  'line-height:normal',
  'color:inherit',
].join(';');

function draftFromEmail(email: AdminEmail): EditorDraft {
  return {
    subject: email.subject ?? '',
    body: email.body,
    distributionContext: email.distribution_context,
    audience: email.audience,
    recipient: email.recipient ?? '',
    status: email.status,
    sentDate: email.sent_date ?? '',
    styleWeight: email.style_weight,
    sourceNotes: email.source_notes ?? '',
  };
}

function draftFromRevision(revision: AdminEmailRevision): EditorDraft {
  return {
    subject: revision.subject ?? '',
    body: revision.body,
    distributionContext: revision.distribution_context,
    audience: revision.audience,
    recipient: revision.recipient ?? '',
    status: revision.status,
    sentDate: revision.sent_date ?? '',
    styleWeight: revision.style_weight,
    sourceNotes: revision.source_notes ?? '',
  };
}

function formatDate(value: string | null) {
  if (!value) {
    return 'Date unknown';
  }

  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function statusIcon(status: AdminEmailStatus) {
  if (status === 'sent') {
    return Send;
  }

  if (status === 'archived') {
    return Archive;
  }

  return FilePenLine;
}

function statusLabel(status: AdminEmailStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function EmailStudio({ emails, revisions }: EmailStudioProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(emails[0]?.id ?? null);
  const [isCreating, setIsCreating] = useState(false);
  const [query, setQuery] = useState('');
  const [contextFilter, setContextFilter] = useState<ContextFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [draft, setDraft] = useState<EditorDraft>(() =>
    emails[0] ? draftFromEmail(emails[0]) : emptyDraft
  );
  const [savedDraft, setSavedDraft] = useState<EditorDraft>(() =>
    emails[0] ? draftFromEmail(emails[0]) : emptyDraft
  );
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedEmail = useMemo(
    () => emails.find((email) => email.id === selectedId) ?? null,
    [emails, selectedId]
  );

  const selectedRevisions = useMemo(
    () => revisions.filter((revision) => revision.email_id === selectedId),
    [revisions, selectedId]
  );

  const filteredEmails = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return emails.filter((email) => {
      const matchesContext =
        contextFilter === 'all' || email.distribution_context === contextFilter;
      const matchesStatus = statusFilter === 'all' || email.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        email.subject?.toLowerCase().includes(normalizedQuery) ||
        email.audience.toLowerCase().includes(normalizedQuery) ||
        email.recipient?.toLowerCase().includes(normalizedQuery) ||
        email.body.toLowerCase().includes(normalizedQuery);

      return matchesContext && matchesStatus && matchesQuery;
    });
  }, [contextFilter, emails, query, statusFilter]);

  const isDirty = useMemo(() => {
    if (isCreating) {
      return Object.values(draft).some((value) => value !== '') &&
        JSON.stringify(draft) !== JSON.stringify(emptyDraft);
    }

    return selectedEmail ? JSON.stringify(draft) !== JSON.stringify(savedDraft) : false;
  }, [draft, isCreating, savedDraft, selectedEmail]);

  function updateDraft<Key extends keyof EditorDraft>(key: Key, value: EditorDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function canLeaveEditor() {
    return !isDirty || window.confirm('Discard your unsaved email changes?');
  }

  function selectEmail(emailId: string) {
    if (!canLeaveEditor()) {
      return;
    }

    setIsCreating(false);
    setSelectedId(emailId);
    const email = emails.find((item) => item.id === emailId);
    if (email) {
      const nextDraft = draftFromEmail(email);
      setDraft(nextDraft);
      setSavedDraft(nextDraft);
    }
    setNotice(null);
  }

  function startNewEmail() {
    if (!canLeaveEditor()) {
      return;
    }

    setIsCreating(true);
    setSelectedId(null);
    setDraft(emptyDraft);
    setSavedDraft(emptyDraft);
    setNotice(null);
  }

  function runAction(
    action: (formData: FormData) => Promise<ActionResult>,
    formData: FormData,
    onSuccess?: (result: ActionResult) => void
  ) {
    startTransition(() => {
      void (async () => {
        const result = await action(formData);
        setNotice(result);

        if (result.ok) {
          onSuccess?.(result);
          router.refresh();
        }
      })();
    });
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (selectedEmail) {
      formData.set('emailId', selectedEmail.id);
      runAction(updateEmail, formData, () => setSavedDraft(draft));
      return;
    }

    runAction(createEmail, formData, (result) => {
      setIsCreating(false);
      setSelectedId(result.id ?? null);
      setSavedDraft(draft);
    });
  }

  function handleRestore(revision: AdminEmailRevision) {
    if (!selectedEmail) {
      return;
    }

    if (isDirty && !window.confirm('Restore this version and replace your unsaved changes?')) {
      return;
    }

    const formData = new FormData();
    formData.set('emailId', selectedEmail.id);
    formData.set('revisionId', String(revision.id));
    runAction(restoreEmailRevision, formData, () => {
      const restoredDraft = draftFromRevision(revision);
      setDraft(restoredDraft);
      setSavedDraft(restoredDraft);
    });
  }

  function handleDeleteDraft() {
    if (!selectedEmail || draft.status !== 'draft') {
      return;
    }

    const label = draft.subject || 'this untitled draft';
    const confirmed = window.confirm(
      `Permanently delete “${label}” and all of its version history? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.set('emailId', selectedEmail.id);
    runAction(deleteEmailDraft, formData, () => {
      const nextEmail = emails.find((email) => email.id !== selectedEmail.id) ?? null;
      setSelectedId(nextEmail?.id ?? null);
      setIsCreating(false);

      if (nextEmail) {
        const nextDraft = draftFromEmail(nextEmail);
        setDraft(nextDraft);
        setSavedDraft(nextDraft);
      } else {
        setDraft(emptyDraft);
        setSavedDraft(emptyDraft);
      }
    });
  }

  async function copyEmail() {
    const subjectLine = draft.subject ? `Subject: ${draft.subject}\n\n` : '';
    const plainText = `${subjectLine}${emailBodyToPlainText(draft.body)}`;
    const subjectHtml = draft.subject
      ? `<div><strong>Subject:</strong> ${escapeHtml(draft.subject)}</div><div><br></div>`
      : '';
    const outlookHtml =
      `<html><body><div style="${outlookBodyStyle}">` +
      `${subjectHtml}${emailBodyToHtml(draft.body)}` +
      '</div></body></html>';

    if ('ClipboardItem' in window && navigator.clipboard.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
          'text/html': new Blob([outlookHtml], {
            type: 'text/html',
          }),
        }),
      ]);
    } else {
      await navigator.clipboard.writeText(plainText);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function exportLibrary() {
    const payload = JSON.stringify(
      {
        exported_at: new Date().toISOString(),
        source: 'VAISI Admin Email Library',
        emails,
      },
      null,
      2
    );
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `vaisi-email-library-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[330px_minmax(0,1fr)]">
      <aside className="overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)]">
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-balance text-base font-semibold text-slate-950">Email library</h3>
              <p className="mt-1 text-sm text-slate-500 tabular-nums">{emails.length} saved emails</p>
            </div>
            <button
              type="button"
              onClick={exportLibrary}
              className="tap-scale inline-flex size-11 items-center justify-center rounded-xl text-slate-500 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] transition-[background-color,color,box-shadow] duration-150 hover:bg-slate-50 hover:text-slate-950"
              aria-label="Download email library as JSON"
              title="Download JSON"
            >
              <Download size={18} aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            onClick={startNewEmail}
            className="tap-scale mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 pl-4 pr-3.5 text-sm font-semibold text-white transition-[background-color,scale] duration-150 hover:bg-slate-800"
          >
            <Plus size={17} aria-hidden="true" />
            New email
          </button>
        </div>

        <div className="border-b border-slate-200 p-4">
          <label className="relative block">
            <span className="sr-only">Search emails</span>
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search subject, audience, or recipient"
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <select
              value={contextFilter}
              onChange={(event) => setContextFilter(event.target.value as ContextFilter)}
              className="min-h-10 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              aria-label="Filter by distribution"
            >
              <option value="all">All lists</option>
              <option value="announcement_list">Announcements</option>
              <option value="external_list">External lists</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className="min-h-10 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="draft">Drafts</option>
              <option value="sent">Sent</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="max-h-[62vh] overflow-y-auto p-2">
          {filteredEmails.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-slate-500">No emails match this view.</p>
          ) : (
            <div className="space-y-1">
              {filteredEmails.map((email) => {
                const StatusIcon = statusIcon(email.status);
                const selected = email.id === selectedId && !isCreating;

                return (
                  <button
                    key={email.id}
                    type="button"
                    onClick={() => selectEmail(email.id)}
                    className={`tap-scale w-full rounded-xl px-3 py-3 text-left transition-[background-color,box-shadow,scale] duration-150 ${
                      selected
                        ? 'bg-orange-50 shadow-[inset_3px_0_0_#ea580c]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg ${
                          email.distribution_context === 'announcement_list'
                            ? 'bg-[#232D4B]/8 text-[#232D4B]'
                            : 'bg-violet-50 text-violet-700'
                        }`}
                      >
                        <StatusIcon size={16} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-950">
                          {email.subject || 'No subject recorded'}
                        </span>
                        <span className="mt-1 block truncate text-xs text-slate-500">
                          {email.audience}
                        </span>
                        <span className="mt-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          <span>{statusLabel(email.status)}</span>
                          <span aria-hidden="true">·</span>
                          <span>{email.distribution_context === 'announcement_list' ? 'Announcement' : 'External'}</span>
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      <main className="min-w-0">
        {selectedEmail || isCreating ? (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="rounded-2xl bg-white p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)] sm:p-6">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {isCreating ? 'New draft' : statusLabel(draft.status)}
                    </span>
                    {isDirty ? (
                      <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Unsaved changes
                      </span>
                    ) : (
                      <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Saved
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-balance text-xl font-semibold text-slate-950">
                    {isCreating ? 'Create an email' : draft.subject || 'Untitled email'}
                  </h3>
                  {selectedEmail ? (
                    <p className="mt-1 text-sm text-slate-500 tabular-nums">
                      Last saved {formatTimestamp(selectedEmail.updated_at)}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedEmail && draft.status === 'draft' ? (
                    <button
                      type="button"
                      onClick={handleDeleteDraft}
                      disabled={isPending}
                      className="tap-scale inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white pl-4 pr-3.5 text-sm font-semibold text-red-700 shadow-[0_0_0_1px_rgba(185,28,28,0.22)] transition-[background-color,color,scale] duration-150 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={17} aria-hidden="true" />
                      Delete draft
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void copyEmail()}
                    disabled={!draft.body}
                    className="tap-scale inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white pl-4 pr-3.5 text-sm font-semibold text-slate-700 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] transition-[background-color,color,scale] duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.span
                        key={copied ? 'copied' : 'copy'}
                        initial={{ opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
                        transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                      >
                        {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
                      </motion.span>
                    </AnimatePresence>
                    {copied ? 'Copied for Outlook' : 'Copy for Outlook'}
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || !isDirty || !draft.body.trim()}
                    className="tap-scale inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 pl-4 pr-3.5 text-sm font-semibold text-white transition-[background-color,scale] duration-150 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    <Save size={17} aria-hidden="true" />
                    {isPending ? 'Saving…' : 'Save email'}
                  </button>
                </div>
              </div>

              {notice ? (
                <div
                  className={`mt-5 rounded-xl px-4 py-3 text-sm ${
                    notice.ok
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                  role={notice.ok ? 'status' : 'alert'}
                >
                  {notice.message}
                </div>
              ) : null}

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <label className="text-sm font-medium text-slate-700 sm:col-span-2 xl:col-span-4">
                  Subject
                  <input
                    name="subject"
                    value={draft.subject}
                    onChange={(event) => updateDraft('subject', event.target.value)}
                    placeholder="Email subject"
                    className={inputClass}
                  />
                </label>
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                  Audience
                  <input
                    name="audience"
                    required
                    value={draft.audience}
                    onChange={(event) => updateDraft('audience', event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                  Recipient
                  <input
                    name="recipient"
                    value={draft.recipient}
                    onChange={(event) => updateDraft('recipient', event.target.value)}
                    placeholder="person-or-list@virginia.edu"
                    className={inputClass}
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Distribution
                  <select
                    name="distributionContext"
                    value={draft.distributionContext}
                    onChange={(event) =>
                      updateDraft('distributionContext', event.target.value as AdminEmailDistribution)
                    }
                    className={inputClass}
                  >
                    <option value="announcement_list">VAISI announcement list</option>
                    <option value="external_list">Separate UVA list</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Status
                  <select
                    name="status"
                    value={draft.status}
                    onChange={(event) => updateDraft('status', event.target.value as AdminEmailStatus)}
                    className={inputClass}
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Sent date
                  <input
                    name="sentDate"
                    type="date"
                    value={draft.sentDate}
                    onChange={(event) => updateDraft('sentDate', event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="text-sm font-medium text-slate-700 sm:col-span-2 xl:col-span-3">
                  Style influence
                  <select
                    name="styleWeight"
                    value={draft.styleWeight}
                    onChange={(event) =>
                      updateDraft('styleWeight', event.target.value as AdminEmailStyleWeight)
                    }
                    className={inputClass}
                  >
                    <option value="primary">Primary — confirmed sent style example</option>
                    <option value="secondary">Secondary — useful with caution</option>
                    <option value="excluded">Excluded — do not use for announcement voice</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
              <div className="rounded-2xl bg-white p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)] sm:p-6">
                <div className="text-sm font-medium text-slate-700">
                  Email body
                  <input type="hidden" name="body" value={draft.body} />
                  <RichTextEmailEditor
                    value={draft.body}
                    onChange={(value) => updateDraft('body', value)}
                  />
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Format text and links here, then use Copy for Outlook to preserve them when pasting into Outlook.
                </p>
                <label className="mt-5 block text-sm font-medium text-slate-700">
                  Internal notes
                  <textarea
                    name="sourceNotes"
                    rows={4}
                    value={draft.sourceNotes}
                    onChange={(event) => updateDraft('sourceNotes', event.target.value)}
                    placeholder="Provenance, caveats, or drafting notes…"
                    className={`${inputClass} resize-y leading-6`}
                  />
                </label>
              </div>

              <div className="space-y-5">
                <section className="overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)]">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Mail size={17} className="text-orange-600" aria-hidden="true" />
                      <h4 className="text-base font-semibold text-slate-950">Email preview</h4>
                    </div>
                  </div>
                  <div className="p-5">
                    {draft.subject ? (
                      <div className="border-b border-slate-100 pb-4">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Subject</span>
                        <p className="mt-1 text-pretty font-semibold text-slate-950">{draft.subject}</p>
                      </div>
                    ) : null}
                    {draft.body ? (
                      <div
                        className="mt-4 text-sm leading-6 text-slate-700 [&_a]:text-[#0563c1] [&_a]:underline [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-7 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-7"
                        dangerouslySetInnerHTML={{ __html: emailBodyToHtml(draft.body) }}
                      />
                    ) : (
                      <p className="mt-4 text-sm leading-6 text-slate-500">Your email preview will appear here.</p>
                    )}
                  </div>
                </section>

                <section className="overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <History size={17} className="text-orange-600" aria-hidden="true" />
                      <h4 className="text-base font-semibold text-slate-950">Version history</h4>
                    </div>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 tabular-nums">
                      {selectedRevisions.length}
                    </span>
                  </div>
                  <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                    {!selectedEmail ? (
                      <p className="p-5 text-sm text-slate-500">Save this email before version history begins.</p>
                    ) : selectedRevisions.length === 0 ? (
                      <p className="p-5 text-sm text-slate-500">Earlier versions will appear after the first edit.</p>
                    ) : (
                      selectedRevisions.map((revision) => (
                        <div key={revision.id} className="flex items-center justify-between gap-3 p-4">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {revision.subject || 'No subject'}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 tabular-nums">
                              <Clock3 size={13} aria-hidden="true" />
                              {formatTimestamp(revision.saved_at)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRestore(revision)}
                            disabled={isPending}
                            className="tap-scale inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-slate-600 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] transition-[background-color,color,scale] duration-150 hover:bg-slate-50 hover:text-slate-950 disabled:opacity-50"
                          >
                            <RotateCcw size={14} aria-hidden="true" />
                            Restore
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {selectedEmail ? (
                  <section className="rounded-2xl bg-[#232D4B] p-5 text-white shadow-[0_12px_30px_rgba(35,45,75,0.18)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">Record details</p>
                    <dl className="mt-4 grid gap-3 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-slate-300">Sent</dt>
                        <dd className="font-medium tabular-nums">{formatDate(selectedEmail.sent_date)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-slate-300">Versions</dt>
                        <dd className="font-medium tabular-nums">{selectedRevisions.length + 1}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-slate-300">Style use</dt>
                        <dd className="font-medium">{titleCase(selectedEmail.style_weight)}</dd>
                      </div>
                    </dl>
                  </section>
                ) : null}
              </div>
            </div>
          </form>
        ) : (
          <div className="flex min-h-[520px] items-center justify-center rounded-2xl bg-white p-8 text-center shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)]">
            <div className="max-w-sm">
              <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                <Mail size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-balance text-lg font-semibold text-slate-950">Start the email library</h3>
              <p className="mt-2 text-pretty text-sm leading-6 text-slate-500">
                Create a draft to begin writing, saving, and building version history.
              </p>
              <button
                type="button"
                onClick={startNewEmail}
                className="tap-scale mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 pl-4 pr-3.5 text-sm font-semibold text-white transition-[background-color,scale] duration-150 hover:bg-slate-800"
              >
                <Plus size={17} aria-hidden="true" />
                New email
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
