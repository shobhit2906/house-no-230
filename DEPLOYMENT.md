# HOUSE NO. 230 — PRODUCTION DEPLOYMENT & DATABASE MANUAL

This document explains how to deploy the **House No. 230** website and management system to production, and how the database works between local development and cloud deployment.

---

## 1. How the Database Works (SQLite vs PostgreSQL)

### Local Environment (Current)
- The app currently uses **Prisma ORM with SQLite** (`prisma/dev.db`).
- SQLite is ideal for fast local development, instant testing, and zero external software requirements.

### Production Environment (Cloud)
- Cloud platforms like Vercel or Netlify have serverless, ephemeral filesystems (meaning SQLite files reset on restarts).
- For production, the industry standard is **PostgreSQL**.
- Prisma makes switching to PostgreSQL effortless: the entire schema is 100% compatible. You only need to switch the datasource provider using the provided helper command:
  ```bash
  npm run switch:pg
  ```

---

## 2. Recommended Deployment: Vercel + Supabase (100% Free & Fast)

This is the recommended approach for modern web apps. It gives you:
- Global CDN with lightning-fast load times.
- Automatic HTTPS / SSL certificates.
- Zero server maintenance or patching.
- Total cost: **₹0 / month** on free tiers.

### Step 1: Create a Free PostgreSQL Database on Supabase
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**:
   - **Name:** `house-no-230`
   - **Database Password:** Choose a strong password (save it).
   - **Region:** Select **South Asia (Mumbai) / `ap-south-1`** (this gives the lowest latency for Bhopal diners).
3. Once created, go to **Project Settings** → **Database** → **Connection String** → select **URI**.
4. Copy the connection string (it looks like `postgresql://postgres.[ref]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`).

### Step 2: Switch the Project to PostgreSQL
In your terminal, run:
```bash
npm run switch:pg
```
*(This automatically updates `prisma/schema.prisma` to use `postgresql` and regenerates the Prisma client).*

### Step 3: Push Your Code to GitHub
```bash
git add -A
git commit -m "chore: ready for production deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/house-no-230.git
git push -u origin main
```

### Step 4: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New Project** and select your `house-no-230` repository.
3. In **Build and Output Settings**, set:
   - **Build Command:** `npm run deploy:build`
     *(This automatically pushes the schema to Supabase, seeds all 145 dishes + Bhopal venue details, and builds the Next.js app).*
4. In **Environment Variables**, add:
   - `DATABASE_URL`: Your Supabase connection string from Step 1.
   - `SESSION_SECRET`: A secure random 64-character string (or `JWT_SECRET`).
   - `ADMIN_INITIAL_PASSWORD`: A strong initial password for first-time admin creation.
   - `NEXT_PUBLIC_APP_URL`: `https://houseno230.com` (or your initial `.vercel.app` URL).
5. Click **Deploy**. In under 2 minutes, your website will be live!

### Step 5: Connect Your Custom Domain
1. In Vercel Project Settings, navigate to **Domains**.
2. Enter your custom domain (e.g., `houseno230.com` or `www.houseno230.com`).
3. Add the DNS records (A record or CNAME) shown by Vercel into your domain registrar (GoDaddy, Namecheap, Google Domains).
4. SSL certificates are provisioned automatically.

---

## 3. Alternative: 1-Click Fullstack on Railway

If you prefer an all-in-one container platform without separate services:
1. Go to [railway.app](https://railway.app).
2. Click **New Project** → **Provision PostgreSQL**.
3. In the same project, click **New Service** → **GitHub Repo** → select your `house-no-230` repository.
4. Set the environment variable `DATABASE_URL` to `${{Postgres.DATABASE_URL}}`.
5. Set `SESSION_SECRET` (or `JWT_SECRET`), `ADMIN_INITIAL_PASSWORD`, and `NEXT_PUBLIC_APP_URL`.
6. Set Custom Build Command to: `npm run deploy:build`.
7. Railway will build and host both the app and database.

---

## 4. Alternative: Self-Hosted Docker / Linux VPS

If you have a Linux VPS (DigitalOcean, AWS EC2, Linode, Hostinger):
1. Clone the repository onto your server.
2. Run the included Docker Compose configuration:
   ```bash
   npm run switch:pg
   docker compose up -d --build
   ```
3. Run the initial database push and seed inside the container:
   ```bash
   docker compose exec app npx prisma db push
   docker compose exec app node scripts/seed.mjs
   ```
4. Point your domain A record to your server IP, and configure Nginx / Caddy with Let's Encrypt for SSL.

---

## 5. Post-Deployment Verification Checklist

Once deployed, visit your live URL and verify:
- [ ] Homepage hero, story, and dining gallery images load clearly.
- [ ] Public menu displays all 145 items with categories and dietary badges.
- [ ] Click-to-call (`tel:+918989888988`) and WhatsApp button trigger properly.
- [ ] Submit a test table reservation at `/reservations` and confirm reference generation (`RES230-XXXXXX`).
- [ ] Submit a test celebration inquiry at `/celebrate` (`EV230-XXXXXX`).
- [ ] Log into the Admin panel at `/admin` using:
  - **Email:** `admin@houseno230.com`
  - **Password:** `House230Admin!Secure`
- [ ] Immediately change the default admin password in `/admin/settings`.
