# Deployment Guide - Vercel

## Prerequisites

- Vercel account (free tier works fine)
- GitHub repository connected to Vercel
- PostgreSQL database (Neon, Supabase, or Railway recommended)

## Backend Deployment (NestJS API)

### Option 1: Deploy to Render or Railway (Recommended for NestJS)

NestJS applications work best on platforms that support Node.js applications natively. Vercel is optimized for serverless functions, which may have limitations with NestJS.

**Railway Deployment (Recommended):**

1. Go to [Railway.app](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add a PostgreSQL database from Railway
5. Set environment variables:
   ```
   DATABASE_URL=<provided by Railway PostgreSQL>
   JWT_SECRET=<your-secret-key>
   JWT_EXPIRES_IN=24h
   REDIS_HOST=<optional>
   REDIS_PORT=6379
   NODE_ENV=production
   CORS_ORIGINS=https://your-frontend.vercel.app
   PORT=3000
   ```
6. Railway will auto-deploy on every push to main branch

**Backend URL**: Your Railway app URL (e.g., `https://posbuzz-backend.up.railway.app`)

### Option 2: Deploy Backend to Vercel (Alternative)

If you prefer Vercel for backend:

1. Create a new Vercel project for backend
2. Set root directory to `backend`
3. Add environment variables in Vercel dashboard
4. Deploy

**Note**: You may need to adapt the app for serverless mode.

## Frontend Deployment (React + Vite)

Vercel is perfect for the frontend!

### Steps:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend URL (e.g., `https://posbuzz-backend.up.railway.app`)

6. Click "Deploy"

### Frontend URL

After deployment, Vercel will provide a URL like:
- Production: `https://posbuzz.vercel.app`
- Preview: `https://posbuzz-git-branch.vercel.app`

## Database Setup

### Option 1: Neon (Serverless PostgreSQL - Free)

1. Go to [Neon.tech](https://neon.tech/)
2. Create a new project
3. Copy the connection string
4. Add to backend environment variables as `DATABASE_URL`

### Option 2: Supabase (Free PostgreSQL)

1. Go to [Supabase.com](https://supabase.com/)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Connection pooling)
5. Add to backend environment variables as `DATABASE_URL`

### Run Migrations

After deploying backend with database:

```bash
# Connect to your deployed database
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

Or set up automatic migrations in your Railway/Render deploy script.

## Redis (Optional)

For production Redis:

1. Use Railway Redis addon (Railway)
2. Or use Upstash Redis (serverless)
3. Or skip Redis for now (it's configured but not actively used)

## Post-Deployment Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Database migrations applied
- [ ] Environment variables set correctly
- [ ] CORS configured with frontend URL
- [ ] Create a test user via Postman
- [ ] Test login on frontend
- [ ] Test creating products
- [ ] Test creating sales

## Testing Your Deployment

1. **Test Backend API**:
   ```bash
   curl https://your-backend-url.com/
   # Should return "Hello World!"
   ```

2. **Test Frontend**:
   - Visit your frontend URL
   - Try to login (create user via API first)
   - Test product management
   - Test sales creation

## Troubleshooting

### Backend Issues

- **502 Bad Gateway**: Check if backend is running and logs
- **Database connection failed**: Verify DATABASE_URL is correct
- **CORS errors**: Add frontend URL to CORS_ORIGINS

### Frontend Issues

- **API calls fail**: Check VITE_API_URL is set correctly
- **Blank page**: Check browser console for errors
- **Build fails**: Ensure all dependencies are in package.json

## Environment Variables Summary

### Backend (Railway/Render)
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=24h
NODE_ENV=production
PORT=3000
CORS_ORIGINS=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.com
```

## URLs to Submit

After deployment, you'll have:

1. **Frontend URL**: `https://posbuzz.vercel.app`
2. **Backend URL**: `https://posbuzz-backend.up.railway.app`
3. **GitHub Repository**: `https://github.com/rafiqul4/PosBuzz`

Include these URLs in your submission!

## Continuous Deployment

Both Vercel and Railway support automatic deployments:

- Every push to `main` branch triggers production deployment
- Pull requests get preview deployments
- Rollback to previous versions anytime

## Cost

- **Frontend (Vercel)**: Free tier (more than enough)
- **Backend (Railway)**: Free tier ($5/month credit)
- **Database (Neon/Supabase)**: Free tier available
- **Total**: $0 for development/demo purposes!

## Need Help?

Check the logs:
- **Vercel**: Dashboard → Your Project → Deployments → Logs
- **Railway**: Dashboard → Your Service → Deployments → Logs
