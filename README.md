# House No. 230 — The Gourmet Kitchen & Bar
## Production-Ready Restaurant Website & Secure Admin Management System

Built for **House No. 230 — The Gourmet Kitchen & Bar**, targeting the premium dining and bar market in India.

This application is an end-to-end, full-stack, secure, and production-tested restaurant web platform and staff administration portal.

---

## 1. System Architecture

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript in strict mode
- **Styling & Design System:** Tailwind CSS with luxury restaurant tokens:
  - Charcoal (`#171715`)
  - Deep Black (`#10100F`)
  - Warm Ivory (`#F6F1E8`)
  - Champagne Gold (`#B99A61`)
  - Muted Gold (`#D8BF89`)
  - Secondary Gray (`#77746E`)
- **Database & Persistence:**
  - Local & Test: SQLite with Prisma ORM
  - Production: PostgreSQL with Prisma ORM migrations
- **Authentication & Security:**
  - Password hashing via `bcryptjs` (salt rounds: 12)
  - Edge-compatible, signed JWT sessions via `jose`
  - `HttpOnly`, `SameSite=Lax`, `Secure` session cookies
  - Strict security headers (`HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`)
  - Rate limiting on login and reservation submission endpoints
  - Public customer data segregation (internal staff notes protected from public)
- **Validation:** Zod schemas across frontend forms and backend API routes
- **Testing Suite:** Vitest for unit, integration, and database validation

---

## 2. Directory Structure

```
house-no-230/
├── prisma/
│   ├── schema.prisma        # Database schema (MenuCategory, MenuItem, Reservation, AdminUser, SiteSettings, AuditLog)
│   └── dev.db               # Local SQLite database
├── scripts/
│   └── seed.mjs             # Idempotent seed script (categories, 145 dishes, admin user, settings)
├── src/
│   ├── app/
│   │   ├── admin/           # Protected Admin Dashboard
│   │   │   ├── audit/       # Security & activity audit timeline
│   │   │   ├── categories/  # Category manager (ordering, publish status)
│   │   │   ├── export-import/ # JSON & CSV data export and batch import
│   │   │   ├── login/       # Staff authentication page
│   │   │   ├── menu/        # Dish manager (prices, availability, featured)
│   │   │   ├── reservations/ # Table request review & staff notes
│   │   │   ├── settings/    # Announcement, verified contact, hours
│   │   │   ├── layout.tsx   # Server-side auth guard & staff navigation
│   │   │   └── page.tsx     # Operations overview dashboard
│   │   ├── api/
│   │   │   ├── admin/       # Protected staff endpoints (require session)
│   │   │   ├── auth/        # Login, logout, session check
│   │   │   ├── menu/        # Public menu retrieval with search & filters
│   │   │   └── reservations/# Public booking request submission & lookup
│   │   ├── contact/         # Contact & map directions page
│   │   ├── gallery/         # Lightbox photo gallery page
│   │   ├── menu/            # Dedicated interactive menu explorer
│   │   ├── privacy/         # Privacy Policy
│   │   ├── reservations/    # Booking request form & status tracker
│   │   ├── story/           # Editorial culinary & hospitality narrative
│   │   ├── terms/           # Terms & alcohol/age statutory policy
│   │   ├── error.tsx        # Error boundary
│   │   ├── globals.css      # Luxury tokens, typography, print rules
│   │   ├── layout.tsx       # Root layout, JSON-LD Schema.org Restaurant
│   │   ├── not-found.tsx    # Luxury 404 page
│   │   ├── page.tsx         # Homepage (Hero, Signatures, Categories, CTA)
│   │   ├── robots.ts        # Dynamic robots.txt
│   │   └── sitemap.ts       # Dynamic XML sitemap
│   ├── components/
│   │   ├── admin/           # AdminNav and staff controls
│   │   ├── gallery/         # GalleryLightbox component
│   │   ├── layout/          # Navbar, Footer, AnnouncementBar
│   │   ├── menu/            # MenuCard, MenuFilters, MenuExplorer
│   │   └── reservation/     # ReservationForm component
│   ├── data/
│   │   └── initialMenuData.json # Complete deduplicated menu inventory
│   ├── lib/
│   │   ├── adminAuthCheck.ts# Server-side session verification helper
│   │   ├── audit.ts         # Audit log service
│   │   ├── auth.ts          # Password hashing, JWT signing, rate limiting
│   │   ├── prisma.ts        # Singleton Prisma client instance
│   │   └── validations.ts   # Zod schemas, Indian phone regex, date checks
│   ├── test/
│   │   ├── auth.test.ts     # Auth & JWT unit tests
│   │   ├── database.test.ts # Database persistence & deduplication tests
│   │   ├── setup.ts         # Vitest global setup
│   │   └── validations.test.ts # Validation schemas & Indian phone tests
│   └── types/
│       └── index.ts         # Shared TypeScript interfaces
├── .env.example             # Documented environment template
├── next.config.mjs          # Next.js configuration and security headers
├── tailwind.config.js       # Luxury theme tokens
├── tsconfig.json            # Strict TypeScript configuration
└── vitest.config.ts         # Test runner configuration
```

---

## 3. Getting Started

### Prerequisites

- Node.js 18.18+ or 20+ (tested on Node v24.16.0)
- npm v10+

### Installation & Local Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database and run the seed script:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   Or build and run in production mode:
   ```bash
   npm run build
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Default Staff Admin Credentials

The initial administrator is provisioned via `npm run prisma:seed`:

- **Email:** `admin@houseno230.com`
- **Initial Password:** `Admin@House230`
- **Portal URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

> **Important:** In production, set `ADMIN_INITIAL_EMAIL` and `ADMIN_INITIAL_PASSWORD` before running the seed script, or update the credentials immediately upon first login.

---

## 5. Automated Tests

Run the test suite using Vitest:

```bash
npm run test
```

All 18 automated tests verify:
- Indian mobile phone number validation (+91 prefixes, 10-digit formats).
- Date validation (rejection of past dates in `Asia/Kolkata` timezone).
- Menu schema and optional price validation (handles unpriced dishes honestly without fake ₹0).
- Password hashing using `bcryptjs`.
- Tamper-evident JWT session creation and verification via `jose`.
- In-memory rate limiting against brute force attempts.
- Database persistence, category seeding, and signature dish deduplication.
- Reservation request lifecycle and status updates.

---

## 6. Menu Dataset & Clarifications

The entire 145-item inventory across 17 distinct categories has been seeded and deduplicated. Items repeated in multiple sections of the original notes have been unified into their primary category with `isFeatured: true` badges where appropriate.

### Ambiguous Labels Requiring Restaurant Confirmation

1. **"Belgium" (Beer & Bar Menu):**
   The source menu lists "Belgium". The restaurant must clarify whether this refers to a specific Belgian craft brewery (e.g., Stella Artois, Duvel, Hoegaarden, Leffe) or a generic imported draft category.
2. **"Veg Kothe" (Platters & Specialties):**
   Preserved as supplied. The restaurant must confirm the exact spelling on physical menus (e.g., Veg Kothey / Kothe).
3. **"Chinese Food" (Platters & Specialties):**
   Preserved as a specialty platter record. Clarification required whether this is a combination platter or an accidental section header.
4. **"Offer 1" & Food Combos:**
   Combos (e.g., Paneer Lababdar Combo + Cold Drink) are included as discrete offerings. Promotional discount terms or coupon codes must be confirmed before publishing promotional banners.
5. **Prices & Alcohol Specifications:**
   Prices are kept strictly `null` ("Price on enquiry") until verified rates are entered via the admin dashboard. Alcohol percentage, bottle volume (330ml/500ml/650ml), and licensing limits must be confirmed.

---

## 7. Production Deployment & Readiness Checklist

### Step 1: Provision Production PostgreSQL
- Create a managed PostgreSQL 15+ database (e.g., AWS RDS, Supabase, Neon, or Cloud SQL).
- Update `prisma/schema.prisma` datasource:
  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  ```
- Generate Prisma Client:
  ```bash
  npx prisma generate
  ```

### Step 2: Configure Environment Variables
Set the following on your hosting platform (Vercel, Railway, AWS ECS, or Render):
- `DATABASE_URL`: Production PostgreSQL connection string with SSL enabled.
- `SESSION_SECRET`: A secure, cryptographically random string (minimum 32 characters).
- `TIMEZONE`: `Asia/Kolkata`
- `NEXT_PUBLIC_APP_URL`: `https://www.houseno230.com`
- `NODE_ENV`: `production`

### Step 3: Run Database Migrations
Apply migrations safely without dropping data:
```bash
npx prisma migrate deploy
npm run prisma:seed
```

### Step 4: Asset & Image Storage
The application currently optimizes remote photography from approved Unsplash hosts and local assets. For custom food photo uploads:
- Configure an S3-compatible bucket (AWS S3 or Cloudflare R2).
- Add the custom CDN domain to `next.config.mjs` under `images.remotePatterns`.

### Step 5: Database Backup & Recovery Procedure
- **Automated Backups:** Configure daily snapshot backups with point-in-time recovery (PITR) enabled on the PostgreSQL instance.
- **Manual Dump:**
  ```bash
  pg_dump -U username -h hostname -d houseno230 > backup_$(date +%Y%m%d).sql
  ```
- **Restore:**
  ```bash
  psql -U username -h hostname -d houseno230 < backup_20261025.sql
  ```

### Step 6: Secret Rotation Procedure
- Generate a new `SESSION_SECRET`.
- Updating `SESSION_SECRET` will gracefully invalidate old sessions and require staff to re-authenticate.

---

## 8. Business Information Still Required From Owner

Before official launch, the restaurant management should log into `/admin/settings` and configure:
1. Exact street address, landmark, PIN code, and verified Google Maps link.
2. Official reservations telephone number.
3. Official WhatsApp Business inquiries number.
4. Exact lunch and dinner service timings.
5. Confirmed menu prices for dishes.
6. Official restaurant interior/exterior photography to replace placeholder editorial stock.
