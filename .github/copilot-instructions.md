# PosBuzz - GitHub Copilot Instructions

This document provides guidance for GitHub Copilot when working with the PosBuzz codebase.

## Project Overview

PosBuzz is a full-stack Point of Sale (POS) application demonstrating production-level code quality and modern development practices.

**Project Type**: Full-stack web application (POS system)
**Purpose**: Internship technical assignment / Production-ready POS system

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js framework)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Caching**: Redis (configured)
- **Authentication**: JWT with Passport
- **Password Hashing**: bcrypt
- **Validation**: class-validator, class-transformer

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Library**: Ant Design
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v7
- **HTTP Client**: Axios

## Project Structure

```
PosBuzz/
├── backend/              # NestJS API
│   ├── prisma/          # Database schema and migrations
│   ├── src/
│   │   ├── auth/        # Authentication module (JWT, login, register)
│   │   ├── products/    # Product CRUD operations
│   │   ├── sales/       # Sales management with stock deduction
│   │   └── prisma/      # Prisma service
│   ├── test/            # E2E tests
│   └── vercel.json      # Vercel serverless config (optional)
└── frontend/            # React SPA
    ├── src/
    │   ├── api/         # API client and service layer
    │   ├── components/  # Reusable UI components
    │   ├── contexts/    # React contexts (Auth)
    │   ├── pages/       # Page components
    │   └── utils/       # Utility functions
    └── public/          # Static assets
```

## Core Features

1. **Authentication**
   - Email & password registration and login
   - JWT token-based authentication
   - Protected routes and APIs
   - Password hashing with bcrypt

2. **Product Management**
   - CRUD operations for products
   - Fields: name, sku, price, stock_quantity
   - SKU uniqueness validation
   - Stock tracking

3. **Sales Management**
   - Create sales with multiple products
   - Automatic stock deduction on sale creation
   - Insufficient stock validation and prevention
   - Sales history with detailed item breakdown

## Development Commands

### Backend (in `backend/` directory)

```bash
# Install dependencies
npm install

# Development server (with hot reload)
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Linting
npm run lint

# Format code
npm run format

# Run tests
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e

# Database operations
npx prisma generate          # Generate Prisma client
npx prisma migrate dev       # Create and apply migrations
npx prisma migrate deploy    # Apply migrations in production
npx prisma studio           # Open Prisma Studio GUI
npx prisma migrate reset    # Reset database (deletes all data)
```

### Frontend (in `frontend/` directory)

```bash
# Install dependencies
npm install

# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

## Coding Standards

### General
- **Language**: TypeScript for type safety
- **Code Style**: Use Prettier for formatting
- **Linting**: ESLint configured for both backend and frontend
- **Comments**: Add comments for complex logic, avoid obvious comments

### Backend (NestJS)
- Use **dependency injection** for services
- Follow **module-based architecture** (auth, products, sales modules)
- Use **DTOs** (Data Transfer Objects) for request/response validation
- Use **class-validator** decorators for input validation
- Use **Prisma** for all database operations (no raw SQL)
- Implement **JWT guards** for protected endpoints
- Hash passwords with **bcrypt** before storing
- Handle errors with appropriate HTTP status codes
- Use **async/await** for asynchronous operations

### Frontend (React + TypeScript)
- Use **functional components** with hooks
- Use **TypeScript interfaces** for props and data structures
- Use **Ant Design components** for UI consistency
- Use **TanStack Query** for server state management
- Use **React Context** for global state (auth)
- Use **React Router** for navigation
- Keep **API calls** in the `api/` directory
- Handle loading and error states in UI
- Use **axios interceptors** for auth headers

### Database (Prisma)
- Define models in `backend/prisma/schema.prisma`
- Use migrations for schema changes (`npx prisma migrate dev`)
- Use Prisma relations for referential integrity
- Add indexes for frequently queried fields
- Use `@unique` constraints where appropriate

## Security Best Practices

- **Never commit secrets** (use `.env` files, add to `.gitignore`)
- **Hash passwords** with bcrypt before storing
- **Validate all inputs** using class-validator
- **Use JWT** for stateless authentication
- **Configure CORS** properly in production
- **Use HTTPS** in production
- **Prevent SQL injection** (Prisma handles this)
- **Use environment variables** for sensitive configuration

## Environment Variables

### Backend (`.env`)
```
DATABASE_URL=postgresql://user:pass@host:5432/posbuzz?schema=public
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:3000
```

## API Conventions

- **Base URL**: `http://localhost:3000` (dev) or production URL
- **Authentication**: `Authorization: Bearer <token>` header
- **Response Format**: JSON
- **HTTP Methods**: 
  - GET (retrieve)
  - POST (create)
  - PATCH (partial update)
  - DELETE (remove)

### Key Endpoints
- `POST /auth/register` - Create new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/profile` - Get current user profile
- `GET /products` - List all products
- `POST /products` - Create product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /sales` - List all sales
- `POST /sales` - Create sale (with stock deduction)
- `GET /sales/:id` - Get sale details

## Deployment

### Frontend - Vercel (Recommended)

**Steps**:
1. Connect GitHub repository to Vercel
2. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Set environment variable:
   - `VITE_API_URL` = your backend URL
4. Deploy

**Auto-deployment**: Pushes to `main` branch trigger production deployments

**Frontend URL**: `https://posbuzz.vercel.app` (or your custom domain)

### Backend - Railway (Recommended for NestJS)

**Why Railway**: NestJS works best on platforms with native Node.js support. Vercel is optimized for serverless functions.

**Steps**:
1. Go to [Railway.app](https://railway.app/)
2. Create new project from GitHub repo
3. Add PostgreSQL database (Railway provides this)
4. Set environment variables:
   ```
   DATABASE_URL=<provided by Railway>
   JWT_SECRET=<secure-32+-char-string>
   JWT_EXPIRES_IN=24h
   NODE_ENV=production
   PORT=3000
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```
5. Deploy migrations:
   ```bash
   DATABASE_URL="production-url" npx prisma migrate deploy
   ```

**Auto-deployment**: Pushes to `main` branch trigger production deployments

**Backend URL**: `https://posbuzz-backend.up.railway.app` (Railway provides this)

### Alternative: Backend on Vercel

If deploying backend to Vercel:
1. Set root directory to `backend`
2. Use `vercel.json` for serverless configuration
3. Note: May require adapting app for serverless mode

### Database Options

**Production Database** (choose one):
- **Neon** - Serverless PostgreSQL (Free tier available)
- **Supabase** - PostgreSQL with additional features (Free tier)
- **Railway PostgreSQL** - Built-in database addon (Recommended if using Railway)

### Post-Deployment Checklist
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] CORS configured with correct frontend URL
- [ ] Test authentication flow
- [ ] Test product CRUD operations
- [ ] Test sales creation and stock deduction

## Testing

### Backend Testing
- Unit tests for services and controllers
- E2E tests for API endpoints
- Use Jest testing framework
- Mock database with Prisma test utilities
- Run: `npm run test` or `npm run test:e2e`

### Frontend Testing
- Test user flows (login, product management, sales)
- Manual testing recommended for UI
- Use browser developer tools for debugging

## Common Tasks

### Add a New Feature Module (Backend)
```bash
cd backend
nest generate module feature-name
nest generate controller feature-name
nest generate service feature-name
```

### Add a New Prisma Model
1. Edit `backend/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_feature`
3. Generate client: `npx prisma generate`

### Add a New React Page
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Use Ant Design components for UI
4. Use TanStack Query for data fetching

### Update Dependencies
```bash
# Backend
cd backend && npm update

# Frontend  
cd frontend && npm update
```

## Troubleshooting

### Backend Issues
- **Database connection failed**: Check `DATABASE_URL` in `.env`
- **Prisma client errors**: Run `npx prisma generate`
- **Port already in use**: Change `PORT` in `.env` or kill process on port 3000
- **CORS errors**: Add frontend URL to `CORS_ORIGINS`

### Frontend Issues
- **API calls failing**: Check `VITE_API_URL` in `.env`
- **Blank page**: Check browser console for errors
- **Build errors**: Ensure all dependencies are installed

### Database Issues
- **Migration conflicts**: Run `npx prisma migrate reset` (WARNING: deletes data)
- **Connection timeout**: Check PostgreSQL is running
- **Schema changes not reflected**: Run `npx prisma generate` after migrations

## Additional Resources

- **Postman Collection**: `PosBuzz.postman_collection.json` - Import for API testing
- **Deployment Guide**: `DEPLOYMENT.md` - Detailed deployment instructions
- **Task Requirements**: `task.md` - Original project specifications
- **README**: `README.md` - General project information

## Important Notes

- This is a **demonstration project** showcasing production-level code quality
- **Database**: PostgreSQL is required (use Docker or cloud service)
- **Redis**: Configured but not actively used in current version
- **CORS**: Must be configured properly in production
- **JWT Secret**: Use a strong secret (32+ characters) in production
- **Migrations**: Always backup data before running `prisma migrate reset`

## Support

For questions or issues:
- Check existing documentation (README.md, DEPLOYMENT.md, task.md)
- Review Postman collection for API examples
- Check GitHub issues
- Review NestJS, Prisma, React, and Ant Design documentation
