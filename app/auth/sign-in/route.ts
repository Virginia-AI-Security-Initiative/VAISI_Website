import { NextRequest, NextResponse } from 'next/server';
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
    return NextResponse.redirect(siteUrl('/admin?setup=missing-supabase', request));
  }

  const supabase = await createSupabaseServerClient();
  const nextPath = safeNextPath(request.nextUrl.searchParams.get('next'));
  const redirectTo = siteUrl('/auth/callback', request);
  redirectTo.searchParams.set('next', nextPath);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo.toString(),
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(siteUrl('/admin?auth=failed', request));
  }

  return NextResponse.redirect(data.url);
}
