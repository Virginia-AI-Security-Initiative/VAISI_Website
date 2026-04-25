Reverting main branch to previous commit

# Virginia AI Security Initiative (VAISI) Website

This is the official website for the Virginia AI Security Initiative at UVA. It is built with Next.js 14+ (App Router), TypeScript, and Tailwind CSS.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Project Structure

```
vaisi-website/
├── .next/                      # Build output and dev server cache (gitignored)
├── node_modules/               # Installed npm dependencies (gitignored)
├── app/                        # App Router directory (Pages & Layout)
│   ├── about/                  # About page route
│   │   └── page.tsx            # /about content
│   ├── blog/                   # Blog page route
│   │   └── page.tsx            # /blog content (links to Substack)
│   ├── get-involved/           # Get Involved page route
│   │   └── page.tsx            # /get-involved content (schedule, etc.)
│   ├── resources/              # Resources page route
│   │   └── page.tsx            # /resources content
│   ├── team/                   # Team page route
│   │   └── page.tsx            # /team content (member grid)
│   ├── globals.css             # Global styles (Tailwind, Variables)
│   ├── layout.tsx              # Root layout (Metadata, Font, Body)
│   └── page.tsx                # Home page content
│
├── components/                 # Reusable UI Components
│   ├── Footer.tsx              # Site footer
│   ├── Navbar.tsx              # Responsive navigation bar
│   ├── Section.tsx             # Layout wrapper for consistent spacing
│   └── TeamMemberCard.tsx      # Card component for team grid
│
├── public/                     # Static assets (images, icons)
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration (although using v4 CSS config)
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation
```

## Customization

### Content Updates
- Check the top of each `page.tsx` file for mock data arrays (e.g., `announcements`, `teamMembers`, `resources`).

### Styling
- **Colors**: Defined in `app/globals.css`.
  - Primary: `#232D4B` (UVA Blue)
  - Secondary: `#E57200` (UVA Orange)
  - Background: `#f8fafc` (Slate 50)
- **Fonts**: Uses `Inter` via `next/font/google`.

