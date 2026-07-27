# EduCanvas

EduCanvas is a theme-driven website and content-management starter for educational institutions. A single modular Next.js application powers a public landing page, faculty directory, notices and results, and a Google-protected administration workspace.

Schools, madrashas, and coaching centres share the same routes and features while selecting their visual identity through one environment variable.

## Highlights

- Three responsive institutional themes selected through `.env`
- Public landing page, faculty directory, notices, and verified results
- Authenticated administration workspace
- Google OAuth through Better Auth
- Optional administrator email allowlist
- Editable landing content and hero carousel
- Faculty profile management
- PDF notice and result publishing workflows
- Browser-persisted prototype content
- Desktop and mobile Playwright journeys
- Archived source prototypes for visual comparison

## Technology

- Next.js 16 with the App Router
- React 19 and strict TypeScript
- Tailwind CSS 4
- shadcn/ui and Radix primitives
- Better Auth with Google OAuth
- Playwright end-to-end testing
- pnpm

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Public institutional landing page |
| `/faculty` | Faculty and leadership directory |
| `/notices` | Searchable notices and verified results |
| `/admin/login` | Google administrator sign-in |
| `/admin` | Protected content-management workspace |
| `/api/auth/[...all]` | Better Auth API handler |

## Getting started

### Requirements

- Node.js 20.9 or newer
- pnpm 11 or newer
- A Google OAuth web client for administrator login

### Installation

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `SITE_THEME` | No | `school`, `madrasha`, or `coaching`; defaults to `school` |
| `BETTER_AUTH_SECRET` | Yes | Random secret containing at least 32 characters |
| `BETTER_AUTH_URL` | Yes | Application origin, such as `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth web-client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth web-client secret |
| `ADMIN_EMAILS` | No | Comma-separated administrator email allowlist |

Never commit `.env.local` or production credentials. The repository includes only a safe `.env.example`.

## Theme selection

Choose the active visual system in `.env.local`:

```dotenv
SITE_THEME=coaching
```

Supported values:

- `school` — formal blue school and college theme
- `madrasha` — restrained green, gold, and Arabic-influenced theme
- `coaching` — modern slate coaching-academy theme

The archived coaching prototype directory retains its original `prototypes/coacing` spelling, but the recommended environment value is `coaching`. The misspelled `coacing` value is also accepted as a compatibility alias.

Theme resolution is centralized in `src/config/site-theme.ts`. The root layout renders a `data-theme` attribute before the page reaches the browser, preventing a flash of the default theme. `src/app/themes.css` contains isolated theme overrides while routes, components, authentication, and workflows stay shared.

Restart the development server after changing the theme. Production deployments must be rebuilt.

## Google authentication

1. Create a Google OAuth 2.0 web client.
2. Add the local authorized redirect URI:

   ```text
   http://localhost:3000/api/auth/callback/google
   ```

3. Add the equivalent HTTPS callback for production:

   ```text
   https://your-domain.example/api/auth/callback/google
   ```

4. Configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET`.
5. Optionally restrict access with:

   ```dotenv
   ADMIN_EMAILS=admin@example.edu,principal@example.edu
   ```

When `ADMIN_EMAILS` is empty, any successfully authenticated Google account can access the admin workspace. Better Auth validates sessions on the server and stores stateless session data in encrypted cookies.

## Project structure

```text
src/
  app/                    App Router pages, API handlers, and global styles
  components/
    site/                 Shared public shell and institutional branding
    ui/                   shadcn/ui primitives
  config/                 Typed theme configuration
  features/
    admin/                Content-management workspace
    auth/                 Authentication UI, access rules, and user types
    faculty/              Faculty directory
    home/                 Landing-page sections and inquiry form
    notices/              Notice and result directory
    school/               Content domain, defaults, and browser store
  lib/                    Better Auth clients and shared utilities
tests/e2e/                Playwright user journeys
prototypes/               Archived source prototypes and original assets
```

The feature folders own their components and domain logic. Route files remain thin, shared configuration is centralized, and authentication is enforced at the server-page boundary.

## Content persistence

EduCanvas currently operates in prototype mode. Admin changes are saved to browser local storage and immediately reflected by the public client components in the same browser.

For production multi-user content management, replace the browser store in `src/features/school/lib/content-store.ts` with a persistent database or CMS adapter. Authentication is already server-backed and independent from this prototype content store.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e
```

The Playwright suite covers:

- Public landing-page journeys
- Faculty filtering
- Notice search and result filtering
- Responsive mobile navigation
- Unauthenticated admin redirects
- Authenticated administrator identity
- Landing-page publishing
- Faculty profile publishing
- Notice publishing
- Tokens for every selectable theme

Admin editing journeys run in the desktop workspace. Public and authentication journeys run at desktop and Pixel 7 viewports.

## Archived prototypes

The original static prototypes remain available for reference:

- `prototypes/school/` — Shapla Grove School & College
- `prototypes/madrasha/` — Noorul Ilm Madrasha & Islamic Academy
- `prototypes/coacing/` — Vertex Coaching Academy

These files are historical references. The maintained application lives under `src/`.
