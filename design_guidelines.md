# Saudi Impact Platform - Design Guidelines

## Design Approach

**Selected Framework:** Design System Approach with Material Design 3 principles, drawing additional inspiration from Linear (for dashboard clarity), Stripe (for data presentation), and Mapbox (for geographic visualization).

**Rationale:** This platform serves institutional users requiring data credibility, clear information hierarchy, and efficient navigation through complex datasets. The design must balance professional authority with visual engagement to attract diverse stakeholders from government entities to investors.

## Core Design Principles

1. **Data Transparency:** Information presented clearly with strong visual hierarchy
2. **Institutional Trust:** Professional, polished aesthetic conveying credibility
3. **Regional Identity:** Subtle incorporation of Saudi cultural elements without stereotyping
4. **Stakeholder Accessibility:** Serves both data-focused researchers and visual-focused public users

## Typography System

**Primary Font:** Inter (Google Fonts) - clean, professional, excellent for data-heavy interfaces
**Secondary Font:** Playfair Display (for hero headlines and featured project titles) - adds sophistication

**Hierarchy:**
- Hero Headlines: 4xl to 6xl, Playfair Display, font-semibold
- Page Titles: 3xl to 4xl, Inter, font-bold
- Section Headers: 2xl to 3xl, Inter, font-semibold
- Card Titles: xl to 2xl, Inter, font-medium
- Body Text: base to lg, Inter, font-normal
- Captions/Metadata: sm to base, Inter, font-normal
- Data Labels: xs to sm, Inter, font-medium (uppercase with letter-spacing)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm

**Container Strategy:**
- Full-width: Dashboard and map sections (w-full)
- Standard content: max-w-7xl for most content sections
- Reading content: max-w-4xl for long-form text
- Data cards: max-w-6xl with grid layouts

**Grid Patterns:**
- Project Cards: 3-column desktop (lg:grid-cols-3), 2-column tablet (md:grid-cols-2), single mobile
- Statistics: 4-column desktop (lg:grid-cols-4) for key metrics
- Organization Directory: 2-3 columns with larger cards
- Investment Opportunities: 2-column split layout

## Component Library

### Navigation
- **Header:** Full-width sticky navigation with platform logo, primary navigation links (Projects, Organizations, Opportunities, Impact Dashboard, Map), search bar, and language toggle (EN/AR ready). Height: h-16 to h-20
- **Secondary Nav:** Tab-style filters below hero on listing pages

### Hero Sections
- **Homepage Hero:** Full-width, height 60vh to 80vh with impactful hero image showing Saudi development projects (modern infrastructure, renewable energy, or community initiatives). Centered headline with subtitle, dual CTAs ("Explore Projects" and "Investment Opportunities"). Overlay content with backdrop-blur for buttons.
- **Interior Pages:** Shorter hero (40vh) with breadcrumb navigation and page title

### Data Visualization
- **Dashboard Cards:** Elevated cards (shadow-md) with stat displays, using large numbers (4xl-5xl font), labels, and trend indicators
- **Charts:** Clean, minimal chart designs using established charting libraries
- **Metric Badges:** Pill-shaped indicators for project status, SDG tags, funding levels

### Project Components
- **Project Cards:** Vertical cards with 16:9 aspect ratio images, category badge overlay, title, organization name, location, impact metrics (compact stat row), and progress indicator. Shadow-sm elevation with hover:shadow-lg transition.
- **Project Detail View:** Hero image, comprehensive metadata sidebar, impact metrics dashboard, timeline visualization, photo gallery, and related projects

### Map Interface
- **Interactive Map:** Full-screen capable map view with custom markers clustered by region. Side panel for filters (project type, SDG, status, region). Selected project shows info card overlay on map.
- **Map Markers:** Color-coded by project category with count badges for clusters

### Investment Opportunities
- **Opportunity Cards:** Horizontal layout with project thumbnail, funding goal progress bar, key details (sector, location, SDG alignment), and "Learn More" CTA
- **Filtering Sidebar:** Sticky sidebar with multi-select filters for sector, funding range, region, SDG goals

### Forms & Inputs
- **Search:** Prominent search bar with autocomplete, recent searches, and filter chips
- **Filters:** Checkbox groups, range sliders for funding amounts, dropdown selects for categories
- **Organization Profile Forms:** Structured multi-step layouts with clear section divisions

## Images Strategy

**Hero Images:** 
- Homepage: Large hero image (1920x1080 minimum) showing Saudi development/sustainability projects - modern architecture, renewable energy installations, or community development. Position: center-center with subtle parallax on scroll.
- Project Pages: Project-specific images showcasing real impact

**Content Images:**
- Project Cards: 16:9 ratio thumbnails (400x225px minimum)
- Organization Logos: Square format with consistent sizing (80x80px in directory)
- Gallery Images: Varied aspect ratios supported in project detail grids
- Map Markers: Icon-based, no photographic content

**Image Treatment:** All images have subtle overlay gradients when text appears on top. Cards use object-cover for consistent cropping.

## Special Features

**Bilingual Readiness:** RTL-compatible layouts, text-align utilities prepared for Arabic toggle, consistent spacing in both directions

**Accessibility:** WCAG AA compliant contrast ratios, keyboard navigation for all interactive maps and filters, screen reader optimized chart data tables

**Responsive Breakpoints:**
- Mobile: Full single-column layouts, collapsible filters
- Tablet (md): 2-column grids, persistent filter sidebar
- Desktop (lg+): 3-4 column grids, multi-panel layouts for dashboard

**Animations:** Minimal and purposeful - smooth page transitions (200-300ms), card hover lifts, chart loading animations only. Map interactions are instant.

## Page-Specific Layouts

**Homepage:** Hero + Featured Stats (4-col) + Project Highlights (3-col grid) + Interactive Map Preview + Investment Opportunities (2-col) + Partner Organizations Logos + Newsletter Signup

**Project Listing:** Search/Filter Hero + Stat Overview + Grid of Project Cards with Load More

**Dashboard:** Metrics Overview (4-col stats) + Chart Grid (2x2) + Regional Breakdown Table + Recent Activity Feed

**Map View:** Full-screen map with overlay filter panel and floating project cards

This design creates a professional, data-forward platform that builds institutional trust while remaining visually engaging for public stakeholders.