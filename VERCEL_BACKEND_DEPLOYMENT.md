# Vercel Deployment Configuration for PosBuzz Backend

This document explains the Vercel deployment setup for the PosBuzz backend.

## Architecture

The backend is deployed as a **Vercel Serverless Function** that wraps the NestJS application.

### Key Files

1. **`/api/index.ts`** - Serverless handler that bootstraps the NestJS app
2. **`/vercel.json`** - Vercel configuration for routing and builds
3. **`/package.json`** - Root dependencies for the serverless function
4. **`/tsconfig.json`** - TypeScript configuration for compilation

## How It Works

1. All incoming requests to the Vercel deployment are routed to `/api/index.ts`
2. The serverless function creates and caches a NestJS application instance
3. Express handles the HTTP requests through NestJS controllers
4. The application instance is reused across invocations (warm starts)

## Deployment Steps

### 1. Prerequisites

- Vercel account
- PostgreSQL database (Neon, Supabase, or Railway recommended)
- GitHub repository connected to Vercel

### 2. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New" → "Project"**
3. Select your GitHub repository
4. Click **"Import"**

### 3. Configure Project

**Important:** Use the **root directory** (`.`), not `backend`.

- **Project Name**: `pos-buzz` (or your choice)
- **Framework Preset**: Other
- **Root Directory**: `.` (root - DO NOT select backend)
- **Build Command**: Leave as default or set to `npm run vercel-build`
- **Output Directory**: Leave empty (serverless functions don't use this)
- **Install Command**: `npm install`

### 4. Set Environment Variables

Add the following in the Vercel dashboard (Settings → Environment Variables):

```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=24h
NODE_ENV=production
CORS_ORIGINS=https://pos-buzz-frontend.vercel.app
```

**Important Notes:**
- Replace `DATABASE_URL` with your actual PostgreSQL connection string
- Generate a secure `JWT_SECRET` (minimum 32 characters)
- Set `CORS_ORIGINS` to your frontend URL (you can add it after deploying frontend)
- You can add multiple origins separated by commas: `https://app1.vercel.app,https://app2.vercel.app`

### 5. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Your backend will be available at `https://pos-buzz.vercel.app` (or your custom URL)

### 6. Run Database Migrations

After successful deployment, you need to apply database migrations:

```bash
# Set the DATABASE_URL to your production database
export DATABASE_URL="your-production-database-url"

# Navigate to backend directory
cd backend

# Run migrations
npx prisma migrate deploy
```

Alternatively, you can run migrations from the Vercel deployment logs or set up a post-deploy script.

## Testing Your Deployment

### Test the API

```bash
# Health check
curl https://pos-buzz.vercel.app/

# Should return: {"message":"Hello World!"}
```

### Test Authentication

```bash
# Register a new user
curl -X POST https://pos-buzz.vercel.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Login
curl -X POST https://pos-buzz.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

## Vercel Configuration Explained

### `/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["backend/**"]
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

- **builds**: Tells Vercel to compile `api/index.ts` using Node.js runtime and include the `backend/` directory
- **routes**: Routes all requests to the serverless function

### `/api/index.ts`

The serverless handler:
- Caches the NestJS app instance (improves performance)
- Configures CORS based on `CORS_ORIGINS` environment variable
- Enables validation pipes
- Exports a function that handles HTTP requests

## CORS Configuration

The backend dynamically configures CORS based on the `CORS_ORIGINS` environment variable:

- **Single origin**: `CORS_ORIGINS=https://frontend.vercel.app`
- **Multiple origins**: `CORS_ORIGINS=https://app1.vercel.app,https://app2.vercel.app`
- **Allow all** (not recommended): `CORS_ORIGINS=*`

## Troubleshooting

### 404 NOT_FOUND Error

**Symptom**: Visiting the backend URL shows `404: NOT_FOUND`

**Causes & Solutions**:

1. **Wrong Root Directory**
   - Ensure root directory is set to `.` (root), not `backend`
   - Check in Vercel dashboard: Settings → General → Root Directory

2. **Build Failed**
   - Check the deployment logs in Vercel dashboard
   - Ensure all dependencies are installed
   - Verify `npx prisma generate` runs successfully

3. **Missing Environment Variables**
   - Verify `DATABASE_URL` is set correctly
   - Check other required environment variables are present

### Database Connection Errors

**Symptom**: API returns 500 errors or "Cannot connect to database"

**Solutions**:
- Verify `DATABASE_URL` is correct and accessible from Vercel
- Ensure database allows connections from Vercel's IP ranges
- Check that migrations have been applied
- Test connection string locally: `npx prisma db pull`

### CORS Errors

**Symptom**: Frontend shows CORS errors when calling API

**Solutions**:
- Add frontend URL to `CORS_ORIGINS` environment variable
- Ensure no trailing slashes in URLs
- Redeploy backend after changing environment variables
- Check browser console for exact CORS error message

### Cold Starts / Slow First Request

**Symptom**: First request takes several seconds

**Explanation**: This is normal for serverless functions. The first request (cold start) needs to:
- Initialize the Node.js runtime
- Import all dependencies
- Bootstrap NestJS application
- Connect to database

**Mitigation**:
- Keep the application "warm" with periodic health checks
- Use Vercel's Edge Functions (if applicable)
- Consider Railway or Render for traditional Node.js hosting

### Module Not Found Errors

**Symptom**: Build fails with "Cannot find module" errors

**Solutions**:
- Ensure all dependencies are in `/package.json` (root level)
- Run `npm install` in root directory locally to verify
- Check that `backend/src` files can be imported from `api/index.ts`
- Verify `tsconfig.json` paths are correct

## Performance Considerations

### Serverless Limitations

Vercel serverless functions have limitations:
- **Execution Time**: Max 60 seconds (Pro plan) or 10 seconds (Hobby)
- **Memory**: Up to 3GB (Pro plan) or 1GB (Hobby)
- **Cold Starts**: 1-5 seconds on first request

### When to Use Alternative Hosting

Consider **Railway**, **Render**, or **Fly.io** if you need:
- Long-running background jobs
- WebSocket connections
- Consistent response times (no cold starts)
- Traditional Node.js hosting environment

See `DEPLOYMENT.md` for Railway deployment instructions.

## Frontend Configuration

The frontend needs to know the backend URL. Set this in Vercel:

**Frontend Environment Variables:**
```
VITE_API_URL=https://pos-buzz.vercel.app
```

Where `https://pos-buzz.vercel.app` is your backend deployment URL.

## Continuous Deployment

Vercel automatically deploys:
- **Production**: On push to `main` branch → `https://pos-buzz.vercel.app`
- **Preview**: On pull requests → `https://pos-buzz-git-pr-123.vercel.app`

## Security Best Practices

1. **Use Strong JWT Secret**: Minimum 32 characters, randomly generated
2. **Restrict CORS**: Only allow your frontend URLs, not `*`
3. **Environment Variables**: Never commit secrets to Git
4. **Database Access**: Use SSL connections, restrict IP access
5. **Rate Limiting**: Consider adding rate limiting middleware

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)

## Example Production Setup

**Backend Vercel Project:**
- Name: `pos-buzz`
- URL: `https://pos-buzz.vercel.app`
- Root Directory: `.`
- Environment Variables: All set ✓

**Frontend Vercel Project:**
- Name: `pos-buzz-frontend`
- URL: `https://pos-buzz-frontend.vercel.app`
- Root Directory: `frontend`
- Environment Variables: `VITE_API_URL=https://pos-buzz.vercel.app`

**Database:**
- Provider: Neon PostgreSQL (or Supabase)
- Migrations: Applied ✓
- Connection: SSL enabled ✓

## Notes

- This setup uses Vercel Serverless Functions, which is different from traditional Node.js hosting
- The NestJS app is bootstrapped on each cold start but cached for subsequent requests
- All backend code in `backend/src` is included in the serverless function
- Prisma client is generated during the build process
