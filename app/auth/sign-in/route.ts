import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, getSupabaseConfig } from '@/lib/supabase/server';

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/admin';
  }

  return value;
}

export async function GET(request: NextRequest) {
  if (!getSupabaseConfig()) {
    return NextResponse.redirect(new URL('/admin?setup=missing-supabase', request.url));
  }

  const supabase = await createSupabaseServerClient();
  const nextPath = safeNextPath(request.nextUrl.searchParams.get('next'));
  const redirectTo = new URL('/auth/callback', request.nextUrl.origin);
  redirectTo.searchParams.set('next', nextPath);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo.toString(),
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL('/admin?auth=failed', request.url));
  }

  return NextResponse.redirect(data.url);
}
