# 🌱 Sustainable Tourism Platform

A comprehensive sustainable tourism platform built with Next.js 15, featuring role-based authentication, Prisma ORM, and modern UI components.

## 🚀 Features

- **Role-based Authentication** with NextAuth.js

  - USER: Regular travelers
  - SERVICE_PROVIDER: Tourism service providers
  - ADMIN: Platform administrators
  - SUPERADMIN: System administrators

- **Authentication Providers**

  - Credentials (email/password)
  - Google OAuth

- **Modern Tech Stack**
  - Next.js 15 with App Router
  - TypeScript
  - Tailwind CSS
  - Framer Motion for animations
  - shadcn/ui components
  - Prisma ORM
  - PostgreSQL database
  - Docker for development

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- Yarn package manager
- Docker and Docker Compose

### 1. Install Dependencies

```bash
yarn install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sustainable_tourism?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Mapbox Configuration (for location fields)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="your-mapbox-access-token"

# WhatsApp Configuration (for booking contact)
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
```

### 3. Start Database Services

```bash
# Start PostgreSQL and pgAdmin with Docker
docker-compose up -d
```

This will start:

- PostgreSQL on port 5432
- pgAdmin on port 5050 (admin@sustainable-tourism.com / admin)

### 4. Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 6. Mapbox Setup (Optional)

To enable location search functionality:

1. Sign up for a free Mapbox account at [mapbox.com](https://mapbox.com)
2. Get your access token from the Mapbox dashboard
3. Add it to your `.env` file:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="your-mapbox-access-token"
```

### 7. WhatsApp Setup (Optional)

To enable WhatsApp booking functionality:

1. Get your WhatsApp business number (with country code, no + sign)
2. Add it to your `.env` file:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
```

## 🏗️ Project Structure

```
├── app/
│   ├── api/auth/          # NextAuth.js API routes
│   ├── auth/              # Authentication pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── providers/         # React context providers
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
├── types/
│   └── next-auth.d.ts    # NextAuth type definitions
└── docker-compose.yml    # Docker services
```

## 🔐 Authentication System

### User Roles

- **USER**: Regular travelers who can browse and book services
- **SERVICE_PROVIDER**: Tourism businesses offering sustainable services
- **ADMIN**: Platform moderators with management capabilities
- **SUPERADMIN**: Full system access and user management

### Authentication Flow

1. Users can sign up with email/password or Google OAuth
2. Role is assigned during registration
3. Session management handled by NextAuth.js
4. Protected routes based on user roles

## 🎨 UI Components

The project uses shadcn/ui components with Tailwind CSS:

- Responsive design
- Dark/light mode support
- Framer Motion animations
- Accessible components

## 🗄️ Database Schema

The Prisma schema includes:

- **User model** with role-based fields
- **Account/Session models** for NextAuth.js
- **Tourism-specific fields** for service providers
- **Role-based permissions**

## 🐳 Docker Services

- **PostgreSQL**: Database server
- **pgAdmin**: Database administration interface

Access pgAdmin at http://localhost:5050

## 📝 Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
```

## 🔧 Development

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Deploy migrations
npx prisma migrate deploy
```

### Adding New Components

```bash
# Add shadcn/ui components
npx shadcn@latest add [component-name]
```

## 🚀 Deployment

1. Set up environment variables in production
2. Run database migrations
3. Build and deploy the application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
