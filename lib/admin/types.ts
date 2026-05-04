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

export type CurrentExecAccess = {
  member: ExecMember;
  email: ExecMemberEmail;
};

export type AdminDashboardData = {
  members: ExecMember[];
  tasks: AdminTask[];
  events: AdminEvent[];
};

export type ActionResult = {
  ok: boolean;
  message: string;
};
