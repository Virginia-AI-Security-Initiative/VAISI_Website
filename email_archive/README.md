# VAISI Email Archive

This tracked directory preserves the seed corpus and provenance for drafting
VAISI emails in Seth Lifland's voice. The current editable source of truth is
the authenticated `/admin` email library backed by Supabase. This archive is
the fallback when dashboard data is unavailable and seeds missing database
records without overwriting saved edits.

It separates historical writing samples from current event facts so that old
dates, locations, and links do not leak into new announcements. It also
separates VAISI announcement-list writing from external outreach sent to
unrelated UVA academic lists.

## Directory layout

- `emails/`: normalized historical emails with metadata and their original
  wording preserved.
- `sources/`: source screenshots or exports when available.
- `manifest.json`: machine-readable index for searching and filtering samples.
- `STYLE_GUIDE.md`: voice patterns learned from the corpus.
- `SOURCE_MAP.md`: where current facts live in the VAISI website repository.
- `DRAFTING_CHECKLIST.md`: repeatable drafting and verification workflow.
- `drafts/`: tracked seed drafts and supporting working material.
- `outreach/`: drafts and eventual sent samples for separate UVA academic or
  departmental lists. These are not announcement-list style examples.

## How to draft a new email

1. Identify the distribution context. For the VAISI announcement list, read
   `STYLE_GUIDE.md` and choose examples only from `manifest.json`. For another
   UVA list, also read `outreach/README.md` and use its audience-specific corpus.
2. Retrieve current event facts using `SOURCE_MAP.md`. Treat the website and any
   new information from the user as factual sources; treat old emails only as
   style examples.
3. Draft the shortest email that includes the action, essential logistics,
   audience fit, and relevant link.
4. Run through `DRAFTING_CHECKLIST.md`, especially the date/link/signature and
   listserv-footer checks.
5. Present a ready-to-paste email. Do not send it unless the user explicitly
   asks and authorizes a sending action.

## Adding another historical email

Create `emails/NNN-short-description.md` using this front matter:

```yaml
---
id: "NNN"
provided_sample_numbers: [N]
date_sent: "YYYY-MM-DD" # use unknown when not known
date_precision: exact | inferred | unknown
message_type: announcement | reminder | roundup
event_type: general-body | reading-group | fellowship | membership | multi-topic | other
audience: previously-engaged | general | members | other
sender: "Name or team"
signature_mode: personal | organizational
has_unsubscribe_footer: true | false
related_site_sources:
  - app/events/page.tsx
notes: "Only provenance or transcription notes; do not rewrite the body."
---
```

Then paste the subject, if known, and body below the front matter and add the
entry to `manifest.json`. Preserve genuine wording, but note obvious copy/paste
or rich-text corruption in `notes` so it is not learned as a style preference.

## Version control and dashboard edits

This archive is intentionally committed to the repository. Dashboard edits are
stored in `admin_emails`; earlier saved versions are stored in
`admin_email_revisions`. Application seeding is additive by slug, so repository
seeds never overwrite a version edited in `/admin`.

To share dashboard state outside the application, use **Download JSON** in the
Emails tab. Do not manually replace tracked historical source files unless the
goal is to update the fallback corpus or seed new installations.
