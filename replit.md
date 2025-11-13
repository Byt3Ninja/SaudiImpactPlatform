# Saudi Impact Platform

## Overview

The Saudi Impact Platform is a web application designed to track and showcase social and environmental impact projects across Saudi Arabia. It serves institutional users, researchers, and the general public by providing transparent access to information about development projects, organizations, and investment opportunities. The platform emphasizes data credibility, clear information hierarchy, and regional identity while maintaining professional standards suitable for governmental and institutional use.

## Recent Changes

**November 13, 2025 - Real Organization Data Integration Complete**
- Integrated 91 real Saudi organizations from JSON dataset into PostgreSQL database
- Extended organizations schema with new fields: subType, sectorFocus[], sdgFocus[], services[], linkedinUrl, status
- Created robust data transformation utility (server/transform-data.ts) with nil-safe parsing and region mapping
- Updated database seeding workflow with proper error handling and validation
- All e2e tests passed: organizations list (91 orgs), search/filter, organization details, project linking, dashboard stats, map integration
- Architect approved implementation with hardened nil-safe transformations
- Database now contains real ecosystem data: PIF, Misk Foundation, SVC, Impact46, RAED Ventures, Wa'ed, and 85 more

**November 13, 2025 - OpenStreetMap Integration Complete**
- Implemented interactive OpenStreetMap using Leaflet 1.9.4 loaded via CDN
- Added custom colored markers for projects by category (green=Environmental, blue=Social, orange=Infrastructure, etc.)
- Integrated map with existing filters (category, region) with real-time marker updates
- Implemented project selection from sidebar to center map on location
- Fixed XSS security vulnerability in popups by using DOM manipulation with textContent instead of template literals
- All e2e tests passed: map loading, markers, filtering, popups, RTL/Arabic compatibility
- Architect approved implementation after security fix
- No npm dependencies added - uses CDN to avoid React 19 compatibility issues with react-leaflet v5

**November 13, 2025 - MVP Implementation Complete**
- Fixed query key patterns for TanStack Query to properly construct REST URLs
- Simplified queryKey in projects.tsx to use base route ["/api/projects"] for client-side filtering
- Corrected organization-detail.tsx to filter projects client-side instead of passing object in queryKey
- All e2e tests passed successfully across all pages (home, projects, organizations, opportunities, dashboard, map)
- Verified theme toggle functionality (dark/light mode)
- Architect approved final implementation with no critical issues
- Platform ready for demo/presentation with all core features functional

**MVP Status: Complete and Tested**
All user journeys verified working:
✅ Browse and filter projects by region, status, category, and SDG goals
✅ View detailed project information with funding status and impact metrics
✅ Explore organizations and their associated projects
✅ Discover investment opportunities with funding progress visualization
✅ Access analytics dashboard with charts and statistics
✅ View projects on interactive map interface
✅ Toggle between light and dark themes

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
- Map: Interactive OpenStreetMap with project markers, filtering, and real-time updates

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
- Production: Database implementation (DbStorage) using Drizzle ORM with PostgreSQL
- Development: In-memory storage (MemStorage) available as fallback
- Schema validation using Zod with drizzle-zod integration

**Database Seeding:**
The platform uses a manual seeding workflow for explicit control and auditability:

1. **Seed Command:** `npx tsx server/seed.ts`
   - Clears existing organizations and projects
   - Loads 91 real Saudi organizations from JSON via `transform-data.ts`
   - Creates 8 sample projects linked to real organization IDs
   - Validates at least 8 organizations exist before linking projects
   - Proper error handling with try/finally for cleanup

2. **Data Transformation:** Located in `server/transform-data.ts`
   - Reads JSON dataset from `attached_assets/tableConvert.com_57fv6k_1763052164626.json`
   - Maps fields: "Location" → "region", "Sub-Type" → "subType", etc.
   - Normalizes multi-value fields to arrays (sectorFocus, sdgFocus, services)
   - Nil-safe parsing: handles missing/empty values, returns undefined for empty strings
   - Region mapping: converts city names to Saudi regions with fallback logging
   - Warns when location data is missing or unrecognized

3. **Data Validation:**
   - Ensures all required fields are present
   - Validates array fields contain non-empty values
   - Logs warnings for missing location data
   - Throws error if insufficient organizations for sample projects

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
- Extended classification (subType, status)
- Contact details (website, contactEmail, linkedinUrl)
- Regional data (region)
- Impact focus (sectorFocus array, sdgFocus array)
- Services offered (services array)
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

### Map Integration
- **Leaflet 1.9.4** - Interactive mapping library loaded via CDN (no npm dependency)
- **OpenStreetMap Tiles** - Free, open-source map tiles from openstreetmap.org
- **Custom Implementation:** Located at `client/src/components/OpenStreetMap.tsx`
- **Features:**
  - Category-based marker colors (Environmental=green, Social=blue, Infrastructure=orange, Healthcare=red, Education=purple, Economic=cyan)
  - Interactive popups with project details (secure DOM rendering via textContent)
  - Auto-fit bounds to display all filtered projects
  - Real-time marker updates based on category/region filters
  - Project selection from sidebar centers map on location
  - RTL/Arabic language compatibility
- **Security:** Popups use DOM manipulation with textContent to prevent XSS attacks from project data
- **Technical Choice:** CDN-based Leaflet instead of react-leaflet to avoid React 19 dependency conflicts

### Development Patterns
The platform does not currently implement authentication but has session infrastructure in place. The architecture supports future additions of user authentication, real-time updates, and enhanced geographic features (marker clustering, dark mode tiles).