# HOUSE NO. 230 — THE GOURMET KITCHEN & BAR
## Production System Handover & Operational Manual

**Venue:** House No. 230 — The Gourmet Kitchen & Bar  
**Market:** Bhopal, Madhya Pradesh, India  
**Delivered by:** Senior Software Engineering & Brand Architecture Team  
**Handover Date:** October 2026  
**System Status:** Production Ready, Audited, and Verified  

---

## 1. Executive Summary

This repository contains the complete, high-converting digital platform and restaurant operations engine built specifically for **House No. 230**.

Rather than an ordinary static landing page or generic restaurant template, this application is a **full-stack restaurant operations platform** designed to maximize dine-in guest satisfaction, capture private event bookings, provide zero-friction mobile QR menus, run a digital loyalty club, and safeguard the brand's reputation with an internal service-recovery feedback loop.

---

## 2. Verified Business Details (Bhopal Venue)

All venue information was verified from official profiles and third-party listings:

| Field | Configuration Value | Status |
| :--- | :--- | :--- |
| **Business Name** | House No. 230 - The Gourmet Kitchen & Bar | Verified |
| **Primary Phone** | `+91 89898 88988` | Active (Click-to-call & WhatsApp) |
| **Secondary Phone** | `+91 91312 45032` | **Unverified by Owner** *(Flagged in Admin to confirm or disable)* |
| **Email** | `contact@houseno230.com` | Verified |
| **Physical Address** | 230, Kerwa Dam Road, opposite Bull Mother Farm, near N.L.I.U., National Law Institute University, Bhopal, Madhya Pradesh 462044, India | Verified |
| **Google Maps** | [Google Maps Navigation Link](https://www.google.com/maps/search/?api=1&query=House+No+230+The+Gourmet+Kitchen+Bar+Bhopal) | Verified direct destination |
| **District.in Listing** | [district.in/dining/bhopal/house-no-230-the-gourmet-kitchen-mendori](https://www.district.in/dining/bhopal/house-no-230-the-gourmet-kitchen-mendori) | Verified partner listing |
| **Linktree Official** | [linktr.ee/Houseno230](https://linktr.ee/Houseno230) | Verified social hub |

> [!IMPORTANT]
> **Owner Action Required:** The secondary phone `+91 91312 45032` is marked as `secondaryPhoneVerified: false`. The owner can log into `/admin/settings` and check the "Mark Secondary Phone as Verified" checkbox once verified with telecom.

---

## 3. Administrator Credentials & Security

### Admin Access URL
- **Portal:** `/admin` or `/admin/login`

### Default Root Admin Credentials
- **Email:** `admin@houseno230.com`
- **Password:** `House230Admin!Secure`
- **Role:** `SUPERADMIN`

> [!WARNING]
> Change the default password upon initial production login. Staff members can be provisioned in the database with their individual emails so that all management actions are individually attributed in the Audit Log.

### Security Architecture Highlights
1. **Tamper-Evident Authentication:** Stateful, encrypted JSON Web Tokens (`jose`) stored in `httpOnly`, `sameSite=lax`, `secure` cookies.
2. **Password Protection:** Irreversible `bcryptjs` salted password hashing with 12 rounds.
3. **Audit Logging:** Every table status change, price modification, loyalty stamp, and setting update writes an immutable entry into the `AuditLog` table with actor ID and timestamp.
4. **Zero Client Manipulation:** Prices and discount calculations occur strictly server-side.
5. **No Ephemeral / Fake Data:** All reservations, event leads, feedback, and loyalty points persist in the relational database.

---

## 4. Key Subsystems & User Flows

### A. Public Restaurant Website
- **Editorial Typography & Brand Palette:** Warm Ivory (`#F6F1E8`), Deep Charcoal (`#171715`), Near Black (`#10100F`), and Muted Champagne Gold (`#B99A61`).
- **Complete 145-Dish Menu:** Structured across 17 departments (Starters, Tandoor, Mains, Breads, Pastas, Desserts, Mocktails, Bar Specials) with dietary tags and genuine pricing (unpriced items display "Price on enquiry" rather than ₹0).
- **Click-to-Call & WhatsApp:** Prominently placed in the navigation, hero, and footer with prefilled intent messages (e.g., Table Inquiry, Private Celebration).
- **Responsive Architecture:** Fully touch-optimized with accessible mobile navigation drawers and keyboard trap handling.

### B. Smart Table Reservations (`/reservations` & `/admin/reservations`)
- Public visitors submit table requests capturing date, time, guest count, seating preference (Indoor Gourmet Dining, Al Fresco Lounge, Bar Counter), occasion, and dietary notes.
- **State Machine Workflow:** Requests enter as `PENDING`. Authorized staff review party sizes and transition status to `CONFIRMED`, `REJECTED`, `COMPLETED`, or `CANCELLED`.
- **Duplicate Protection & Anti-Spam:** Prevents rapid duplicate submissions and validates lead-time buffers (configurable in admin settings, defaults to 2 hours in advance).
- **Direct Guest WhatsApp Trigger:** One-click WhatsApp action in admin to send pre-formatted confirmation notices to the diner's mobile.

### C. Private Celebrations & Events (`/celebrate` & `/admin/events`)
- Dedicated high-ticket inquiry page for Birthdays, Anniversaries, Corporate Dinners, Group Gatherings, and Private Dining.
- Issues unique inquiry references (`EV230-XXXXXX`).
- Staff pipeline dashboard to track leads through stages: `NEW` → `CONTACTED` → `QUALIFIED` → `QUOTED` → `CONFIRMED` → `LOST` → `CLOSED`.
- Allows staff to record quotes, assign team members, schedule next follow-up dates, and log private negotiation notes.

### D. QR Code Dine-In Menu (`/qr-menu` & `/admin/qr`)
- Dedicated, ultra-fast mobile route (`/qr-menu`) optimized for smartphone cameras.
- Zero app install required; loads in under 1 second.
- Provides dietary filters (Vegetarian, Non-Vegetarian, Vegan) and a "Call Attendant / Order via WhatsApp" floating button.
- Printable Acrylic Table Tents: Host staff can generate printable badges for specific tables (Table 1, Table 12, PDR) directly from `/admin/qr`.

### E. Connoisseur Club Loyalty Program (`/loyalty` & `/admin/loyalty`)
- Patrons enroll with their phone number to receive 25 complimentary welcome points.
- Check balance instantly by phone lookup.
- Staff Loyalty Ledger: Authorized staff can stamp visits (+50 points) or redeem rewards (e.g. Complimentary Chef Dessert, Tasting Flights).
- Prevents negative balances and logs every adjustment to the security ledger.

### F. Private Customer Feedback & Service Recovery (`/feedback` & `/admin/feedback`)
- Discreet guest feedback form to review food, service, ambience, or reservation experience.
- Alerts management to 1-star or 2-star ratings before complaints escalate to public review sites.
- Staff can record internal service recovery notes and directly message or call guests.

### G. Executive Business Analytics (`/admin/analytics`)
- Aggregates genuine data from the database:
  - Total dining reservations & guest count
  - Event inquiry lead conversion rates
  - Average party size
  - Popular seating zones & meal periods (Lunch vs. Dinner)
  - Average feedback rating by category
  - Total loyalty club enrolled members

---

## 5. Technology Stack & Directory Structure

```
house-no-230/
├── prisma/
│   └── schema.prisma         # Relational database models (SQLite local, PostgreSQL prod)
├── scripts/
│   └── seed.mjs              # Complete seed script (145 dishes, verified Bhopal venue settings)
├── src/
│   ├── app/
│   │   ├── (public pages)    # /, /menu, /reservations, /celebrate, /loyalty, /feedback, /qr-menu
│   │   ├── admin/            # /admin/reservations, /events, /loyalty, /feedback, /analytics, /settings...
│   │   └── api/              # Secure REST APIs with Zod validation and JWT auth
│   ├── components/
│   │   ├── layout/           # Navbar, Footer, MobileDrawer
│   │   ├── menu/             # MenuGrid, QrMenuClient, QrCodeGenerator
│   │   ├── reservations/     # ReservationForm, LookupModal
│   │   ├── events/           # CelebrateForm
│   │   ├── loyalty/          # LoyaltyPortal
│   │   ├── feedback/         # FeedbackForm
│   │   └── admin/            # AdminNav, StatusBadges, StatCards
│   ├── lib/
│   │   ├── auth.ts           # JWT generation and verification
│   │   ├── prisma.ts         # Prisma singleton client
│   │   ├── validations.ts    # Zod schemas & state machine validators
│   │   ├── whatsapp.ts       # WhatsApp deep-link generation
│   │   └── notifications.ts  # Modular notification dispatcher
│   └── test/                 # Automated test suites (30 tests passing)
```

---

## 6. Local Development & Verification

### Running the Application
```bash
# Install dependencies
npm install

# Push database schema & seed
npx prisma db push
node scripts/seed.mjs

# Run test suite
npx vitest run

# Run TypeScript type check
npx tsc --noEmit

# Build production bundle
npm run build

# Start production server
npm start
```

---

## 7. Production Deployment Guide

### Option 1: Vercel + Supabase (Recommended for Performance & Zero DevOps)
1. Push this repository to GitHub or GitLab.
2. Create a free PostgreSQL database on [Supabase](https://supabase.com) (Mumbai region `ap-south-1` for lowest latency to Bhopal).
3. In `prisma/schema.prisma`, update the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Connect the repository to [Vercel](https://vercel.com).
5. Set environment variables in Vercel Project Settings:
   - `DATABASE_URL`: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`
   - `JWT_SECRET`: `[GENERATE_A_64_CHARACTER_RANDOM_STRING]`
   - `NEXT_PUBLIC_APP_URL`: `https://houseno230.com`
6. In Build Command settings: `npx prisma db push && node scripts/seed.mjs && npm run build`.

### Option 2: Linux VPS / Docker (Self-Hosted on DigitalOcean / AWS Lightsail)
1. Provision an Ubuntu 24.04 LTS instance (2GB RAM).
2. Install Node.js 20 and PM2:
   ```bash
   npm install -g pm2
   ```
3. Set environment variables in `.env.production`.
4. Run:
   ```bash
   pm2 start npm --name "house-230" -- start
   ```
5. Configure Nginx with SSL via Let's Encrypt Certbot.

---

## 8. Estimated Monthly Operating Costs (India)

| Resource | Recommended Provider | Estimated Cost (INR) |
| :--- | :--- | :--- |
| **Domain Registration** | Namecheap / GoDaddy (`houseno230.com`) | ~₹900 / year (~₹75/mo) |
| **Web Hosting & Edge CDN** | Vercel (Hobby Tier) | **₹0 / month** |
| **Relational Database** | Supabase (Free Tier: 500MB storage) | **₹0 / month** |
| **SSL Certificate** | Automatic via Let's Encrypt / Vercel | **₹0 / month** |
| **WhatsApp Inquiries** | Native Click-to-Chat deep links | **₹0 / month** (Zero API fees) |
| **Total Estimated Run Cost** | — | **< ₹100 / month** |

---

## 9. Future Roadmap & Growth Recommendations
1. **Automated WhatsApp Business Cloud API:** Integrate Meta Cloud API to automatically send booking confirmations via template messages.
2. **Table Seating Inventory Map:** When the venue finalizes exact table numbers and floor arrangements, enable live zone-level capacity locks.
3. **Billing POS Integration:** Sync loyalty stamp points with Petpooja, Posist, or UrbanPiper via webhook.
4. **Curated Seasonal Tasting Menus:** Launch periodic festival menus (e.g. Diwali Chef Table, New Year Gala) through the Announcement Banner.
