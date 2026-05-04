# VAISI Admin Dashboard Supabase Setup

## Database

Run `supabase/migrations/20260504100000_admin_dashboard.sql` in the VAISI Supabase project. It creates the admin exec, task, event, secondary-owner, and RLS policy tables, then seeds the approved Google accounts from the current exec list.

## Google OAuth

In Supabase, enable Google under Authentication -> Sign In / Providers.

Use the Supabase callback URL in Google Cloud as the OAuth redirect URI:

```text
https://<your-project-ref>.supabase.co/auth/v1/callback
```

In Supabase Authentication -> URL Configuration, add these redirect URLs:

```text
http://localhost:3000/auth/callback
https://vaisi.org/auth/callback
```

The app starts OAuth through `/auth/sign-in`, completes it at `/auth/callback`, and redirects unapproved Google emails back to `/`.
