# PosBuzz Deployment Guide (5 Minutes)

## Quick Setup - 3 Steps

### Step 1: Create FREE Database (2 min)
1. Go to **https://neon.tech**
2. Click "Sign Up" → Sign in with GitHub
3. Create project named `posbuzz`
4. Copy the connection string (starts with `postgresql://...`)

### Step 2: Deploy Backend API on Vercel (2 min)
1. Go to **https://vercel.com/new**
2. Import `rafiqul4/PosBuzz` repository  
3. **Leave Root Directory EMPTY** (use repo root)
4. Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://...` (your Neon string) |
| `JWT_SECRET` | `posbuzz-prod-secret-key-2026` |
| `JWT_EXPIRES_IN` | `24h` |

5. Click Deploy
6. Note your backend URL: `https://posbuzz-api-xxx.vercel.app`

### Step 3: Configure Frontend (1 min)
1. Go to your existing frontend project on Vercel (posbuzz.vercel.app)
2. Settings → Environment Variables
3. Add: `VITE_API_URL` = `https://your-backend-url.vercel.app`
4. Deployments → Redeploy

## Done! 🎉
Your app should now work at https://posbuzz.vercel.app

## Database Migration
After first deploy, the database tables are created automatically by Prisma.
If you need to reset: Go to Neon dashboard → SQL Editor → Run the schema.
