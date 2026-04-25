# DC Menu System

Next.js (App Router) application for a hotel/restaurant-style QR menu and room service workflow, with an admin dashboard for managing rooms, menu data, and users.

## What's Inside

- Authentication via Better Auth (`/api/auth/[...all]`) with email/password plus Google/GitHub OAuth
- Role-based admin area under `/admin/*` (admin/subadmin/user)
- Room management with QR generation + print-ready QR view
- Room service orders workflow
- Menu management (categories, items, add-ons, variant options)
- UploadThing integration for storing generated QR images and uploads
- Postgres + Prisma (Prisma client is generated into `generated/prisma/`)

## Tech Stack

- Next.js + React + TypeScript
- Tailwind CSS + shadcn/ui style component patterns
- Prisma + PostgreSQL
- Better Auth
- UploadThing

## Getting Started (Local)

### 1) Install dependencies

This repo includes a `pnpm-lock.yaml`, so `pnpm` is the expected package manager.

```bash
pnpm install
```

### 2) Configure environment variables

Create `.env` and set:

```bash
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"

# App URL used to embed QR destination links
APP_URL="http://localhost:3000"

# Optional branding for print QR UI
NEXT_PUBLIC_APP_NAME="Diamond Crown"

# UploadThing (required for room QR uploads / file uploads)
UPLOADTHING_TOKEN="..."
UPLOADTHING_APIURL="..."

# Social auth (optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

Notes:

- Prisma loads env vars from `.env` by default (see `prisma.config.ts` importing `dotenv/config`).
- Next.js also supports `.env.local` for local-only overrides.
- `APP_URL` is used to build the QR code URL (see `src/lib/index.ts`).
- `NEXT_PUBLIC_APP_NAME` is read in the admin QR print view (see `src/components/admin/rooms/room-qr-view.tsx`).
- UploadThing is required for `createNewRoom()` because it uploads the generated QR image (see `src/actions/room/index.ts`).

### 3) Sync the database schema

There is no `prisma/migrations/` directory committed right now, so the simplest local setup is:

```bash
pnpm prisma db push
pnpm prisma generate
```

If you prefer migrations, you can create them locally:

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

### 4) Run the dev server

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Common Scripts

From `package.json`:

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Routes

- `/` currently contains a simple room-service request form (see `src/app/page.tsx`)
- `/auth/signin` and `/auth/signup` for authentication UI
- `/admin/*` for the admin area

Admin pages in `src/app/(admin)/admin/*` include:

- `/admin/dashboard` (uses demo data from `demo.tsx`)
- `/admin/rooms` (rooms + QR)
- `/admin/room-services` (room service orders)
- `/admin/menu-categories`
- `/admin/menu-items`
- `/admin/addon-categories`
- `/admin/addons`
- `/admin/variant-options`
- `/admin/users`
- `/admin/ratings`
- `/admin/analytics`

## Roles and Access

Most server actions check the signed-in user's role before allowing reads/writes (see `src/actions/*`).

Role values used by this project are:

- `admin`
- `subadmin`
- `user`

(See `src/utils/index.ts` and `src/lib/index.ts`.)

Bootstrapping the first admin: after creating your first account, update that user's `role` column in the database to `admin` (for example using `pnpm prisma studio`).

## Project Structure

- `src/app/`: Next.js routes (App Router)
- `src/actions/`: server actions (Prisma access + permission checks)
- `src/components/`: UI, including the full admin surface
- `src/lib/`: shared utilities (auth, prisma client, QR helpers)
- `src/schemas/`: Zod schemas for validation
- `prisma/schema.prisma`: database schema (Postgres)
- `generated/prisma/`: generated Prisma client output (imported by the app)

## Deployment Notes

- `src/lib/auth-client.ts` currently hardcodes `baseURL` to `http://localhost:3000`. For non-local deployments, update it to match your deployed URL (or read it from an env var).
