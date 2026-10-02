# Deployment Guide

This document explains how to deploy **LinkShort** to production.

**Recommended: Railway (single web service + PostgreSQL)** — easiest path for beginners.

---

## Option A: Railway (Recommended)

Architecture after deploy:

```
GitHub repo
    ↓
Railway Web Service (ONE Node process)
  ├── React frontend  →  https://YOUR-DOMAIN/
  ├── REST API        →  https://YOUR-DOMAIN/api/...
  └── Short redirects →  https://YOUR-DOMAIN/abc123
    ↓
Railway PostgreSQL
```

### Step 1 — Push your code to GitHub

Make sure this repository (with root `package.json` and `railway.json`) is on GitHub.

### Step 2 — Create a Railway project

1. Go to [https://railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project**.
3. Choose **Deploy from GitHub repo** and select this repository.
4. Railway will create a **Web Service** from the repo root.
   - Build command: `npm run build` (from `railway.json` / root `package.json`)
   - Start command: `npm start` → runs `node server/src/server.js`

> Root Directory should be the **repository root** (where `package.json`, `client/`, and `server/` live). Leave it blank / `/`.

### Step 3 — Add PostgreSQL

1. In the same Railway project, click **+ New**.
2. Choose **Database** → **Add PostgreSQL**.
3. Wait until the database is online.

### Step 4 — Connect the database to the web service

1. Open your **Web Service** → **Variables**.
2. Add:

| Variable | Value |
| :--- | :--- |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | a long random string (32+ characters) |
| `COOKIE_SECRET` | another random string |
| `JWT_EXPIRES_IN` | `7d` |

> Tip: In Railway’s variable UI you can use the **Variable Reference** to Postgres → `DATABASE_URL` so you don’t paste secrets by hand.

The app **automatically creates tables** from `database/schema.sql` on startup (`CREATE TABLE IF NOT EXISTS`), so you do **not** need to run SQL manually.

### Step 5 — Generate a public domain

1. Open the Web Service → **Settings** → **Networking**.
2. Click **Generate Domain** (or attach a custom domain).
3. Copy the URL, e.g. `https://linkshort-production.up.railway.app`.

### Step 6 — Set public URL variables

Back in **Variables**, add (no trailing slash):

| Variable | Value |
| :--- | :--- |
| `APP_BASE_URL` | `https://YOUR-RAILWAY-DOMAIN` |
| `CLIENT_ORIGIN` | `https://YOUR-RAILWAY-DOMAIN` |

`APP_BASE_URL` is used when creating short links like `https://YOUR-RAILWAY-DOMAIN/abc123`.

If you forget `APP_BASE_URL`, the server will try `RAILWAY_PUBLIC_DOMAIN` automatically when available.

### Step 7 — Redeploy and verify

1. Trigger a redeploy (Railway often does this when variables change).
2. Open `https://YOUR-RAILWAY-DOMAIN/` — you should see the React app.
3. Open `https://YOUR-RAILWAY-DOMAIN/api/health` — should return JSON `success: true`.
4. Register a user, create a short link, open it — it should redirect.

### What you do NOT need

- ❌ Separate Vercel frontend  
- ❌ Separate Render backend  
- ❌ Hardcoded localhost URLs in production  
- ❌ Manual `PORT` (Railway sets `PORT` automatically)

---

## Option B: Docker Compose (VPS / Self-Hosted)

If you have a Linux VPS (DigitalOcean Droplet, AWS EC2, Linode, etc.), you can still run the stack with Docker.

### Prerequisites
- Docker & Docker Compose installed on your server.

### Steps

1. Clone the repository onto the server.
2. Export production environment variables:
   ```bash
   export APP_BASE_URL="https://yourdomain.com"
   export CLIENT_ORIGIN="https://yourdomain.com"
   export JWT_SECRET="your_very_secure_random_string"
   ```
3. Build and start:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

> Note: The production compose file still runs frontend + backend as separate containers. For the simplest cloud deploy, prefer **Option A (Railway single service)**.

---

## Environment Variable Reference

| Variable | Required | Description |
| :--- | :---: | :--- |
| `DATABASE_URL` | Yes | PostgreSQL connection string (Railway Postgres reference) |
| `JWT_SECRET` | Yes | Secret for signing JWTs |
| `NODE_ENV` | Yes | Set to `production` on Railway |
| `APP_BASE_URL` | Yes* | Public site URL used in generated short links |
| `CLIENT_ORIGIN` | Recommended | Allowed CORS / home-link origin (same as `APP_BASE_URL` on Railway) |
| `COOKIE_SECRET` | Recommended | Cookie signing secret |
| `PORT` | No | Set automatically by Railway |
| `JWT_EXPIRES_IN` | No | Default `7d` |
| `DATABASE_SSL` | No | Force SSL; auto-enabled in production for non-localhost |
| `VITE_API_BASE_URL` | No | Build-time frontend API URL; Railway build forces `/api` |

---

## Troubleshooting

| Problem | Fix |
| :--- | :--- |
| App crashes on boot | Check `DATABASE_URL` is set to `${{Postgres.DATABASE_URL}}` |
| Short links show `localhost` | Set `APP_BASE_URL` to your Railway HTTPS domain |
| Frontend blank / API 404 | Confirm root build produced `client/dist` and start command is `npm start` |
| Tables missing | Check logs for `[Database] Schema verified` — schema auto-applies on start |
| 502 / unhealthy | Ensure the process listens on `process.env.PORT` (already configured) |
