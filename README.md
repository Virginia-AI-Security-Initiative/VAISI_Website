# Virginia AI Security Initiative (VAISI) Website

This is the official website for the Virginia AI Security Initiative at UVA. It is built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:** copy `.env.example` to `.env.local` and fill in the Supabase values (see `CLAUDE.md` for details). The site works without them — the `/admin` route just shows a setup prompt instead of the dashboard.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Project Structure

```
vaisi-website/
├── app/                         # App Router directory (routes & layout)
│   ├── about/                   # /about — mission, team, "Our Path Forward" timeline
│   ├── admin/                   # /admin — exec-only task/event dashboard (Supabase-gated)
│   ├── auth/                    # OAuth sign-in/callback/sign-out routes
│   ├── blog/                    # /blog — redirects to the VAISI Substack
│   ├── get-involved/            # /get-involved — socials, fellowships, membership
│   ├── events/                  # /events — upcoming/past event listings + photo lightbox
│   ├── research/                # /research — policy briefs, technical research, fellowship projects
│   ├── resources/                # /resources — curated external resource flip cards
│   ├── globals.css              # Tailwind + CSS custom properties
│   ├── layout.tsx               # Root layout (fonts, MotionConfig, SiteChrome)
│   └── page.tsx                 # Home page
│
├── components/                  # Reusable UI components (Navbar, Footer, PageHero, motion primitives, etc.)
├── lib/                         # Supabase clients, admin data layer, site-url resolution
├── public/                      # Static assets (images, icons)
├── supabase/migrations/         # Postgres schema for the admin dashboard
│
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

See `CLAUDE.md` for the full architecture writeup (page-by-page breakdown, design-system conventions, admin auth flow, database schema).

## Customization

### Content updates
Static content (announcements, resource links, event listings, research publications, etc.) lives in plain arrays/objects at the top of each `app/<route>/page.tsx`, or in a dedicated `data.ts`/`members.ts` file for larger datasets (`app/about/members.ts`, `app/research/data.ts`). Edit those directly — there is no CMS.

### Styling
- **Colors**: CSS variables in `app/globals.css` — primary `#232D4B` (UVA navy), secondary `#dc6c3a` (UVA orange), background `#ffffff`.
- **Fonts**: loaded via `next/font` from `app/fonts/`.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # run ESLint
```

There is no test suite.
