# ALP Backend API

Backend API untuk aplikasi ALP menggunakan Node.js, Express, TypeScript, dan Prisma.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT
- **File Upload**: Multer

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev

# Seed database (optional)
npm run seed

# Run development server
npm run dev
```

## 🌐 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/alp_backend"
PORT=3000
JWT_SECRET_KEY="your-secret-key"
NODE_ENV="development"
```

## 🏗️ Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── controller/     # Request handlers
├── service/        # Business logic
├── model/          # Type definitions
├── routes/         # API routes
├── middleware/     # Express middleware
├── validation/     # Zod schemas
└── util/           # Helper functions

prisma/
├── schema.prisma   # Database schema
└── migrations/     # Database migrations

public/
└── uploads/        # Uploaded files
    ├── tokos/      # Toko images
    └── products/   # Product images
```

## 📡 API Endpoints

### Public Routes
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Private Routes (Auth Required)
- `GET /api/tokos` - Get all tokos
- `POST /api/tokos` - Create toko
- `PUT /api/tokos/:id` - Update toko
- `DELETE /api/tokos/:id` - Delete toko

- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

(See full API documentation for more endpoints)

## 🔐 Authentication

Include JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🧪 Development

```bash
# Run development server with auto-reload
npm run dev

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

## 📝 License

MIT

## 👤 Author

Jeruk-Kurej
