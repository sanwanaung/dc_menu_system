# 🍽️ Skyline Hub Menu System

> ### 🚀 Modern Hotel & Restaurant Digital Menu Platform
>
> **Developed by: San Wan Aung**
>
> A QR-powered digital menu and room service management system built with a modern full-stack architecture.

---

# ✨ Overview

Skyline Hub Menu System is a full-stack hotel and restaurant digital menu platform built with **Next.js App Router**, **PostgreSQL**, **Prisma**, and **Better Auth**.

## 🎯 Guest Experience

Guests can:

- 🍔 Browse food & beverage menus
- 📱 Scan room QR codes
- 🛎️ Request room services
- 📂 Explore menu categories
- 🍽️ View menu items and details
- 🎨 Select variants and add-ons
- ⭐ Submit ratings and feedback

## 🛠️ Administration Features

Administrators can manage:

- 🏨 Rooms
- 🔳 QR Codes
- 📋 Menu Categories
- 🍴 Menu Items
- ➕ Add-ons
- 🎛️ Variant Options
- 🛎️ Room Service Requests
- 👥 User Accounts
- 📊 Analytics

---

# 🌟 Features

## 👤 Guest Features

### 🏠 Landing Page

- Hotel branding & information
- Smooth navigation
- Quick access to menu & room service

### 📖 Digital Menu

- 📂 Category browsing
- 🍽️ Menu item details
- 🖼️ Item images
- 🎛️ Variant selection
- ➕ Add-on selection
- 💰 Dynamic pricing
- ✅ Availability control

### 🔳 QR-Based Room Access

Each room contains a unique QR code.

```text
RQ-RN-102
```

The QR system enables:

- 🏨 Room detection
- ⭐ Rating association
- 🛎️ Room service tracking

### 🛎️ Room Service Booking

Guests can:

- 📅 Select service date
- ⏰ Choose start time
- ⏰ Choose end time
- 📝 Add notes
- 📤 Submit requests

### ⭐ Rating System

Guests can:

- ⭐ Rate menu items
- 💬 Leave feedback
- 🏨 Associate ratings with rooms

---

# 🔐 Admin Features

## 📊 Dashboard

- 📈 System overview
- 👥 User management
- 🍽️ Menu management
- 🏨 Room management
- 🛎️ Service management

## 🏨 Room Management

Manage:

- 🏷️ Room names
- 🛏️ Room types
- 🏢 Floor information
- 🔳 QR identifiers
- 🖼️ Room images

Features:

- ⚡ QR generation
- 🖨️ QR printing
- 📤 Image uploads

## 📋 Menu Category Management

Examples:

- 🌅 Breakfast
- ☀️ Lunch
- 🌙 Dinner
- 🥤 Drinks
- 🍰 Desserts

## 🍴 Menu Item Management

Manage:

- 🏷️ Name
- 📝 Description
- 💰 Price
- 🖼️ Images
- ✅ Availability
- 📂 Category assignments

## ➕ Add-on Management

Examples:

- 🧀 Extra Cheese
- 🥫 Extra Sauce
- 🍨 Ice Cream Scoop
- 🍫 Additional Toppings

## 🎛️ Variant Management

Examples:

- 🔹 Small
- 🔸 Medium
- 🔷 Large

or

- 🔥 Hot
- ❄️ Cold

Each variant supports:

- 💰 Custom pricing
- 🖼️ Images
- ✅ Availability settings

## 👥 User Management

Roles:

- 👤 USER
- 🛡️ ADMIN
- ⚙️ SUBADMIN

## 🛎️ Room Service Management

Track:

- 🟡 Pending
- 🔵 Approved
- 🟢 Completed
- 🔴 Cancelled

---

# 🏗️ Architecture

## 🎨 Frontend

### Framework

- Next.js 16
- React 19
- TypeScript

### UI Stack

- Tailwind CSS
- shadcn/ui
- Radix UI
- Lucide Icons

### State Management

- Zustand

### Data Fetching

- TanStack React Query

### Forms

- React Hook Form
- Zod

---

## ⚙️ Backend

### Server

- Next.js Server Actions
- Route Handlers

### Authentication

- Better Auth
- Email / Password
- Google OAuth
- GitHub OAuth

### Database

- PostgreSQL
- Prisma ORM

### File Uploads

- UploadThing

### QR Generation

- qrcode package

---

# 🧭 Main Routes

## 🌐 Public Routes

| Route         | Purpose      |
| ------------- | ------------ |
| /             | Landing Page |
| /menu         | Digital Menu |
| /room-service | Room Service |
| /auth/signin  | Sign In      |
| /auth/signup  | Sign Up      |

## 🔒 Admin Routes

| Route                   | Purpose           |
| ----------------------- | ----------------- |
| /admin                  | Admin Home        |
| /admin/dashboard        | Dashboard         |
| /admin/users            | Users             |
| /admin/rooms            | Rooms             |
| /admin/menu-categories  | Categories        |
| /admin/menu-items       | Menu Items        |
| /admin/addons           | Add-ons           |
| /admin/addon-categories | Add-on Categories |
| /admin/variant-options  | Variants          |
| /admin/room-services    | Room Services     |
| /admin/ratings          | Ratings           |
| /admin/analytics        | Analytics         |

---

# 🗄️ Database Overview

### Core Entities

- 👤 User
- 🔐 Session
- 🔗 Account
- ✅ Verification
- 🏨 Room
- 🛎️ RoomServiceOrder
- 📂 MenuCategory
- 🍴 MenuItem
- ⭐ MenuItemRating
- ➕ Addon
- 📦 AddonCategory
- 🎛️ VariantOption
- 🖼️ VariantImage

---

# 💻 Technology Stack

## 🚀 Core

- Next.js 16.1.6
- React 19.2.3
- TypeScript

## 🗄️ Database

- PostgreSQL
- Prisma

## 🔐 Authentication

- Better Auth

## 🎨 UI

- Tailwind CSS
- Radix UI
- Lucide React
- Sonner

## 📡 State & Data

- Zustand
- TanStack Query

## ✅ Validation

- Zod
- React Hook Form

## 📤 Uploads

- UploadThing

---

# ⚙️ Environment Variables

```env
DATABASE_URL=

APP_URL=

NEXT_PUBLIC_APP_NAME=

UPLOADTHING_TOKEN=
UPLOADTHING_APIURL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

---

# 🚀 Development

```bash
pnpm install
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

---

# 🎯 Project Goal

Replace traditional hotel room menus and manual room-service workflows with a modern, QR-powered digital experience that improves:

- 🚀 Guest Convenience
- ⚡ Operational Efficiency
- 📊 Service Visibility
- ⭐ Customer Satisfaction

---

## 👨‍💻 Developer

**San Wan Aung**

Full-Stack Developer • Next.js • React • TypeScript • PostgreSQL

---

⭐ Built for modern hospitality experiences.
