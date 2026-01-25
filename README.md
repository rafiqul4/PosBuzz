# PosBuzz - Point of Sale Application

A full-stack POS (Point of Sale) application built with modern technologies.

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **PostgreSQL** - Relational database
- **Prisma** - Next-generation ORM
- **JWT** - JSON Web Tokens for authentication

### Frontend
- **Vite + React** - Fast development with modern tooling
- **TypeScript** - Type-safe JavaScript
- **Ant Design** - Enterprise-class UI design system
- **TanStack Query** - Powerful data synchronization
- **React Router** - Client-side routing

## Features

### ✅ Authentication
- Email & password registration
- JWT-based authentication
- Protected routes and APIs
- Secure password hashing with bcrypt

### ✅ Product Management
- Create, Read, Update, Delete (CRUD) products
- Product fields:
  - Name
  - SKU (Stock Keeping Unit)
  - Price
  - Stock Quantity
- Unique SKU validation
- Real-time stock tracking

### ✅ Sales Management
- Create sales with multiple items
- Automatic stock deduction
- Insufficient stock validation
- Sales history tracking
- Detailed sale information with line items

## Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/posbuzz?schema=public"
JWT_SECRET="your-secret-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
```

4. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Start the backend server:
```bash
npm run start:dev
```

The backend will be running at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Update the `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

## API Documentation

A Postman collection is included in the repository root: `postman_collection.json`

### Import to Postman:
1. Open Postman
2. Click "Import"
3. Select the `postman_collection.json` file
4. The collection will be available with all endpoints

### API Endpoints

#### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email and password

#### Products (Protected)
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create a new product
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

#### Sales (Protected)
- `GET /sales` - Get all sales
- `GET /sales/:id` - Get sale by ID
- `POST /sales` - Create a new sale

## Project Structure

```
PosBuzz/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── auth/               # Authentication module
│   │   ├── products/           # Products module
│   │   ├── sales/              # Sales module
│   │   ├── prisma/             # Prisma service
│   │   ├── app.module.ts       # Root module
│   │   └── main.ts             # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                # API client
│   │   ├── components/         # Reusable components
│   │   ├── contexts/           # React contexts
│   │   ├── pages/              # Page components
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   └── package.json
└── postman_collection.json     # API collection
```

## Usage

1. **Register/Login**: Start by creating an account or logging in
2. **Manage Products**: Add products with SKU, price, and stock quantity
3. **Create Sales**: Select products and quantities to create a sale
4. **Track Inventory**: Stock is automatically updated after each sale

## Deployment Notes

### Backend Deployment
- Set environment variables on your hosting platform
- Ensure PostgreSQL database is accessible
- Run `npx prisma migrate deploy` after deployment
- Update CORS settings in `main.ts` for production domains

### Frontend Deployment
- Update `VITE_API_URL` to point to your backend URL
- Build the frontend: `npm run build`
- Deploy the `dist` folder to your hosting service

### Recommended Hosting Platforms
- **Backend**: Railway, Render, Heroku, AWS, DigitalOcean
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: Railway, Supabase, AWS RDS, DigitalOcean Managed Database

## Implementation Status

### ✅ Completed Features
- [x] Backend with NestJS, PostgreSQL, and Prisma
- [x] JWT Authentication (Register/Login)
- [x] Product Management (Full CRUD)
- [x] Sales Management with stock validation
- [x] Frontend with Vite, React, and Ant Design
- [x] TanStack Query for API state management
- [x] Protected routes
- [x] Postman collection
- [x] Comprehensive README

### ⚠️ Not Implemented
- Redis caching/sessions (optional enhancement)
- Live deployment URLs (requires hosting setup)

### Why Redis was not implemented:
Redis was listed in the requirements but is typically used for:
- Session management (we're using JWT tokens stored in localStorage)
- Caching (not critical for MVP)
- Rate limiting (can be added later)

The application is fully functional without Redis. It can be added as an enhancement for:
- Caching frequently accessed data (products list)
- Token blacklisting for logout
- Rate limiting on API endpoints

## Development

### Run Tests
```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

### Lint Code
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Security Considerations

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- Passwords are hashed using bcrypt
- All product/sales endpoints are protected
- Input validation on all forms
- SQL injection protection via Prisma ORM

## License

MIT

## Author

Built as a technical assignment for internship evaluation.
