# Saudi Impact Platform 🇸🇦

A comprehensive web platform tracking social and environmental impact projects across Saudi Arabia, connecting government entities, NGOs, investors, and citizens to drive sustainable development aligned with Vision 2030.

![Platform Overview](https://img.shields.io/badge/Platform-Production%20Ready-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Supported-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### Core Capabilities
- 📊 **Project Tracking**: Browse and filter 100+ impact projects across Saudi Arabia
- 🏢 **Organization Directory**: 91 verified Saudi organizations driving development
- 💰 **Investment Opportunities**: Discover projects seeking funding and support
- 🗺️ **Interactive Map**: OpenStreetMap integration with real-time project visualization
- 📈 **Analytics Dashboard**: Comprehensive statistics and impact metrics
- 👥 **User Submissions**: Authenticated users can submit organizations for review
- 🔐 **Admin Panel**: Full CRUD management for organizations, projects, and reference data

### Technical Features
- 🌐 **Bilingual Support**: English and Arabic (EN/AR) with RTL layout
- 🔒 **Secure Authentication**: Internal email/password system with bcrypt hashing
- 📱 **Responsive Design**: Material Design 3 principles, mobile-first approach
- 🎨 **Modern UI**: Shadcn/ui components with Tailwind CSS
- 🚀 **Production Ready**: Docker containerization with PostgreSQL
- 🔄 **Real-time Updates**: WebSocket support for live data synchronization
- 🎯 **SDG Alignment**: All projects mapped to UN Sustainable Development Goals

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop/))
- 2GB+ RAM, 5GB+ disk space

### 1. Clone & Configure
```bash
git clone <your-repo-url>
cd saudi-impact-platform
cp .env.example .env
```

### 2. Set Environment Variables
Edit `.env`:
```env
SESSION_SECRET=your_generated_session_secret_here  # openssl rand -base64 32
ADMIN_PASSWORD=your_secure_admin_password
PGPASSWORD=your_secure_postgres_password
DATABASE_URL=postgresql://postgres:your_secure_postgres_password@postgres:5432/saudi_impact
```

### 3. Deploy
```bash
docker-compose up -d
sleep 30  # Wait for database initialization
docker-compose --profile migration up db-migrate
docker-compose --profile seeding up db-seed
```

### 4. Access
- 🌐 **Application**: http://localhost:5000
- 🔧 **Admin Panel**: http://localhost:5000/admin

📖 **Full deployment guide**: See [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)

## 📊 Database Schema

### Core Tables
- **Organizations**: 91 Saudi entities (government, NGOs, private sector, social enterprises)
- **Projects**: Impact initiatives with SDG mapping and geolocation
- **Users**: Email/password authentication with role-based access
- **Submissions**: User-submitted organizations awaiting approval

### Reference Data
- **Regions**: 13 Saudi administrative regions
- **Organization Types**: 10 categories (Government, Non-Profit, Private Sector, etc.)
- **Organization Subtypes**: 10 specialized categories (VC, Impact Investor, Accelerator, etc.)
- **Services**: 15 support services (Funding, Mentorship, Training, etc.)

## 🏗️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query v5)
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom design system
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React + React Icons
- **Charts**: Recharts for analytics visualization

### Backend
- **Runtime**: Node.js 20+ with Express.js
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL 16 (via Neon serverless driver)
- **ORM**: Drizzle ORM with type-safe queries
- **Authentication**: Internal email/password with bcrypt
- **Sessions**: PostgreSQL-backed sessions (connect-pg-simple)
- **Validation**: Zod with drizzle-zod integration

### DevOps
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose
- **Build Tool**: Vite (frontend) + esbuild (backend)
- **Database Migrations**: Drizzle Kit

## 📁 Project Structure

```
saudi-impact-platform/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components (Home, Projects, Organizations, etc.)
│   │   ├── components/    # Reusable UI components (Shadcn/ui)
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Backend Express application
│   ├── index.ts          # Express server entry point
│   ├── routes.ts         # API route definitions
│   ├── auth.ts           # Authentication logic
│   ├── storage.ts        # Storage interface
│   ├── db-storage.ts     # PostgreSQL storage implementation
│   ├── seed-all.ts       # Comprehensive database seeding
│   ├── seed-reference-data.ts  # Reference data seeding
│   └── seed.ts           # Organizations and projects seeding
├── shared/               # Shared types and schemas
│   └── schema.ts         # Drizzle schema definitions
├── attached_assets/      # Static assets and images
├── Dockerfile            # Production Docker image
├── docker-compose.yml    # Production orchestration
├── Dockerfile.dev        # Development Docker image
├── docker-compose.dev.yml # Development orchestration
├── .env.example          # Environment template
└── drizzle.config.ts     # Drizzle ORM configuration
```

## 🔧 Development

### Local Development (without Docker)

```bash
# Install dependencies
npm install

# Set up environment
cp .env.development.example .env

# Push database schema
npm run db:push

# Seed database
tsx server/seed-all.ts

# Start development server
npm run dev
```

### Local Development (with Docker)

```bash
cp .env.development.example .env
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml logs -f app
```

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run check            # TypeScript type checking
npm run db:push          # Push schema changes to database
```

### Seed Scripts

```bash
# Reference data only (regions, types, services)
tsx server/seed-reference-data.ts

# Organizations and projects
tsx server/seed.ts

# Everything (recommended)
tsx server/seed-all.ts
```

## 🔐 Authentication

### User Authentication
- Email/password registration with validation
- Bcrypt password hashing (10 rounds)
- Session-based authentication
- Email normalization (lowercase, trimmed)
- Protected routes for authenticated users

### Admin Authentication
- Separate admin panel access via `ADMIN_PASSWORD` environment variable
- CRUD operations for all entities
- User-submitted organization approval workflow
- Reference data management

### API Endpoints
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - End session
- `GET /api/auth/user` - Get current user
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/session` - Check admin session

## 🗺️ Map Integration

### OpenStreetMap Features
- Interactive markers for all geolocated projects
- Category-based marker colors
- Secure popup content with XSS protection
- Real-time updates via WebSocket
- Custom Leaflet implementation
- Mobile-responsive map controls

## 📈 Analytics & Reporting

### Platform Statistics
- Total projects tracked
- Active vs. completed projects
- Total funding raised
- Organizations by type and region
- SDG goal distribution
- Impact metrics aggregation

## 🌐 Deployment

### Production Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment guide.

### Supported Platforms
- ✅ AWS (ECS/Fargate + RDS)
- ✅ Google Cloud (Cloud Run + Cloud SQL)
- ✅ Azure (Container Instances + Azure Database)
- ✅ DigitalOcean (App Platform)
- ✅ Railway
- ✅ Render
- ✅ Fly.io

### Security Checklist
- [ ] Strong `SESSION_SECRET` (32+ characters)
- [ ] Secure `ADMIN_PASSWORD`
- [ ] SSL/TLS enabled
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Regular backups enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Saudi Arabia's impact ecosystem
- Aligned with Vision 2030 goals
- Supports UN Sustainable Development Goals (SDGs)
- Real dataset of 91 Saudi organizations
- Inspired by successful impact platforms globally

## 📧 Support

For issues, questions, or feedback:
- Open a GitHub issue
- Contact the development team
- Review the [DEPLOYMENT.md](DEPLOYMENT.md) guide

---

**Made with ❤️ for Saudi Arabia's sustainable future**
