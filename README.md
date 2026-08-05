# EduCanvas

EduCanvas is a theme-driven website and content-management starter for educational institutions. A single modular Next.js application powers a public landing page, faculty directory, notices and results, and a Google-protected administration workspace.

Schools, madrashas, and coaching centres share the same routes and features while selecting their institution and public layout through environment variables.

**Live demos:** [School](https://schoolcanvas.netlify.app) · [Madrasha](https://madrashacanvas.netlify.app) · [Coaching](https://coachingcanvasn.netlify.app)

## Highlights

- Three institutional identities and five responsive visual layouts selected through `.env`
- Public landing page, faculty directory, notices, and verified results
- Authenticated administration workspace
- Google OAuth through Better Auth
- Optional administrator email allowlist
- Editable landing content and hero carousel
- Faculty profile management
- PDF notice and result publishing workflows
- MongoDB-backed website content shared across devices
- Google Drive image and PDF storage
- Desktop and mobile Playwright journeys
- Archived source prototypes for visual comparison

## Technology

- Next.js 16 with the App Router
- React 19 and strict TypeScript
- Tailwind CSS 4
- shadcn/ui and Radix primitives
- Better Auth with Google OAuth
- MongoDB Node.js driver
- Google Drive API with service-account authentication
- Resend for admission-enquiry email delivery
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
| `/api/content` | Public content reads and protected administrator publishing |
| `/api/admin/files` | Protected Google Drive image and PDF uploads |

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
| `SITE_VISUAL_THEME` | No | `heritage`, `fieldbook`, `night-school`, `common-room`, or `ledger`; defaults to `heritage` |
| `SITE_URL` | Production | Public origin used for canonical, sitemap, and social-preview URLs |
| `BETTER_AUTH_SECRET` | Yes | Random secret containing at least 32 characters |
| `BETTER_AUTH_URL` | Yes | Authentication origin; keep it identical to `SITE_URL` |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth web-client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth web-client secret |
| `GOOGLE_SITE_VERIFICATION` | No | Google Search Console verification token |
| `ADMIN_EMAILS` | No | Comma-separated administrator email allowlist |
| `MONGODB_URI` | Publishing | MongoDB or MongoDB Atlas connection string |
| `MONGODB_DATABASE` | No | Database name; defaults to the database in `MONGODB_URI` |
| `GOOGLE_CLIENT_EMAIL` | File storage | Google service-account email |
| `GOOGLE_PRIVATE_KEY` | File storage | Google service-account private key with escaped newlines |
| `GOOGLE_DRIVE_FOLDER_ID` | File storage | Drive folder shared with the service account |
| `RESEND_API_KEY` | Admissions | Server-only API key created in Resend |
| `RESEND_FROM_EMAIL` | Admissions | Sender using a domain verified in Resend, including an optional display name |
| `ADMISSION_ADMIN_EMAIL` | Admissions | Administrator inbox that receives admission enquiries |

Never commit `.env.local` or production credentials. The repository includes only a safe `.env.example`.

Admission information requests are saved in MongoDB's
`admission_enquiries` collection before EduCanvas attempts email delivery
through Resend. Administrators can review every request and its email-delivery
status from **Admin dashboard → Admission enquiries**. The class choices shown
on the public form come from **Landing page → Admissions content → Class
options**, so the form and its server-side validation share the same published
content.

## Theme selection

Choose the institution and public visual system in `.env.local`:

```dotenv
SITE_THEME=coaching
SITE_VISUAL_THEME=common-room
```

Institution values:

- `school` — formal blue school and college theme
- `madrasha` — restrained green, gold, and Arabic-influenced theme
- `coaching` — modern slate coaching-academy theme

The archived coaching prototype directory retains its original `prototypes/coacing` spelling, but the recommended environment value is `coaching`. The misspelled `coacing` value is also accepted as a compatibility alias.

Visual layout values:

- `heritage` - the original v1 institutional layout
- `fieldbook` - the sharp editorial v2 layout
- `night-school` - the dark sidebar v3 application layout
- `common-room` - the soft, rounded v4 campus portal
- `ledger` - the minimal, information-first v5 layout

Aliases `v1` through `v5` are accepted, but named values are preferred. Institution resolution is centralized in `src/config/site-theme.ts`; visual layout resolution lives in `src/config/site-visual-theme.ts`. The root layout renders both `data-theme` and `data-visual-theme` before the page reaches the browser, preventing a flash of a fallback theme. `src/app/themes.css` owns institution tokens and `src/app/visual-themes.css` owns layout composition. Routes, content, authentication, admin UI, and publishing workflows stay shared.

Restart the development server after changing the theme. Production deployments must be rebuilt.

## SEO and social previews

EduCanvas generates search and sharing metadata from a centralized configuration:

- Canonical URLs and page-specific titles, descriptions, and keywords
- Open Graph and Twitter large-image cards
- A theme-aware 1200×630 social preview image
- `robots.txt` with admin and API exclusions
- `sitemap.xml` for public routes
- A web app manifest and theme color
- `WebSite`, `EducationalOrganization`, `School`, and `WebPage` JSON-LD
- Explicit `noindex` rules for the admin workspace and login

Set the deployed public origin before building:

```dotenv
SITE_URL=https://your-domain.example
```

`SITE_URL` is the canonical production origin for both SEO and authentication.
When it is absent, EduCanvas falls back to `BETTER_AUTH_URL`, then to
`http://localhost:3000` for SEO. Search engines and Google OAuth must never
receive a production build containing a localhost origin.

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

4. Configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET`. Set both `SITE_URL` and `BETTER_AUTH_URL` to the same public HTTPS origin in production.
5. Optionally restrict access with:

   ```dotenv
   ADMIN_EMAILS=admin@example.edu,principal@example.edu
   ```

When `ADMIN_EMAILS` is empty, any successfully authenticated Google account can access the admin workspace. Better Auth validates sessions on the server and stores stateless session data in encrypted cookies.

Always open the application using the exact origin configured in
`BETTER_AUTH_URL`. For example, do not mix `localhost` and `127.0.0.1` during a
Google sign-in attempt. OAuth state cookies are host-only, so changing the
protocol, hostname, or port between starting sign-in and Google's callback
causes a secure `state_mismatch` rejection. If this happens, allow cookies for
the site, close other active sign-in tabs, and restart login from the configured
origin.

## MongoDB content storage

Landing-page content, carousel metadata, faculty profiles, notices, results,
publication status, and recent activity are stored in MongoDB. EduCanvas keeps
one versioned content document per selected `SITE_THEME`, so changing the
environment theme does not overwrite another theme’s content.

For local MongoDB:

```dotenv
MONGODB_URI=mongodb://localhost:27017/educanvas
MONGODB_DATABASE=educanvas
```

For production, use a MongoDB Atlas connection string and allow network access
from the deployment environment. `MONGODB_URI` is server-only. When the
database has no content document yet, public pages use the repository’s
maintained default content; the first administrator publication creates it.

## Google Drive file storage

EduCanvas follows the service-account storage pattern used by the reference
Book Heaven project:

1. Enable Google Drive API in a Google Cloud project.
2. Create a service account and private key.
3. Create a Drive folder and share it with the service-account email as an
   Editor.
4. Add the service-account credentials and folder ID:

   ```dotenv
   GOOGLE_CLIENT_EMAIL=educanvas-storage@example-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_DRIVE_FOLDER_ID=your-folder-id
   ```

Uploaded JPG, PNG, and WebP carousel and faculty images are limited to 8 MB. Published PDFs
are limited to 10 MB. The server uploads them to the configured folder, grants
stores the Drive file ID, preview URL, direct URL, filename, and size in
MongoDB, and delivers files through the application’s guarded asset endpoint.
Replaced and removed managed assets are deleted
from Drive. Built-in repository images and legacy notice metadata remain valid.

The Google service-account credentials are separate from the Google OAuth
client used for administrator login. Never prefix database or storage
credentials with `NEXT_PUBLIC_`.

## Admission enquiry email

The landing-page admission form validates submissions on the server and sends
the parent or guardian name, phone number, selected class level, and submission
time to the configured administrator through Resend.

1. Create a Resend account and API key.
2. Add and verify the domain that will send the messages.
3. Configure the server-only values in `.env.local`:

   ```dotenv
   RESEND_API_KEY=re_your_api_key
   RESEND_FROM_EMAIL=Shapla Grove Admissions <admissions@example.edu>
   ADMISSION_ADMIN_EMAIL=admissions@example.edu
   ```

4. Restart the development server.

The sender address must belong to the verified domain. Never prefix these
variables with `NEXT_PUBLIC_`; the API key and delivery configuration stay on
the server. The form shows a confirmation only after Resend accepts the email,
and shows a recoverable error if delivery cannot be started.

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
    admissions/           Enquiry validation, email template, and Resend delivery
    auth/                 Authentication UI, access rules, and user types
    faculty/              Faculty directory
    home/                 Landing-page sections and inquiry form
    notices/              Notice and result directory
    school/               Content domain, MongoDB repository, and client provider
    storage/              Google Drive storage adapter and upload client
  lib/                    Better Auth clients and shared utilities
tests/e2e/                Playwright user journeys
prototypes/               Archived source prototypes and original assets
```

The feature folders own their components and domain logic. Route files remain thin, shared configuration is centralized, and authentication is enforced at the server-page boundary.

## Content publishing

Public pages read content on the server from MongoDB and render it into the
initial response. Administrator changes are validated and saved through an
authenticated API before the interface reports success. This makes published
changes visible across browsers and devices without browser-local state.

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

- `prototypes/school/v1-v5/` — Shapla Grove School & College
- `prototypes/madrasha/v1-v5/` — Noorul Ilm Madrasha & Islamic Academy
- `prototypes/coacing/v1-v5/` — Vertex Coaching Academy

These files are historical references. The maintained application lives under `src/`.

## Project status and limitations

EduCanvas is a working application starter with public demo deployments. The demos contain representative institutional content and should not be treated as a production school record system. Production use requires correctly configured authentication, MongoDB, Google Drive, email delivery, backups, access controls, and privacy procedures appropriate to the institution.

## Support and contribution

Use [GitHub Issues](https://github.com/montasim/EduCanvas/issues) for reproducible bugs and feature requests. Pull requests are welcome. Do not include credentials, student records, private contact information, or other sensitive data in public issues.

## License

This repository does not currently include a license file. No open-source license or reuse permission should be assumed until the repository owner adds one.
