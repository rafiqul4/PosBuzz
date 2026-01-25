# Vercel Deployment Guide for PosBuzz

This guide provides step-by-step instructions for deploying both the backend and frontend of PosBuzz on Vercel.

## Overview

PosBuzz is a monorepo with:
- **Backend**: NestJS API (`/backend` directory)
- **Frontend**: React + Vite app (`/frontend` directory)

Both can be deployed on Vercel, but they require separate Vercel projects.

---

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Connect your GitHub account to Vercel
3. **PostgreSQL Database**: You'll need a PostgreSQL database (Neon, Supabase, or Railway recommended)

---

## Option 1: Deploy Backend on Vercel (Using Root Directory)

### Step 1: Create New Vercel Project for Backend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New" → "Project"**
3. Select your **GitHub repository** (rafiqul4/PosBuzz)
4. Click **"Import"**

### Step 2: Configure Backend Project

In the project configuration page:

- **Project Name**: `posbuzz-backend` (or your choice)
- **Framework Preset**: Other
- **Root Directory**: Leave as `.` (root) or select `backend`
  - If you select root (`.`), Vercel will use `/vercel.json`
  - If you select `backend`, Vercel will use `/backend/vercel.json`
- **Build Command**: Override with `cd backend && npm install && npx prisma generate && npm run build`
- **Output Directory**: `backend/dist`
- **Install Command**: `cd backend && npm install`

### Step 3: Add Environment Variables

Add the following environment variables in Vercel dashboard:

```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=24h
NODE_ENV=production
CORS_ORIGINS=https://your-frontend-url.vercel.app
PORT=3000
```

**Note**: 
- Get `DATABASE_URL` from your PostgreSQL provider (Neon, Supabase, etc.)
- Generate a strong `JWT_SECRET` (min 32 characters)
- Update `CORS_ORIGINS` with your actual frontend URL after deploying frontend

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://posbuzz-backend.vercel.app`)

### Step 5: Run Database Migrations

After deployment, run migrations:

```bash
DATABASE_URL="your-production-database-url" npx prisma migrate deploy
```

Or set up automatic migrations in your build command.

---

## Option 2: Deploy Backend on Railway (Recommended Alternative)

**Note**: The DEPLOYMENT.md recommends Railway for backend because NestJS works better on platforms with native Node.js support rather than Vercel's serverless environment.

If you prefer Railway:
1. Follow instructions in `DEPLOYMENT.md`
2. Railway provides better support for long-running processes and WebSockets
3. Easier database integration with Railway PostgreSQL

---

## Deploy Frontend on Vercel

### Step 1: Create New Vercel Project for Frontend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New" → "Project"**
3. Select the **same GitHub repository** (rafiqul4/PosBuzz)
4. Click **"Import"**

### Step 2: Configure Frontend Project

In the project configuration page:

- **Project Name**: `posbuzz-frontend` (or your choice)
- **Framework Preset**: **Vite**
- **Root Directory**: Select **`frontend`** (important!)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 3: Add Environment Variables

Add the following environment variable:

```
VITE_API_URL=https://your-backend-url.vercel.app
```

**Important**: Replace with your actual backend URL from the backend deployment.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete
3. Visit your frontend URL (e.g., `https://posbuzz.vercel.app`)

### Step 5: Update Backend CORS

After frontend deployment:
1. Go to your backend Vercel project
2. Update the `CORS_ORIGINS` environment variable with your frontend URL
3. Redeploy the backend

---

## Configuration Files Explained

### `/vercel.json` (Root Level)
Used when deploying from the root directory. Contains commands that navigate to backend.

### `/backend/vercel.json`
Used when backend directory is set as the root directory in Vercel.

### `/frontend/vercel.json`
Used when frontend directory is set as the root directory in Vercel.

---

## Deployment Approaches

### Approach 1: Separate Projects (Recommended)

✅ **Backend Project**
- Root Directory: `backend`
- Uses: `/backend/vercel.json`
- URL: `https://posbuzz-backend.vercel.app`

✅ **Frontend Project**
- Root Directory: `frontend`
- Uses: `/frontend/vercel.json`
- URL: `https://posbuzz.vercel.app`

### Approach 2: Root Deployment

✅ **Backend Project**
- Root Directory: `.` (root)
- Uses: `/vercel.json`
- URL: `https://posbuzz-backend.vercel.app`

✅ **Frontend Project**
- Root Directory: `frontend`
- Uses: `/frontend/vercel.json`
- URL: `https://posbuzz-frontend.vercel.app`

---

## Post-Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Database migrations applied
- [ ] Environment variables configured correctly
- [ ] CORS updated with frontend URL
- [ ] Test API health endpoint: `curl https://your-backend.vercel.app/`
- [ ] Test frontend: Visit your frontend URL
- [ ] Create a test user via API
- [ ] Login on frontend
- [ ] Test product creation
- [ ] Test sales creation

---

## Troubleshooting

### Backend Issues

**Error: "No such file or directory: backend"**
- **Cause**: Wrong root directory setting in Vercel
- **Fix**: Either set root directory to `backend` in Vercel dashboard, or deploy from root using `/vercel.json`

**Error: "Prisma Client not generated"**
- **Cause**: Build command doesn't include `npx prisma generate`
- **Fix**: Ensure build command includes: `npm install && npx prisma generate && npm run build`

**Error: "Database connection failed"**
- **Cause**: Wrong `DATABASE_URL` or database not accessible
- **Fix**: Verify `DATABASE_URL` format and ensure database allows external connections

**Error: "CORS error"**
- **Cause**: Frontend URL not in `CORS_ORIGINS`
- **Fix**: Add frontend URL to `CORS_ORIGINS` environment variable and redeploy

### Frontend Issues

**Error: "API calls fail with 404"**
- **Cause**: Wrong `VITE_API_URL`
- **Fix**: Ensure `VITE_API_URL` points to your backend URL

**Error: "Network error"**
- **Cause**: CORS not configured on backend
- **Fix**: Add frontend URL to backend's `CORS_ORIGINS`

**Build fails**
- **Cause**: Missing dependencies
- **Fix**: Ensure all dependencies are in `package.json`, run `npm install` locally first

---

## Environment Variables Summary

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-min-32-chars` |
| `JWT_EXPIRES_IN` | JWT expiration time | `24h` |
| `NODE_ENV` | Environment mode | `production` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `https://posbuzz.vercel.app` |
| `PORT` | Port number | `3000` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://posbuzz-backend.vercel.app` |

---

## Continuous Deployment

Both projects will automatically deploy when you push to the main branch:
- Commit changes to `main` branch
- Vercel automatically triggers new deployment
- View deployment logs in Vercel dashboard

---

## Cost

- **Frontend on Vercel**: Free tier (generous limits)
- **Backend on Vercel**: Free tier (some limitations on execution time)
- **Database**: Free tier available on Neon, Supabase
- **Total**: $0 for development and demo purposes

---

## Alternative: Railway for Backend

If you encounter issues with Vercel for the backend, consider Railway:
- Better for long-running Node.js applications
- Native support for NestJS
- Built-in PostgreSQL
- See `DEPLOYMENT.md` for Railway setup instructions

---

## Support

For more information:
- [Vercel Documentation](https://vercel.com/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- Check `DEPLOYMENT.md` for Railway deployment alternative
