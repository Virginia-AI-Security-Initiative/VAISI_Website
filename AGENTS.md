# Repository Instructions

## VAISI email writing

The current, authoritative email library lives in the authenticated Supabase
table `admin_emails` and is edited through `/admin` → **Emails**. Each save
automatically preserves the prior value in `admin_email_revisions`.

When asked to draft a VAISI email:

1. Prefer the current `admin_emails` records when database access is available.
2. Otherwise use the tracked `email_archive/` as a fallback and tell the user
   that dashboard edits may be newer.
3. For announcement-list emails, use only rows whose `distribution_context` is
   `announcement_list` and whose `style_weight` is `primary` or `secondary`.
4. Never use `external_list` or `excluded` rows to calibrate the normal VAISI
   announcement-list voice.
5. Use historical emails for voice, not current event logistics. Verify facts
   against current site content and information supplied by the user.

The application seeds missing database rows from `lib/admin/email-seeds.ts`
without overwriting dashboard edits. The tracked archive records provenance;
the database record is the final editable version after seeding.
