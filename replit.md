# Saudi Impact Platform

## Overview

The Saudi Impact Platform is a web application designed to track and showcase social and environmental impact projects across Saudi Arabia. It provides transparent access to information about development projects, organizations, and investment opportunities for institutional users, researchers, and the general public. The platform emphasizes data credibility, clear information hierarchy, and regional identity, adhering to professional standards for governmental and institutional use. Key capabilities include browsing and filtering projects, viewing detailed project and organization information, discovering investment opportunities, accessing analytics, and interacting with an OpenStreetMap interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:** React with TypeScript, Wouter for routing, TanStack Query for server state, Shadcn/ui (built on Radix UI) for components, and Tailwind CSS for styling.

**Design System:** Adheres to Material Design 3 principles, inspired by Linear, Stripe, and Mapbox, focusing on data transparency and institutional trust. It uses Inter and Playfair Display fonts, consistent spacing, responsive grid layouts, and a custom HSL color system supporting light/dark themes.

**Image Handling:** Professional placeholder images are implemented platform-wide to ensure no broken images ever appear. Two placeholder images are used: one for project cover images (geometric pattern with Saudi green/gold colors) and one for organization logos. All image renders include fallback to default placeholders and error handling that gracefully resets to the placeholder if URLs fail to load. This ensures a polished, professional appearance suitable for governmental and institutional use.

**Key Pages:**
- Home: Hero section with featured projects and statistics
- Projects: Filterable listing with category, region, status, and SDG filters
- Project Detail: Individual project information with impact metrics
- Organizations: Directory of entities driving development
- Organization Detail: Organization profile with associated projects
- Opportunities: Investment opportunities seeking funding
- Dashboard: Analytics and visualizations using Recharts
- Map: Interactive OpenStreetMap with project markers and real-time updates
- Register: User registration with email/password authentication
- Login: User login with email/password authentication
- Submit Organization: Public form for authenticated users to submit organizations for admin approval
- My Submissions: View submission history and status for logged-in users
- Submit Project: Public form for authenticated users to submit their own projects
- My Projects: User dashboard to view and manage their submitted projects

**Admin Panel Pages (accessible via `/admin`):**
- Dashboard: Platform statistics and recent activity
- Projects: Full CRUD management for projects
- Organizations: Full CRUD management for organizations
- Submissions: Review and approve/reject user-submitted organizations
- Regions/Types/Subtypes/Services: Reference data management with Arabic translations

### Backend Architecture

**Technology Stack:** Node.js with Express.js, TypeScript, Drizzle ORM for type-safe database interactions, and PostgreSQL (via Neon serverless driver). Session management uses Express sessions with `connect-pg-simple` backed by PostgreSQL.

**Authentication System:** Internal username/password authentication with bcrypt password hashing. Users can register with email/password and submit organizations for admin approval. Admin access uses a separate ADMIN_PASSWORD environment variable. Session cookies are httpOnly with proper secure flags in production.

**Session Management:** All authentication endpoints (login, register, admin auth) explicitly call `req.session.save()` before sending responses to ensure session data is persisted to PostgreSQL before the client receives the response. This prevents race conditions where sessions might not be saved properly.

**API Design:** RESTful API endpoints including:
- Authentication: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/user`
- Core resources: `/api/stats`, `/api/projects`, `/api/opportunities`, `/api/organizations`
- Submissions: `/api/submissions` (create, list, approve, reject)
- User Projects: `/api/user/projects` (user-scoped endpoint for ownership filtering)
- All endpoints support CRUD operations with proper authorization checks

**Authorization System:** Implements ownership-based access control for projects:
- Projects include a `createdBy` field linking to the user ID of the creator
- Regular users can only create, edit, and delete their own projects
- Admin users can manage all projects regardless of ownership
- The `insertProjectSchema` omits `createdBy` to prevent client tampering
- Server-side code sets `createdBy` from the authenticated session
- Authorization enforced via `isAdmin || isOwner` checks on mutations

**Data Layer:** Utilizes a storage abstraction (IStorage interface) with a PostgreSQL implementation (DbStorage) using Drizzle ORM and a fallback in-memory storage (MemStorage) for development. Schema validation is done using Zod with `drizzle-zod`.

**Database Seeding:** A manual seeding process loads real Saudi organizations and sample projects, performing data transformation, mapping, normalization, and validation from a JSON dataset.

### Data Models

**Projects Schema:** Represents impact initiatives including basic info, geographic data, organizational relationship, funding, impact tracking (SDGs, metrics), media, and ownership tracking via the `createdBy` field (nullable, references user ID).

**Organizations Schema:** Represents entities driving projects with basic information, classification, contact details, regional data, impact focus (sector, SDGs), services, and branding.

**Relationships:** 
- One-to-many: Organizations → Projects (via `organizationId`)
- One-to-many: Users → Projects (via `createdBy`, nullable for admin-created projects)

### Configuration and Build

**Build Process:** Vite builds the frontend to `dist/public`, and esbuild bundles the backend to `dist/index.js`. TypeScript is compiled with strict mode.

**Environment Configuration:** Requires `DATABASE_URL` and differentiates between development and production modes.

## External Dependencies

### Core Framework Dependencies
- **React 18+**
- **Express.js**
- **TypeScript**

### Database and ORM
- **Drizzle ORM**
- **@neondatabase/serverless**
- **drizzle-zod**
- **connect-pg-simple**

### UI Component Library
- **Radix UI** (headless primitives)
- **Shadcn/ui** (pre-styled components)
- **class-variance-authority**
- **cmdk**
- **embla-carousel-react**

### State Management and Data Fetching
- **@tanstack/react-query**
- **react-hook-form**
- **@hookform/resolvers**

### Styling and Design
- **Tailwind CSS**
- **PostCSS with Autoprefixer**
- **Lucide React**
- **Recharts**

### Routing and Navigation
- **Wouter**

### Development Tools
- **Vite**
- **esbuild**
- **tsx**
- **@replit/vite-plugin-runtime-error-modal**
- **@replit/vite-plugin-cartographer**
- **@replit/vite-plugin-dev-banner**

### Utilities
- **date-fns**
- **clsx & tailwind-merge**
- **nanoid**
- **zod**

### Fonts
- **Google Fonts:** Inter, Playfair Display (loaded via CDN)

### Map Integration
- **Leaflet 1.9.4** (loaded via CDN)
- **OpenStreetMap Tiles**
- Custom implementation for interactive maps with category-based markers, secure popups, and real-time updates.