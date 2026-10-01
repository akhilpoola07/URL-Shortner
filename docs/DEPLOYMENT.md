# Deployment Guide

This document outlines how to deploy the **LinkShort** application to a production environment. 

## Option A: Docker Compose (VPS / Self-Hosted)

If you have a Linux VPS (DigitalOcean Droplet, AWS EC2, Linode, etc.), you can run the entire application stack in isolated containers.

### Prerequisites
- Docker & Docker Compose installed on your server.
- Port `80` (Frontend), `5001` (Backend), and `5432` (PostgreSQL) available.

### Steps to Deploy

1. **Clone your repository** onto the server.
2. **Export Environment Variables** (Optional but recommended). By default, the compose file uses fallback values perfect for testing locally. For real production, set these before building:
   ```bash
   export APP_BASE_URL="http://api.yourdomain.com"
   export CLIENT_ORIGIN="http://yourdomain.com"
   export JWT_SECRET="your_very_secure_random_string"
   ```
3. **Build and start the containers** using the production compose file:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```
4. **Verify it's running**:
   - The Frontend is available at `http://your_server_ip` (Port 80)
   - The Backend API is available at `http://your_server_ip:5001`
   - The Postgres Database runs securely in the background.

---

## Option B: Managed Cloud (Vercel & Render)

This is the most popular way to host modern web apps for free.

### 1. Database (Render / Railway)
- Create a free account on [Render](https://render.com) or [Railway](https://railway.app).
- Provision a new **PostgreSQL** database.
- Copy the **External Database URL**.

### 2. Backend (Render Web Service)
- Create a new **Web Service** on Render and connect your GitHub repo.
- Set the Root Directory to `server`.
- Build Command: `npm install`
- Start Command: `npm start`
- **Environment Variables**:
  - `DATABASE_URL`: (Paste the database URL from step 1)
  - `NODE_ENV`: `production`
  - `JWT_SECRET`: (Generate a secure random string)
  - `CLIENT_ORIGIN`: (Leave blank for now, you will update this after step 3)
  - `APP_BASE_URL`: (The URL Render provides for your backend, e.g., `https://linkshort-api.onrender.com`)

### 3. Frontend (Vercel)
- Create a free account on [Vercel](https://vercel.com).
- Import your GitHub repo.
- Set the Root Directory to `client`.
- Framework Preset: **Vite**
- **Environment Variables**:
  - `VITE_API_BASE_URL`: (The Render Backend URL + `/api`, e.g., `https://linkshort-api.onrender.com/api`)
- Click **Deploy**.

*After Vercel finishes, take your Vercel URL (e.g., `https://linkshort.vercel.app`), go back to Render, and add it to your Backend's `CLIENT_ORIGIN` environment variable so CORS is properly configured.*
