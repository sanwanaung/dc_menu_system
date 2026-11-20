<div align="center">

# 🍽️ Skyline Hub Menu System

**A QR-powered digital dining and room-service platform for Skyline Hub Hotel.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?logo=prisma)](https://www.prisma.io/)

[🌐 Open the live site](https://skyline-hub-two.vercel.app)

</div>

---

## ✨ About

Skyline Hub Menu System lets hotel guests scan a room QR code to browse the digital menu and access room service. Hotel staff use the admin area to manage rooms, menus, add-ons, variants, ratings, users, and service requests.

### Guest experience

- Browse menu categories, item details, prices, availability, variants, and add-ons.
- Access the menu and room-service experience using room-specific QR codes.
- Submit room-service requests and leave menu-item ratings and feedback.

### Administration

- Manage rooms and their QR codes, menu categories and items, add-on categories, and variants.
- Review room-service requests and ratings, and manage user accounts and dashboard data.

## 🧰 Technology

- **Application:** Next.js 16 App Router, React 19, TypeScript
- **Data:** PostgreSQL, Prisma ORM
- **Authentication:** Better Auth with email/password and Google and GitHub providers
- **UI:** Tailwind CSS 4, Radix UI, Base UI, Lucide React
- **Client state and forms:** TanStack Query, Zustand, React Hook Form, Zod
- **Uploads and QR codes:** UploadThing and `qrcode`

## 🗂️ Project layout

```text
src/
├── app/          Next.js routes, layouts, and API route handlers
├── components/   Shared UI and guest/admin components
├── features/    Feature modules, server actions, schemas, and types
├── hooks/       Shared hooks and client-side stores
├── lib/         Authentication, Prisma, permissions, QR, and integrations
├── providers/   React Query and application providers
└── utils/        Formatting, logging, and query utilities
prisma/
└── schema.prisma PostgreSQL data model
```

Feature modules include authentication, menu items and categories, rooms, room service, add-ons, variants, users, and dashboard data. Prisma models connect those workflows to the PostgreSQL database.

## 🚀 Getting started

### Requirements

- Node.js compatible with the project's Next.js 16 dependencies
- [pnpm](https://pnpm.io/)
- PostgreSQL

### Install and configure

```bash
git clone https://github.com/sanwanaung/dc_menu_system.git
cd dc_menu_system
pnpm install
```

Create a `.env` file in the project root and configure the variables below. Set `BETTER_AUTH_URL` to the app's base URL (for local development, typically `http://localhost:3000`). Configure the database and any external providers you intend to use.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma |
| `BETTER_AUTH_URL` | Base URL for Better Auth and generated room QR links |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google sign-in credentials |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub sign-in credentials |
| `UPLOADTHING_TOKEN` / `UPLOADTHING_APIURL` | UploadThing credentials and API URL for image uploads |
| `NEXT_PUBLIC_APP_NAME` | Optional app-name override in the UI |

Keep credentials private: do not commit `.env` or production secrets.

### Run locally

```bash
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Build and run

```bash
pnpm build
pnpm start
```

Run the configured lint check with `pnpm lint`. The package does not currently define a test script.

## 🧭 Main routes

| Route | Description |
| --- | --- |
| `/` | Hotel landing page |
| `/menu` | Guest digital menu; reached with room QR parameters |
| `/room-service` | Guest room-service requests; reached with room QR parameters |
| `/admin` | Admin area |
| `/admin/dashboard` | Dashboard |
| `/admin/rooms` | Room and QR-code management |
| `/admin/menu-categories` | Menu category management |
| `/admin/menu-items` | Menu item management |
| `/admin/addons` | Add-on management |
| `/admin/variant-options` | Variant management |
| `/admin/room-services` | Room-service request management |
| `/admin/ratings` | Rating management |
| `/admin/users` | User management |
| `/admin/analytics` | Analytics |

Room QR links carry `room` and `roomQR` parameters. Guest menu and room-service pages use these values to establish a scan session before showing room-specific content.

## 🧱 Data model

The Prisma schema defines authentication records alongside hospitality data, including `Room`, `RoomSessionToken`, `RoomServiceOrder`, `MenuCategory`, `MenuItem`, `VariantOption`, `Addon`, and `MenuItemRating`. Room-service requests have a status lifecycle, and menu items can be associated with multiple categories, variants, and add-on categories.

## 👨‍💻 Maintainer

**San Wan Aung** — Full-stack developer

---

<p align="center">Built to make hotel dining and room service simpler for guests and staff. ⭐</p>
