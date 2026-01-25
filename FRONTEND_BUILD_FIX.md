# Frontend Build Error Fix

## Issue
Frontend deployment on Vercel was failing with:
```
npm error code ENOENT
npm error syscall open
npm error path /vercel/path0/frontend/package.json
npm error errno -2
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
```

## Root Cause
The root `.vercelignore` file was excluding the entire `frontend/` directory:
```
# Frontend files (not needed for backend deployment)
frontend/
```

This exclusion was intended to optimize backend deployments, but it also prevented frontend deployments from working because Vercel couldn't access the `frontend/package.json` file.

## Solution
1. **Removed `frontend/` exclusion from root `.vercelignore`**
   - The root `.vercelignore` now only excludes files that should be excluded from both backend and frontend deployments (docs, tests, etc.)

2. **Created `frontend/.vercelignore`**
   - Added a frontend-specific `.vercelignore` file to exclude backend files when deploying the frontend
   - Excludes: `../backend/`, `../api/`, root-level backend files

## How It Works Now

### Backend Deployment (Root Directory: `.`)
- Uses root `.vercelignore` to exclude documentation, tests, and development files
- Includes backend code and serverless handler
- Frontend files are included but not used by the backend deployment

### Frontend Deployment (Root Directory: `frontend`)
- Uses both root `.vercelignore` and `frontend/.vercelignore`
- Frontend-specific exclusions take precedence for files inside the `frontend/` directory
- Excludes backend files to optimize deployment size

## Testing
To verify the fix works:

### Frontend Deployment
1. Create a new Vercel project
2. Set root directory to `frontend`
3. Framework preset: Vite
4. Deploy

Expected: Build should succeed and find `package.json` correctly.

### Backend Deployment
1. Create a separate Vercel project
2. Set root directory to `.` (root)
3. Framework preset: Other
4. Deploy

Expected: Build should succeed using the serverless handler.

## Files Changed
- `.vercelignore` - Removed `frontend/` exclusion
- `frontend/.vercelignore` (new) - Added frontend-specific exclusions

## Commit
Fixed in commit: `4f7a9c1`

---

**Status:** ✅ Resolved
**Date:** 2026-01-25
