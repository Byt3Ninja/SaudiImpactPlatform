# Saudi Impact Platform

## Overview

The Saudi Impact Platform is a web application designed to track and showcase social and environmental impact projects across Saudi Arabia. It serves institutional users, researchers, and the general public by providing transparent access to information about development projects, organizations, and investment opportunities. The platform emphasizes data credibility, clear information hierarchy, and regional identity while maintaining professional standards suitable for governmental and institutional use.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React with TypeScript
- **Routing:** Wouter (lightweight client-side routing)
- **State Management:** TanStack Query (React Query) for server state management
- **UI Framework:** Shadcn/ui components built on Radix UI primitives
- **Styling:** Tailwind CSS with custom design tokens

**Design System:**
The application follows Material Design 3 principles with inspiration from Linear, Stripe, and Mapbox. The design emphasizes data transparency and institutional trust through:
- Typography hierarchy using Inter (primary) and Playfair Display (headlines)
- Consistent spacing primitives (Tailwind units)
- Responsive grid layouts (3-column desktop, 2-column tablet, single mobile)
- Custom color system with HSL values supporting light/dark themes

**Key Pages:**
- Home: Hero section with featured projects and statistics
- Projects: Filterable listing with category, region, status, and SDG filters
- Project Detail: Individual project information with impact metrics
- Organizations: Directory of entities driving development
- Organization Detail: Organization profile with associated projects
- Opportunities: Investment opportunities seeking funding
- Dashboard: Analytics and visualizations using Recharts
- Map: Geographic visualization of projects across Saudi Arabia

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with Express.js
- **Language:** TypeScript with ES modules
- **ORM:** Drizzle ORM for type-safe database interactions
- **Database:** PostgreSQL (configured via Neon serverless driver)
- **Session Management:** Express sessions with connect-pg-simple for PostgreSQL-backed sessions

**API Design:**
RESTful API endpoints following resource-based patterns:
- `/api/stats` - Platform statistics aggregation
- `/api/projects` - CRUD operations for projects with optional organization filtering
- `/api/projects/featured` - Curated featured projects
- `/api/projects/:id` - Individual project retrieval
- `/api/opportunities` - Projects seeking investment
- `/api/organizations` - Organization directory operations
- `/api/organizations/:id` - Individual organization retrieval

**Data Layer:**
The storage abstraction (IStorage interface) enables flexible implementation:
- Current: In-memory storage with seeded sample data (MemStorage)
- Production-ready: Database implementation using Drizzle ORM
- Schema validation using Zod with drizzle-zod integration

**Development Architecture:**
- Vite for frontend build and HMR (Hot Module Replacement)
- Development middleware mode for integrated dev server
- Custom logging middleware for API request tracking
- Error boundary overlay in development (Replit-specific plugins)

### Data Models

**Projects Schema:**
Core entity representing impact initiatives with fields for:
- Identification and basic info (id, title, description, category, status)
- Geographic data (region, latitude, longitude)
- Organizational relationship (organizationId)
- Funding information (fundingGoal, fundingCurrent, seekingInvestment)
- Impact tracking (sdgGoals array, impactMetrics JSON)
- Media (imageUrl)

**Organizations Schema:**
Entities driving development projects with:
- Basic information (id, name, type, description)
- Contact details (website, contactEmail)
- Regional data (region)
- Branding (logoUrl)

**Relationships:**
One-to-many relationship between Organizations and Projects via organizationId foreign key.

**Data Validation:**
- Schema definitions using Drizzle ORM with PostgreSQL types
- Insert schemas generated via drizzle-zod for runtime validation
- Type inference for TypeScript type safety

### Configuration and Build

**Build Process:**
- Frontend: Vite builds React application to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js`
- TypeScript compilation with strict mode and path aliases
- Platform: Node.js with ESM module system

**Environment Configuration:**
- DATABASE_URL required for PostgreSQL connection
- Development vs. production mode differentiation
- Replit-specific integrations (cartographer, dev banner) conditionally loaded

**Path Aliases:**
- `@/` - Frontend source directory
- `@shared/` - Shared code between frontend and backend
- `@assets/` - Static assets directory

## External Dependencies

### Core Framework Dependencies
- **React 18+** - Frontend UI library
- **Express.js** - Backend web framework
- **TypeScript** - Type-safe JavaScript

### Database and ORM
- **Drizzle ORM** - Type-safe ORM for PostgreSQL
- **@neondatabase/serverless** - PostgreSQL driver optimized for serverless
- **drizzle-zod** - Schema-to-Zod validation generator
- **connect-pg-simple** - PostgreSQL session store for Express

### UI Component Library
- **Radix UI** - Headless UI primitives (20+ component packages including dialog, dropdown, select, tooltip, etc.)
- **Shadcn/ui** - Pre-styled components built on Radix
- **class-variance-authority** - Component variant styling utility
- **cmdk** - Command palette component
- **embla-carousel-react** - Carousel/slider component

### State Management and Data Fetching
- **@tanstack/react-query** - Server state management and caching
- **react-hook-form** - Form state management
- **@hookform/resolvers** - Form validation resolvers

### Styling and Design
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS with Autoprefixer** - CSS processing
- **Lucide React** - Icon library
- **Recharts** - Data visualization and charting library

### Routing and Navigation
- **Wouter** - Lightweight client-side routing

### Development Tools
- **Vite** - Build tool and dev server
- **esbuild** - Fast JavaScript bundler for production
- **tsx** - TypeScript execution for development
- **@replit/vite-plugin-runtime-error-modal** - Error overlay
- **@replit/vite-plugin-cartographer** - Replit-specific dev tooling
- **@replit/vite-plugin-dev-banner** - Development environment banner

### Utilities
- **date-fns** - Date manipulation library
- **clsx & tailwind-merge** - Conditional className utilities
- **nanoid** - Unique ID generation
- **zod** - Schema validation

### Fonts
- **Google Fonts:** Inter (sans-serif) and Playfair Display (serif) loaded via CDN

### Development Patterns
The platform does not currently implement authentication but has session infrastructure in place. The architecture supports future additions of user authentication, real-time updates, and enhanced geographic features.