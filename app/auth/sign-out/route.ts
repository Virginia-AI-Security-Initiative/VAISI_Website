import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, getSupabaseConfig } from '@/lib/supabase/server';
import { siteUrl } from '@/lib/site-url';

export async function GET(request: NextRequest) {
  if (getSupabaseConfig()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(siteUrl('/admin', request));
}
