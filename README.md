# EduCanvas

**Launch and maintain a school, madrasha, or coaching-centre website from one shared application.**

[![Support on SupportKori](https://img.shields.io/badge/support-SupportKori-ffdd00)](https://www.supportkori.com/montasim)
[![Live school theme](https://img.shields.io/badge/live-schoolcanvas.netlify.app-00c7b7?logo=netlify)](https://schoolcanvas.netlify.app)

EduCanvas is a theme-driven website and content-management starter for educational institutions. A single modular Next.js application powers a public landing page, faculty directory, notices and results, admission enquiries, and a Google-protected administration workspace.

Schools, madrashas, and coaching centres share the same routes and features while selecting their institution and public layout through environment variables.

**Live demos:** [School](https://schoolcanvas.netlify.app) · [Madrasha](https://madrashacanvas.netlify.app) · [Coaching](https://coachingcanvasn.netlify.app)

> **Project status:** EduCanvas is a deployable starter rather than a hosted
> multi-tenant service. Clone it for one institution, configure its canonical
> URL and integrations, select an institution and layout, then deploy that
> configured instance. The linked deployments demonstrate all three institution
> identities; each adopter owns the accuracy, access policy, and operations of
> its configured institution.

**[Open the live school theme](https://schoolcanvas.netlify.app) · [Browse faculty](https://schoolcanvas.netlify.app/faculty) · [View notices and results](https://schoolcanvas.netlify.app/notices)**

## Why EduCanvas?

Small educational institutions often assemble a public website, document
archive, enquiry form, and content editor from separate systems. That raises
maintenance cost and lets branding or information drift between pages.
EduCanvas keeps those workflows in one typed application while allowing the
same implementation to take on three distinct institutional identities.

## Who it is for

- **Institution staff** who need to publish landing-page content, faculty
  profiles, notices, results, and admission information without editing code.
- **Developers and agencies** who want one maintained codebase that can be
  branded for a school, madrasha, or coaching centre.
- **Visitors and guardians** who need current institutional information,
  searchable documents, faculty details, and an admission-enquiry path.

The shortest path to evaluate the starter is the local setup below. It renders
maintained default content even before MongoDB is configured; publishing,
authentication, uploads, and enquiry delivery require their corresponding
services.

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

## Using EduCanvas

### As a visitor

1. Open the institution's home page for its current story, facilities,
   admission information, and contact details.
2. Browse **Faculty** and filter the teaching and leadership directory.
3. Open **Notices & results**, then search or filter published documents.
4. Submit the admission enquiry form with a guardian name, phone number, and
   class choice when the institution has enabled that workflow.

### As an administrator

1. Open `/admin/login` on the exact canonical origin and sign in with Google.
2. Confirm that the signed-in address belongs to `ADMIN_EMAILS` when an
   allowlist is configured.
3. Edit landing-page sections or the hero carousel and publish reviewed
   content.
4. Add or update faculty profiles, notices, and results; upload supported
   images or PDFs when Drive storage is configured.
5. Review recent publishing activity and admission enquiries in the dashboard.
6. Confirm the public route after each publication.

### As a developer

Clone the starter, select one `SITE_THEME` and one `SITE_VISUAL_THEME`, configure
the canonical URL and only the integrations required by the institution, then
follow the local and deployment checklists below. Do not enable production
administration with an empty `ADMIN_EMAILS` value unintentionally.

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

## Architecture

```mermaid
flowchart TD
  Env[.env.local] --> Identity[SITE_THEME]
  Env --> Layout[SITE_VISUAL_THEME]
  Identity --> IdentityConfig[src/config/site-theme.ts]
  Layout --> LayoutConfig[src/config/site-visual-theme.ts]
  IdentityConfig --> ThemeAttribute[data-theme]
  IdentityConfig --> ContentKey[Theme-specific MongoDB content]
  LayoutConfig --> LayoutAttribute[data-visual-theme]
  ThemeAttribute --> ThemeCSS[src/app/themes.css]
  LayoutAttribute --> LayoutCSS[src/app/visual-themes.css]
  ThemeCSS --> Public[Shared public Next.js pages]
  LayoutCSS --> Public
  ContentKey --> Public
  Admin[Google-authenticated admin] --> API[Protected content APIs]
  API --> Mongo[(MongoDB content)]
  API --> Drive[Google Drive assets]
  Public --> Enquiry[Admission enquiry API]
  Enquiry --> Mongo
  Enquiry --> Resend[Resend email]
  Mongo --> Public
```

EduCanvas resolves two independent theme axes on the server. `SITE_THEME`
selects the institution identity, design tokens, default content, SEO identity,
and versioned MongoDB content document. `SITE_VISUAL_THEME` selects the public
page composition without changing routes, content, authentication, the admin
workspace, or publishing workflows.

`src/app/layout.tsx` applies the resolved values as `data-theme` and
`data-visual-theme` before the page reaches the browser. Institution tokens live
in `src/app/themes.css`; layout composition lives in
`src/app/visual-themes.css`. This keeps all 15 institution-and-layout
combinations on the same component tree and prevents a flash of a fallback
theme.

Public pages render content on the server. Protected API routes validate
administrator sessions before publishing content or managing Drive assets,
while repository defaults provide a read-only fallback when MongoDB is not
configured. Changing either theme variable requires restarting development or
rebuilding the production deployment; neither variable is a browser-side
multi-tenant selector.

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

- Node.js 20.19 or newer
- pnpm 11 or newer
- MongoDB running locally, or a reachable MongoDB Atlas database, when using
  the copied `.env.example` configuration
- A Google OAuth web client only when evaluating administrator login

### Installation

```bash
git clone https://github.com/montasim/EduCanvas.git
cd EduCanvas
pnpm install
cp .env.example .env.local
```

The copied template points `MONGODB_URI` to
`mongodb://localhost:27017/educanvas`. Before starting EduCanvas, choose one
setup:

- **Full local workflow:** start a local MongoDB server on port `27017`, or
  replace `MONGODB_URI` with a reachable MongoDB Atlas connection string.
- **Read-only public evaluation:** remove or comment out `MONGODB_URI` and
  `MONGODB_DATABASE` in `.env.local`. Public pages then use maintained
  repository defaults, but publishing and admission-enquiry storage are
  unavailable.

Do not leave the template's localhost URI enabled when no local MongoDB server
is running. A non-empty URI is treated as configured, so connection attempts
will fail instead of selecting the no-database fallback.

Start the application:

```bash
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

The Playwright harness also sets `E2E_CONTENT_STORE`,
`E2E_AUTH_BYPASS_TOKEN`, and `E2E_EMAIL_BYPASS_TOKEN` for isolated test
fixtures. They are not production configuration and must never be enabled in a
deployed institution.

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

Uploaded JPG, PNG, and WebP carousel and faculty images are limited to 8 MB.
Published PDFs are limited to 10 MB. The server uploads them to the configured
folder, grants the required file access, stores the Drive file ID, preview URL,
direct URL, filename, and size in MongoDB, and delivers files through the
application’s guarded asset endpoint.
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

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Check TypeScript without emitting files |
| `pnpm test:e2e` | Run the Playwright journey suite against an existing production build |

Run the complete sequence in this order:

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

## Deployment

Public demos run at [schoolcanvas.netlify.app](https://schoolcanvas.netlify.app),
[madrashacanvas.netlify.app](https://madrashacanvas.netlify.app), and
[coachingcanvasn.netlify.app](https://coachingcanvasn.netlify.app). The
repository has no provider-specific deployment file, so deploy another instance
on a Node.js host that supports Next.js 16, then configure:

1. `SITE_URL` and `BETTER_AUTH_URL` to the same canonical HTTPS origin.
2. The production Google OAuth callback at
   `/api/auth/callback/google` on that origin.
3. MongoDB, Google Drive, and Resend credentials for the workflows you enable.
4. `ADMIN_EMAILS` before launch if administration must be restricted to named
   accounts.
5. `SITE_THEME` and `SITE_VISUAL_THEME`, followed by a fresh production build.

Run `pnpm lint`, `pnpm typecheck`, `pnpm build`, and the relevant Playwright
journeys before promoting a deployment.

## Operational limitations

- When `ADMIN_EMAILS` is empty, every Google account that successfully signs in
  can access the administration workspace. Production deployments should make
  that choice explicitly.
- Without `MONGODB_URI`, public pages fall back to repository defaults, but
  administrators cannot persist published content.
- File uploads and managed-asset cleanup depend on Google Drive service-account
  access to the configured folder.
- Admission enquiries are stored before email delivery is attempted. Operators
  should define retention, access, and deletion policies for guardian contact
  details.
- Changing `SITE_THEME` selects a different content document, while
  `SITE_VISUAL_THEME` changes its public layout. Either change requires a
  rebuild; neither converts an existing institution into a multi-tenant app.
- Notices, results, staff profiles, and admission copy are maintained by the
  deploying institution. EduCanvas does not independently verify them.

## Archived prototypes

The original static prototypes remain available for reference:

- `prototypes/school/v1-v5/` — Shapla Grove School & College
- `prototypes/madrasha/v1-v5/` — Noorul Ilm Madrasha & Islamic Academy
- `prototypes/coacing/v1-v5/` — Vertex Coaching Academy

These files are historical references. The maintained application lives under `src/`.

## Documentation

- [Environment reference](#environment-variables)
- [Theme selection](#theme-selection)
- [SEO and social previews](#seo-and-social-previews)
- [Google authentication](#google-authentication)
- [MongoDB content storage](#mongodb-content-storage)
- [Google Drive file storage](#google-drive-file-storage)
- [Admission enquiry email](#admission-enquiry-email)
- [Content publishing](#content-publishing)
- [Quality checks](#quality-checks)
- [Archived visual prototypes](#archived-prototypes)

## Contributing, security, and support

Open focused issues or pull requests with the affected theme and workflow,
reproduction steps, and the checks performed. Keep credentials, admission
submissions, administrator identities, Drive file IDs, and private institutional
data out of issues and test fixtures.

Report sensitive vulnerabilities privately through the contact links on
[the maintainer's GitHub profile](https://github.com/montasim). Optional support
through [SupportKori](https://www.supportkori.com/montasim) helps fund continued
maintenance.

The repository currently has no dedicated `CONTRIBUTING.md`, `SECURITY.md`,
`CODE_OF_CONDUCT.md`, or `SUPPORT.md`. Use
[Issues](https://github.com/montasim/EduCanvas/issues) for public reports,
[Pull Requests](https://github.com/montasim/EduCanvas/pulls) for reviewable
changes, and the maintainer's profile for private security or personal-data
reports.

## Funding

Optional SupportKori contributions help fund theme maintenance, integration
testing, and deployment research. Documentation, accessibility review, and
reproducible bug reports are equally valuable.

[![Support EduCanvas on SupportKori](https://img.shields.io/badge/Support_EduCanvas-SupportKori-00B8B5?style=for-the-badge)](https://www.supportkori.com/montasim)

## License

This repository does not currently include a license file. Copyright remains
with the author, and no open-source license should be assumed. Institution
logos, photographs, documents, and prototype assets may have separate rights.

## Maintainer

[Mohammad Montasim Al Mamun Shuvo](https://github.com/montasim)
