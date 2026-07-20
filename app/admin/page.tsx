import { redirect } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import AdminDashboard from '@/app/admin/AdminDashboard';
import { getAdminDashboardData, getCurrentExecAccess } from '@/lib/admin/data';
import { createSupabaseServerClient, getSupabaseConfig } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function MissingSupabaseSetup() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-orange-500 text-white">
          <ShieldCheck aria-hidden="true" size={24} />
        </div>
        <h1 className="text-3xl font-semibold">VAISI Admin</h1>
        <p className="mt-4 text-slate-300">
          Supabase is not configured for this environment. Add
          {' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>
          {' '}
          and
          {' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5">
            NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
          </code>
          .
        </p>
      </div>
    </div>
  );
}

function AdminSignIn() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-orange-500 text-white">
          <ShieldCheck aria-hidden="true" size={24} />
        </div>
        <h1 className="text-3xl font-semibold">VAISI Admin</h1>
        <p className="mt-4 max-w-lg text-slate-300">
          Exec-only planning space for tasks, events, and calendar coordination.
        </p>
        <div className="mt-8">
          <a
            href="/auth/sign-in?next=/admin"
            className="tap-scale inline-flex min-h-12 items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
          >
            Continue with Google
          </a>
        </div>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  if (!getSupabaseConfig()) {
    return <MissingSupabaseSetup />;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return <AdminSignIn />;
  }

  const access = await getCurrentExecAccess(supabase, user.email);

  if (!access) {
    redirect('/');
  }

  const data = await getAdminDashboardData(supabase);

  return (
    <AdminDashboard
      currentEmail={user.email}
      currentMemberId={access.member.id}
      data={data}
    />
  );
}
