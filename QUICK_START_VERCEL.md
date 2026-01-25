# Quick Start: Deploy to Vercel

This guide helps you deploy the PosBuzz backend to Vercel after the fixes have been applied.

## Prerequisites

✅ All fixes have been merged to your repository
✅ You have a Vercel account
✅ You have a PostgreSQL database ready (get one from Neon.tech, Supabase, or Railway)

## Step 1: Deploy Backend to Vercel

### 1.1 Create Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New" → "Project"**
3. Select your **GitHub repository** (rafiqul4/PosBuzz)
4. Click **"Import"**

### 1.2 Configure Project

**IMPORTANT:** Set these values exactly:

```
Project Name: pos-buzz (or your choice)
Framework Preset: Other
Root Directory: . (DOT - means root, NOT backend)
Build Command: (leave default)
Output Directory: (leave default)
Install Command: npm install
```

### 1.3 Set Environment Variables

Click **"Environment Variables"** and add:

```
DATABASE_URL = postgresql://user:password@host:5432/database?schema=public
JWT_SECRET = your-secret-key-minimum-32-characters-long-random-string
JWT_EXPIRES_IN = 24h
NODE_ENV = production
CORS_ORIGINS = https://pos-buzz-frontend.vercel.app
```

**Where to get DATABASE_URL:**
- **Neon.tech** (Free): https://neon.tech/ → Create Project → Copy connection string
- **Supabase** (Free): https://supabase.com/ → Settings → Database → Connection string
- **Railway** (Free $5 credit): https://railway.app/ → New Project → PostgreSQL → Copy URL

**Generate JWT_SECRET:**
```bash
# Run this in your terminal to generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://pos-buzz.vercel.app` or `https://pos-buzz-xyz.vercel.app`

### 1.5 Run Database Migrations

After deployment succeeds, run migrations:

```bash
# In your local terminal
cd backend

# Set your production database URL
export DATABASE_URL="your-production-database-url-from-vercel"

# Run migrations
npx prisma migrate deploy

# Verify
npx prisma db pull
```

### 1.6 Test Backend

```bash
# Replace with your actual backend URL
curl https://pos-buzz.vercel.app/

# Should return:
# {"message":"Hello World!"}
```

✅ **Backend is now deployed!** Note your backend URL for the next step.

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Project

1. Go back to https://vercel.com/dashboard
2. Click **"Add New" → "Project"**
3. Select the **SAME GitHub repository** (rafiqul4/PosBuzz)
4. Click **"Import"**

### 2.2 Configure Project

**IMPORTANT:** Different settings than backend:

```
Project Name: pos-buzz-frontend (or your choice)
Framework Preset: Vite
Root Directory: frontend (NOT root, select "frontend" folder)
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.3 Set Environment Variable

Click **"Environment Variables"** and add:

```
VITE_API_URL = https://pos-buzz.vercel.app
```

⚠️ **Replace with your actual backend URL from Step 1.4**

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for build to complete
3. You'll get a URL like: `https://pos-buzz-frontend.vercel.app`

✅ **Frontend is now deployed!**

---

## Step 3: Connect Backend and Frontend

### 3.1 Update Backend CORS

1. Go to backend Vercel project: https://vercel.com/dashboard
2. Click on your backend project (pos-buzz)
3. Go to **Settings → Environment Variables**
4. Find **CORS_ORIGINS** variable
5. Update its value to your frontend URL: `https://pos-buzz-frontend.vercel.app`
6. Click **"Save"**

### 3.2 Redeploy Backend

1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **"Redeploy"**
4. Wait for redeploy to complete (~1 minute)

✅ **Backend and frontend are now connected!**

---

## Step 4: Test Everything

### 4.1 Open Frontend

Visit your frontend URL: `https://pos-buzz-frontend.vercel.app`

### 4.2 Create Test User (via API)

```bash
# Replace with your backend URL
curl -X POST https://pos-buzz.vercel.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "Demo1234!",
    "name": "Demo User"
  }'

# Should return user object with id, email, name
```

### 4.3 Test Login on Frontend

1. Go to frontend: `https://pos-buzz-frontend.vercel.app`
2. Click **Login** or navigate to login page
3. Enter:
   - Email: `demo@example.com`
   - Password: `Demo1234!`
4. Click **Login**

✅ If you can login successfully, everything is working!

### 4.4 Test Products

1. After logging in, go to **Products** page
2. Click **Add Product**
3. Fill in product details
4. Click **Save**

✅ If product is created, the full app is working!

---

## Troubleshooting

### Backend shows 404

**Check:**
- Root directory is `.` (root), NOT `backend`
- Go to Vercel dashboard → Your backend project → Settings → General → Root Directory
- Should show: `.` or `Root Directory: .`

**Fix:**
- Change to `.` (root)
- Redeploy

### Frontend can't connect to backend

**Check:**
- `VITE_API_URL` is set correctly
- Go to Vercel dashboard → Frontend project → Settings → Environment Variables
- Should show: `VITE_API_URL = https://pos-buzz.vercel.app`

**Fix:**
- Update `VITE_API_URL` with correct backend URL
- Redeploy frontend

### CORS errors in browser console

**Check:**
- Backend's `CORS_ORIGINS` includes frontend URL
- Go to Vercel dashboard → Backend project → Settings → Environment Variables
- Should show: `CORS_ORIGINS = https://pos-buzz-frontend.vercel.app`

**Fix:**
- Add frontend URL to `CORS_ORIGINS`
- Redeploy backend

### Database connection errors

**Check:**
- `DATABASE_URL` is correct
- Database allows external connections
- Test locally: `npx prisma db pull`

**Fix:**
- Verify database URL format: `postgresql://user:pass@host:5432/db?schema=public`
- Ensure database provider allows Vercel connections
- Check database firewall/IP restrictions

---

## Summary

**What was done:**
1. ✅ Created serverless handler for NestJS (`api/index.ts`)
2. ✅ Configured Vercel to use serverless architecture
3. ✅ Set up proper routing and dependencies
4. ✅ Created comprehensive documentation

**Your backend URL:** `https://pos-buzz.vercel.app`
**Your frontend URL:** `https://pos-buzz-frontend.vercel.app`

**Deployment is complete when:**
- ✅ Backend returns `{"message":"Hello World!"}` on health check
- ✅ Frontend loads without errors
- ✅ You can register and login
- ✅ You can create products and sales

---

## Need More Help?

See detailed documentation:
- **VERCEL_FIX_SUMMARY.md** - Complete explanation of the fix
- **VERCEL_BACKEND_DEPLOYMENT.md** - Detailed backend deployment guide
- **VERCEL_DEPLOYMENT.md** - General deployment overview
- **DEPLOYMENT.md** - Alternative hosting options (Railway, Render)

---

## Success Checklist

After following this guide:

- [ ] Backend deployed to Vercel
- [ ] Backend URL accessible and returns Hello World
- [ ] Database migrations applied
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads without errors
- [ ] Backend CORS updated with frontend URL
- [ ] Can register new user via API
- [ ] Can login on frontend
- [ ] Can create products
- [ ] Can create sales

✅ **All checks passed? You're done! Congratulations! 🎉**

---

**Support:** Check the detailed documentation files or create an issue on GitHub.
