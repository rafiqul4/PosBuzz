# PosBuzz - POS Application

A full-stack Point of Sale (POS) application built with NestJS, PostgreSQL, Prisma, Redis, React, Ant Design, and TanStack Query.

## 🚀 Features

### Authentication
- ✅ Email & password-based authentication
- ✅ JWT token authentication
- ✅ Protected routes and APIs

### Product Management
- ✅ Create, Read, Update, Delete (CRUD) products
- ✅ Product fields: name, SKU, price, stock_quantity
- ✅ SKU uniqueness validation

### Sales Management
- ✅ Create sales with multiple products
- ✅ Automatic stock deduction
- ✅ Insufficient stock validation
- ✅ Sales history with detailed item breakdown

## 🛠 Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **PostgreSQL** - Relational database
- **Prisma** - Modern database ORM
- **Redis** - Caching (configured but not actively used in this version)
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

### Frontend
- **Vite + React** - Fast development experience
- **TypeScript** - Type-safe development
- **Ant Design** - Professional UI components
- **TanStack Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Axios** - HTTP client

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Redis (v7 or higher)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/rafiqul4/PosBuzz.git
cd PosBuzz
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/posbuzz?schema=public"
# JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Generate Prisma client
npx prisma generate

# Run migrations to create database schema
npx prisma migrate dev --name init

# Start the backend server
npm run start:dev
```

The backend server will start on `http://localhost:3000`

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file if backend URL is different
# VITE_API_URL=http://localhost:3000

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Using Docker Compose (Optional)

Start PostgreSQL and Redis using Docker Compose:

```bash
# From the root directory
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379

## 📖 API Documentation

### Postman Collection

Import the `PosBuzz.postman_collection.json` file into Postman to test all API endpoints.

### Authentication Endpoints

#### Register
```
POST /auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```
POST /auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
Response: {
  "access_token": "jwt-token",
  "user": { ... }
}
```

#### Get Profile
```
GET /auth/profile
Headers: Authorization: Bearer {access_token}
```

### Product Endpoints

All product endpoints require authentication.

#### List Products
```
GET /products
Headers: Authorization: Bearer {access_token}
```

#### Get Product
```
GET /products/:id
Headers: Authorization: Bearer {access_token}
```

#### Create Product
```
POST /products
Headers: Authorization: Bearer {access_token}
Body: {
  "name": "Laptop",
  "sku": "LAP-001",
  "price": 999.99,
  "stock_quantity": 50
}
```

#### Update Product
```
PATCH /products/:id
Headers: Authorization: Bearer {access_token}
Body: {
  "price": 899.99,
  "stock_quantity": 45
}
```

#### Delete Product
```
DELETE /products/:id
Headers: Authorization: Bearer {access_token}
```

### Sales Endpoints

All sales endpoints require authentication.

#### List Sales
```
GET /sales
Headers: Authorization: Bearer {access_token}
```

#### Get Sale
```
GET /sales/:id
Headers: Authorization: Bearer {access_token}
```

#### Create Sale
```
POST /sales
Headers: Authorization: Bearer {access_token}
Body: {
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

## 🎯 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Manage Products**: Add products with SKU, price, and stock quantity
3. **Create Sales**: Select products and quantities to create sales
4. **View Sales History**: Track all sales with detailed item breakdowns

## 🏗 Project Structure

```
PosBuzz/
├── backend/                 # NestJS backend
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── products/       # Products module
│   │   ├── sales/          # Sales module
│   │   └── prisma/         # Prisma service
│   └── .env.example
├── frontend/               # React frontend
│   ├── src/
│   │   ├── api/           # API client and services
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── .env.example
├── docker-compose.yml      # Docker services configuration
└── PosBuzz.postman_collection.json
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation with class-validator
- CORS configuration
- SQL injection prevention via Prisma

## 📝 Development Notes

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

### Building for Production

#### Backend
```bash
cd backend
npm run build
npm run start:prod
```

#### Frontend
```bash
cd frontend
npm run build
# Output will be in the 'dist' directory
```

## 🚀 Deployment

### Backend Deployment Checklist
- [ ] Set secure JWT_SECRET
- [ ] Configure production database URL
- [ ] Set NODE_ENV to "production"
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain

### Frontend Deployment Checklist
- [ ] Update VITE_API_URL to production backend URL
- [ ] Build production bundle: `npm run build`
- [ ] Deploy dist folder to static hosting (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**rafiqul4**

## 🙏 Acknowledgments

- NestJS documentation
- Prisma documentation
- Ant Design component library
- React and Vite communities