import { NextRequest, NextResponse } from 'next/server';
import { getCurrentExecAccess } from '@/lib/admin/data';
import { createSupabaseServerClient, getSupabaseConfig } from '@/lib/supabase/server';
import { siteUrl } from '@/lib/site-url';

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/admin';
  }

  return value;
}

export async function GET(request: NextRequest) {
  if (!getSupabaseConfig()) {
    return NextResponse.redirect(siteUrl('/', request));
  }

  const code = request.nextUrl.searchParams.get('code');
  const nextPath = safeNextPath(request.nextUrl.searchParams.get('next'));

  if (!code) {
    return NextResponse.redirect(siteUrl('/', request));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(siteUrl('/', request));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    await supabase.auth.signOut();
    return NextResponse.redirect(siteUrl('/', request));
  }

  const access = await getCurrentExecAccess(supabase, user.email);

  if (!access) {
    await supabase.auth.signOut();
    return NextResponse.redirect(siteUrl('/', request));
  }

  return NextResponse.redirect(siteUrl(nextPath, request));
}
