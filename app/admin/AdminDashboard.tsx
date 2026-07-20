'use client';

import { FormEvent, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Link as LinkIcon,
  ListChecks,
  LogOut,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  addExecAccess,
  createEvent,
  createTask,
  deleteEvent,
  deleteTask,
  removeExecAccess,
  setTaskCompletion,
  updateEvent,
  updateTask,
} from '@/app/admin/actions';
import type { ActionResult, AdminDashboardData, AdminEvent, AdminTask, ExecMember } from '@/lib/admin/types';

type TabKey = 'tasks' | 'events' | 'calendar' | 'exec';
type FilterMode = 'all' | 'primary' | 'involved';
type AdminAction = (formData: FormData) => Promise<ActionResult>;

const tabItems: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'tasks', label: 'Tasks', icon: ListChecks },
  { key: 'events', label: 'Events', icon: CalendarDays },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays },
  { key: 'exec', label: 'Exec Board', icon: Users },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function parseIsoDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parseIsoDate(value));
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatTime(value: string | null) {
  if (!value) {
    return '';
  }

  const [hours, minutes] = value.split(':');
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatEventTime(event: AdminEvent) {
  const start = formatTime(event.start_time);
  const end = formatTime(event.end_time);

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start || 'Time TBD';
}

function taskComparator(a: AdminTask, b: AdminTask) {
  if (a.is_completed !== b.is_completed) {
    return Number(a.is_completed) - Number(b.is_completed);
  }

  if (a.is_due_tbd !== b.is_due_tbd) {
    return Number(a.is_due_tbd) - Number(b.is_due_tbd);
  }

  if (a.due_date && b.due_date && a.due_date !== b.due_date) {
    return a.due_date.localeCompare(b.due_date);
  }

  if (a.due_date && !b.due_date) {
    return -1;
  }

  if (!a.due_date && b.due_date) {
    return 1;
  }

  return b.created_at.localeCompare(a.created_at);
}

function eventComparator(a: AdminEvent, b: AdminEvent) {
  if (a.event_date !== b.event_date) {
    return a.event_date.localeCompare(b.event_date);
  }

  if (a.start_time && b.start_time && a.start_time !== b.start_time) {
    return a.start_time.localeCompare(b.start_time);
  }

  if (a.start_time && !b.start_time) {
    return -1;
  }

  if (!a.start_time && b.start_time) {
    return 1;
  }

  return b.created_at.localeCompare(a.created_at);
}

function getMemberName(memberMap: Map<string, ExecMember>, memberId: string) {
  return memberMap.get(memberId)?.name ?? 'Removed exec';
}

function getSecondaryNames(memberMap: Map<string, ExecMember>, ownerIds: string[]) {
  return ownerIds.map((id) => getMemberName(memberMap, id)).join(', ');
}

function getCalendarCells(monthDate: Date) {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const last = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const cells: Array<string | null> = [];

  for (let i = 0; i < first.getDay(); i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= last.getDate(); day += 1) {
    cells.push(toIsoDate(new Date(monthDate.getFullYear(), monthDate.getMonth(), day)));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function OwnerSelect({
  members,
  label,
  name = 'primaryOwnerId',
  defaultValue = '',
}: {
  members: ExecMember[];
  label: string;
  name?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <select
        name={name}
        required
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
      >
        <option value="">Select owner</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function SecondaryOwnerPicker({
  members,
  defaultSelectedIds = [],
}: {
  members: ExecMember[];
  defaultSelectedIds?: string[];
}) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-700">Secondary owners</p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {members.map((member) => (
          <label
            key={member.id}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <input
              type="checkbox"
              name="secondaryOwnerIds"
              value={member.id}
              defaultChecked={defaultSelectedIds.includes(member.id)}
              className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            />
            <span>{member.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function OwnerFilter({
  label,
  mode,
  ownerId,
  members,
  onModeChange,
  onOwnerChange,
}: {
  label: string;
  mode: FilterMode;
  ownerId: string;
  members: ExecMember[];
  onModeChange: (value: FilterMode) => void;
  onOwnerChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
      <label className="text-sm font-medium text-slate-700">
        {label}
        <select
          value={mode}
          onChange={(event) => onModeChange(event.target.value as FilterMode)}
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        >
          <option value="all">All</option>
          <option value="primary">Primary owner</option>
          <option value="involved">Involvement</option>
        </select>
      </label>
      <label className="text-sm font-medium text-slate-700">
        Exec
        <select
          value={ownerId}
          onChange={(event) => onOwnerChange(event.target.value)}
          disabled={mode === 'all'}
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors disabled:bg-slate-100 disabled:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        >
          <option value="">Choose exec</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function TaskEditForm({
  task,
  members,
  isPending,
  onCancel,
  onSubmit,
}: {
  task: AdminTask;
  members: ExecMember[];
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="taskId" value={task.id} />
      <label className="block text-sm font-medium text-slate-700">
        Title
        <input
          name="title"
          required
          defaultValue={task.title}
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Description
        <textarea
          name="description"
          rows={4}
          defaultValue={task.description ?? ''}
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="block text-sm font-medium text-slate-700">
          Due date
          <input
            name="dueDate"
            type="date"
            defaultValue={task.due_date ?? ''}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />
        </label>
        <label className="mt-7 flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
          <input
            name="isDueTbd"
            type="checkbox"
            defaultChecked={task.is_due_tbd}
            className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
          />
          TBD
        </label>
      </div>
      <OwnerSelect
        members={members}
        label="Primary owner"
        defaultValue={task.primary_owner_id}
      />
      <SecondaryOwnerPicker
        members={members}
        defaultSelectedIds={task.secondary_owner_ids}
      />
      <label className="block text-sm font-medium text-slate-700">
        External link
        <div className="mt-2 flex items-center rounded-md border border-slate-300 bg-white px-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
          <LinkIcon size={16} className="text-slate-400" aria-hidden="true" />
          <input
            name="externalUrl"
            type="url"
            placeholder="https://..."
            defaultValue={task.external_url ?? ''}
            className="w-full border-0 px-2 py-2 text-sm outline-none"
          />
        </div>
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="tap-scale inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <Save size={16} aria-hidden="true" />
          Save Task
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="tap-scale inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <X size={16} aria-hidden="true" />
          Cancel
        </button>
      </div>
    </form>
  );
}

function EventEditForm({
  event,
  members,
  isPending,
  onCancel,
  onSubmit,
}: {
  event: AdminEvent;
  members: ExecMember[];
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="eventId" value={event.id} />
      <label className="block text-sm font-medium text-slate-700">
        Title
        <input
          name="title"
          required
          defaultValue={event.title}
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Description
        <textarea
          name="description"
          rows={3}
          defaultValue={event.description ?? ''}
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Date
          <input
            name="eventDate"
            type="date"
            required
            defaultValue={event.event_date}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Start
          <input
            name="startTime"
            type="time"
            defaultValue={event.start_time ?? ''}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          End
          <input
            name="endTime"
            type="time"
            defaultValue={event.end_time ?? ''}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-700">
        Location
        <input
          name="location"
          defaultValue={event.location ?? ''}
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />
      </label>
      <OwnerSelect
        members={members}
        label="Primary owner"
        defaultValue={event.primary_owner_id}
      />
      <SecondaryOwnerPicker
        members={members}
        defaultSelectedIds={event.secondary_owner_ids}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="tap-scale inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <Save size={16} aria-hidden="true" />
          Save Event
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="tap-scale inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <X size={16} aria-hidden="true" />
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminDashboard({
  currentEmail,
  currentMemberId,
  data,
}: {
  currentEmail: string;
  currentMemberId: string;
  data: AdminDashboardData;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('tasks');
  const [taskFilterMode, setTaskFilterMode] = useState<FilterMode>('all');
  const [taskFilterMemberId, setTaskFilterMemberId] = useState('');
  const [eventFilterMode, setEventFilterMode] = useState<FilterMode>('all');
  const [eventFilterMemberId, setEventFilterMemberId] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const memberMap = useMemo(() => {
    return new Map(data.members.map((member) => [member.id, member]));
  }, [data.members]);

  const ownerOptions = useMemo(() => {
    return data.members
      .filter((member) => member.is_active && member.is_assignable)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data.members]);

  const filteredTasks = useMemo(() => {
    return [...data.tasks]
      .filter((task) => {
        if (taskFilterMode === 'all') {
          return true;
        }

        if (!taskFilterMemberId) {
          return true;
        }

        if (taskFilterMode === 'primary') {
          return task.primary_owner_id === taskFilterMemberId;
        }

        return (
          task.primary_owner_id === taskFilterMemberId ||
          task.secondary_owner_ids.includes(taskFilterMemberId)
        );
      })
      .sort(taskComparator);
  }, [data.tasks, taskFilterMemberId, taskFilterMode]);

  const filteredEvents = useMemo(() => {
    return [...data.events]
      .filter((event) => {
        if (eventFilterMode === 'all') {
          return true;
        }

        if (!eventFilterMemberId) {
          return true;
        }

        if (eventFilterMode === 'primary') {
          return event.primary_owner_id === eventFilterMemberId;
        }

        return (
          event.primary_owner_id === eventFilterMemberId ||
          event.secondary_owner_ids.includes(eventFilterMemberId)
        );
      })
      .sort(eventComparator);
  }, [data.events, eventFilterMemberId, eventFilterMode]);

  const todayIso = toIsoDate(new Date());
  const upcomingEvents = useMemo(() => {
    return [...data.events]
      .filter((event) => event.event_date >= todayIso)
      .sort(eventComparator)
      .slice(0, 8);
  }, [data.events, todayIso]);

  const calendarCells = useMemo(() => getCalendarCells(calendarMonth), [calendarMonth]);
  const eventsByDate = useMemo(() => {
    const map = new Map<string, AdminEvent[]>();

    for (const event of data.events) {
      const events = map.get(event.event_date) ?? [];
      events.push(event);
      map.set(event.event_date, events.sort(eventComparator));
    }

    return map;
  }, [data.events]);

  const activeAccessRows = useMemo(() => {
    return data.members
      .flatMap((member) =>
        member.emails
          .filter((email) => email.is_active)
          .map((email) => ({
            email,
            member,
          }))
      )
      .sort((a, b) => a.member.name.localeCompare(b.member.name) || a.email.email.localeCompare(b.email.email));
  }, [data.members]);

  function runAction(
    action: AdminAction,
    formData: FormData,
    resetForm?: HTMLFormElement,
    onSuccess?: () => void
  ) {
    startTransition(() => {
      void (async () => {
        const result = await action(formData);
        setNotice(result);

        if (result.ok) {
          resetForm?.reset();
          onSuccess?.();
          router.refresh();
        }
      })();
    });
  }

  function handleSubmit(action: AdminAction, onSuccess?: () => void) {
    return (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      runAction(action, new FormData(form), form, onSuccess);
    };
  }

  function handleDelete(action: AdminAction, key: string, value: string) {
    const formData = new FormData();
    formData.set(key, value);
    runAction(action, formData);
  }

  function handleTaskCheck(task: AdminTask, isCompleted: boolean) {
    const formData = new FormData();
    formData.set('taskId', task.id);
    formData.set('isCompleted', String(isCompleted));
    runAction(setTaskCompletion, formData);
  }

  function changeCalendarMonth(delta: number) {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-slate-950 px-4 py-4 text-white lg:w-64 lg:border-b-0 lg:border-r lg:border-slate-800 lg:px-5 lg:py-6">
          <div className="flex items-center justify-between gap-4 lg:block">
            <div>
              <p className="text-xs font-semibold uppercase text-orange-300">VAISI</p>
              <h1 className="mt-1 text-xl font-semibold">Admin Dashboard</h1>
              <p className="mt-2 hidden text-sm text-slate-400 lg:block">{currentEmail}</p>
            </div>
            <a
              href="/auth/sign-out"
              className="tap-scale inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-slate-200 hover:bg-white/10"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={18} aria-hidden="true" />
            </a>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto lg:mt-8 lg:block lg:space-y-2">
            {tabItems.map((item) => {
              const Icon = item.icon;
              const selected = activeTab === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveTab(item.key)}
                  className={cx(
                    'tap-scale inline-flex min-h-10 min-w-max items-center gap-3 rounded-md px-3 py-2 text-sm font-medium lg:w-full',
                    selected
                      ? 'bg-white text-slate-950'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon size={17} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <header className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Signed in as {getMemberName(memberMap, currentMemberId)}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                {tabItems.find((item) => item.key === activeTab)?.label}
              </h2>
            </div>
            {notice?.ok ? (
              <div
                className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
              >
                {notice.message}
              </div>
            ) : null}
          </header>

          {activeTab === 'tasks' ? (
            <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
              <form
                onSubmit={handleSubmit(createTask)}
                className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Plus size={18} className="text-orange-600" aria-hidden="true" />
                  <h3 className="text-base font-semibold">Create Task</h3>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Title
                    <input
                      name="title"
                      required
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Description
                    <textarea
                      name="description"
                      rows={4}
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <label className="block text-sm font-medium text-slate-700">
                      Due date
                      <input
                        name="dueDate"
                        type="date"
                        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      />
                    </label>
                    <label className="mt-7 flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                      <input
                        name="isDueTbd"
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                      />
                      TBD
                    </label>
                  </div>
                  <OwnerSelect members={ownerOptions} label="Primary owner" />
                  <SecondaryOwnerPicker members={ownerOptions} />
                  <label className="block text-sm font-medium text-slate-700">
                    External link
                    <div className="mt-2 flex items-center rounded-md border border-slate-300 bg-white px-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
                      <LinkIcon size={16} className="text-slate-400" aria-hidden="true" />
                      <input
                        name="externalUrl"
                        type="url"
                        placeholder="https://..."
                        className="w-full border-0 px-2 py-2 text-sm outline-none"
                      />
                    </div>
                  </label>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="tap-scale inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    <Plus size={16} aria-hidden="true" />
                    Add Task
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                  <OwnerFilter
                    label="Task filter"
                    mode={taskFilterMode}
                    ownerId={taskFilterMemberId}
                    members={ownerOptions}
                    onModeChange={setTaskFilterMode}
                    onOwnerChange={setTaskFilterMemberId}
                  />
                </div>
                <div className="space-y-3">
                  {filteredTasks.length === 0 ? (
                    <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                      No tasks match this view.
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <article
                        key={task.id}
                        className={cx(
                          'rounded-md border border-slate-200 bg-white p-4 shadow-sm',
                          task.is_completed && 'bg-slate-50'
                        )}
                      >
                        {editingTaskId === task.id ? (
                          <TaskEditForm
                            task={task}
                            members={ownerOptions}
                            isPending={isPending}
                            onCancel={() => setEditingTaskId(null)}
                            onSubmit={handleSubmit(updateTask, () => setEditingTaskId(null))}
                          />
                        ) : (
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={task.is_completed}
                              disabled={isPending}
                              onChange={(event) => handleTaskCheck(task, event.target.checked)}
                              className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                              aria-label={task.is_completed ? 'Reopen task' : 'Complete task'}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <h3
                                    className={cx(
                                      'text-base font-semibold text-slate-950',
                                      task.is_completed && 'text-slate-500 line-through'
                                    )}
                                  >
                                    {task.title}
                                  </h3>
                                  <p className="mt-1 text-sm text-slate-600">
                                    {getMemberName(memberMap, task.primary_owner_id)}
                                    {task.secondary_owner_ids.length > 0
                                      ? ` with ${getSecondaryNames(memberMap, task.secondary_owner_ids)}`
                                      : ''}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => setEditingTaskId(task.id)}
                                    className="tap-scale inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-700 disabled:cursor-not-allowed"
                                    aria-label="Edit task"
                                    title="Edit task"
                                  >
                                    <Pencil size={16} aria-hidden="true" />
                                  </button>
                                  {task.external_url ? (
                                    <a
                                      href={task.external_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="tap-scale inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-700"
                                      aria-label="Open external link"
                                      title="Open external link"
                                    >
                                      <ExternalLink size={16} aria-hidden="true" />
                                    </a>
                                  ) : null}
                                  <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => handleDelete(deleteTask, 'taskId', task.id)}
                                    className="tap-scale inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed"
                                    aria-label="Delete task"
                                    title="Delete task"
                                  >
                                    <Trash2 size={16} aria-hidden="true" />
                                  </button>
                                </div>
                              </div>
                              {task.description ? (
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                  {task.description}
                                </p>
                              ) : null}
                              <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
                                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
                                  {task.is_due_tbd ? 'Due TBD' : `Due ${formatDate(task.due_date ?? todayIso)}`}
                                </span>
                                {task.is_completed ? (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700">
                                    <Check size={13} aria-hidden="true" />
                                    Complete
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        )}
                      </article>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'events' ? (
            <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
              <form
                onSubmit={handleSubmit(createEvent)}
                className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Plus size={18} className="text-orange-600" aria-hidden="true" />
                  <h3 className="text-base font-semibold">Create Event</h3>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Title
                    <input
                      name="title"
                      required
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Description
                    <textarea
                      name="description"
                      rows={3}
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Date
                      <input
                        name="eventDate"
                        type="date"
                        required
                        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Start
                      <input
                        name="startTime"
                        type="time"
                        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      End
                      <input
                        name="endTime"
                        type="time"
                        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      />
                    </label>
                  </div>
                  <label className="block text-sm font-medium text-slate-700">
                    Location
                    <input
                      name="location"
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </label>
                  <OwnerSelect members={ownerOptions} label="Primary owner" />
                  <SecondaryOwnerPicker members={ownerOptions} />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="tap-scale inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    <Plus size={16} aria-hidden="true" />
                    Add Event
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                  <OwnerFilter
                    label="Event filter"
                    mode={eventFilterMode}
                    ownerId={eventFilterMemberId}
                    members={ownerOptions}
                    onModeChange={setEventFilterMode}
                    onOwnerChange={setEventFilterMemberId}
                  />
                </div>
                <div className="space-y-3">
                  {filteredEvents.length === 0 ? (
                    <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                      No events match this view.
                    </div>
                  ) : (
                    filteredEvents.map((event) => (
	                      <article
	                        key={event.id}
	                        className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
	                      >
	                        {editingEventId === event.id ? (
	                          <EventEditForm
	                            event={event}
	                            members={ownerOptions}
	                            isPending={isPending}
	                            onCancel={() => setEditingEventId(null)}
	                            onSubmit={handleSubmit(updateEvent, () => setEditingEventId(null))}
	                          />
	                        ) : (
	                          <>
	                            <div className="flex flex-wrap items-start justify-between gap-3">
	                              <div>
	                                <h3 className="text-base font-semibold text-slate-950">{event.title}</h3>
	                                <p className="mt-1 text-sm text-slate-600">
	                                  {getMemberName(memberMap, event.primary_owner_id)}
	                                  {event.secondary_owner_ids.length > 0
	                                    ? ` with ${getSecondaryNames(memberMap, event.secondary_owner_ids)}`
	                                    : ''}
	                                </p>
	                              </div>
	                              <div className="flex items-center gap-2">
	                                <button
	                                  type="button"
	                                  disabled={isPending}
	                                  onClick={() => setEditingEventId(event.id)}
	                                  className="tap-scale inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-700 disabled:cursor-not-allowed"
	                                  aria-label="Edit event"
	                                  title="Edit event"
	                                >
	                                  <Pencil size={16} aria-hidden="true" />
	                                </button>
	                                <button
	                                  type="button"
	                                  disabled={isPending}
	                                  onClick={() => handleDelete(deleteEvent, 'eventId', event.id)}
	                                  className="tap-scale inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed"
	                                  aria-label="Delete event"
	                                  title="Delete event"
	                                >
	                                  <Trash2 size={16} aria-hidden="true" />
	                                </button>
	                              </div>
	                            </div>
	                            {event.description ? (
	                              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
	                                {event.description}
	                              </p>
	                            ) : null}
	                            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
	                              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
	                                <CalendarDays size={13} aria-hidden="true" />
	                                {formatDate(event.event_date)}
	                              </span>
	                              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
	                                <Clock size={13} aria-hidden="true" />
	                                {formatEventTime(event)}
	                              </span>
	                              {event.location ? (
	                                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
	                                  <MapPin size={13} aria-hidden="true" />
	                                  {event.location}
	                                </span>
	                              ) : null}
	                            </div>
	                          </>
	                        )}
	                      </article>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'calendar' ? (
            <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
              <div className="rounded-md border border-slate-200 bg-white shadow-sm tabular-nums">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <h3 className="text-base font-semibold">{formatMonth(calendarMonth)}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeCalendarMonth(-1)}
                      className="tap-scale inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                      aria-label="Previous month"
                      title="Previous month"
                    >
                      <ChevronLeft size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarMonth(new Date())}
                      className="tap-scale min-h-10 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => changeCalendarMonth(1)}
                      className="tap-scale inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                      aria-label="Next month"
                      title="Next month"
                    >
                      <ChevronRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold uppercase text-slate-500">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="px-2 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {calendarCells.map((day, index) => {
                    const dayEvents = day ? eventsByDate.get(day) ?? [] : [];
                    const isToday = day === todayIso;

                    return (
                      <div
                        key={`${day ?? 'blank'}-${index}`}
                        className={cx(
                          'min-h-28 border-b border-r border-slate-100 p-2 text-sm',
                          !day && 'bg-slate-50/70'
                        )}
                      >
                        {day ? (
                          <>
                            <div
                              className={cx(
                                'mb-2 flex h-7 w-7 items-center justify-center rounded-md font-semibold',
                                isToday ? 'bg-orange-600 text-white' : 'text-slate-700'
                              )}
                            >
                              {parseIsoDate(day).getDate()}
                            </div>
                            <div className="space-y-1">
                              {dayEvents.slice(0, 3).map((event) => (
                                <div
                                  key={event.id}
                                  className="truncate rounded bg-[#232D4B] px-2 py-1 text-xs font-medium text-white"
                                  title={event.title}
                                >
                                  {event.title}
                                </div>
                              ))}
                              {dayEvents.length > 3 ? (
                                <div className="text-xs font-medium text-slate-500">
                                  +{dayEvents.length - 3} more
                                </div>
                              ) : null}
                            </div>
                          </>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-base font-semibold">Upcoming Events</h3>
                <div className="mt-4 space-y-3">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-sm text-slate-500">No upcoming events.</p>
                  ) : (
                    upcomingEvents.map((event) => (
                      <div key={event.id} className="border-b border-slate-100 pb-3 last:border-0">
                        <p className="font-medium text-slate-950">{event.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{formatDate(event.event_date)}</p>
                        <p className="mt-1 text-sm text-slate-500">{formatEventTime(event)}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'exec' ? (
            <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
              <form
                onSubmit={handleSubmit(addExecAccess)}
                className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Plus size={18} className="text-orange-600" aria-hidden="true" />
                  <h3 className="text-base font-semibold">Add Access</h3>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Name
                    <input
                      name="name"
                      required
                      placeholder="Charlie Meyer"
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Google email
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="tap-scale inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    <Plus size={16} aria-hidden="true" />
                    Add Email
                  </button>
                </div>
              </form>

              <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                  <h3 className="text-base font-semibold">Approved Google Accounts</h3>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 tabular-nums">
                    {activeAccessRows.length} active
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {activeAccessRows.map(({ email, member }) => (
                    <div
                      key={email.id}
                      className="grid gap-3 px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-slate-950">{member.name}</p>
                          {member.is_assignable ? (
                            <span className="rounded-md bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-700">
                              Assignable
                            </span>
                          ) : (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                              Access only
                            </span>
                          )}
                        </div>
                        <p className="mt-1 truncate text-sm text-slate-600">{email.email}</p>
                      </div>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDelete(removeExecAccess, 'emailId', email.id)}
                        className="tap-scale inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={15} aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
      {notice && !notice.ok ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="admin-error-title"
          aria-describedby="admin-error-message"
        >
          <div className="w-full max-w-md rounded-md border border-red-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-700">
                <AlertTriangle size={21} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 id="admin-error-title" className="text-base font-semibold text-slate-950">
                  Could not save
                </h3>
                <p id="admin-error-message" className="mt-2 text-sm leading-6 text-slate-700">
                  {notice.message}
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setNotice(null)}
                className="tap-scale inline-flex min-h-10 items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
