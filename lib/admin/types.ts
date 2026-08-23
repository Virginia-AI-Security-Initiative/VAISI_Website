export type ExecMemberEmail = {
  id: string;
  member_id: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ExecMember = {
  id: string;
  name: string;
  normalized_name: string;
  is_active: boolean;
  is_assignable: boolean;
  created_at: string;
  updated_at: string;
  emails: ExecMemberEmail[];
};

export type AdminTask = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  is_due_tbd: boolean;
  primary_owner_id: string;
  external_url: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  secondary_owner_ids: string[];
};

export type AdminEvent = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  primary_owner_id: string;
  created_at: string;
  updated_at: string;
  secondary_owner_ids: string[];
};

export type AdminEmailDistribution = 'announcement_list' | 'external_list';
export type AdminEmailStatus = 'draft' | 'sent' | 'archived';
export type AdminEmailStyleWeight = 'primary' | 'secondary' | 'excluded';

export type AdminEmail = {
  id: string;
  slug: string;
  subject: string | null;
  body: string;
  distribution_context: AdminEmailDistribution;
  audience: string;
  recipient: string | null;
  status: AdminEmailStatus;
  sent_date: string | null;
  style_weight: AdminEmailStyleWeight;
  source_notes: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminEmailRevision = {
  id: number;
  email_id: string;
  subject: string | null;
  body: string;
  distribution_context: AdminEmailDistribution;
  audience: string;
  recipient: string | null;
  status: AdminEmailStatus;
  sent_date: string | null;
  style_weight: AdminEmailStyleWeight;
  source_notes: string | null;
  saved_by: string | null;
  saved_at: string;
};

export type CurrentExecAccess = {
  member: ExecMember;
  email: ExecMemberEmail;
};

export type AdminDashboardData = {
  members: ExecMember[];
  tasks: AdminTask[];
  events: AdminEvent[];
  emails: AdminEmail[];
  emailRevisions: AdminEmailRevision[];
};

export type ActionResult = {
  ok: boolean;
  message: string;
  id?: string;
};
