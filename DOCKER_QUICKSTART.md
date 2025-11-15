# Docker Quick Start Guide - Saudi Impact Platform

## 🚀 Quick Deployment (5 Minutes)

### Prerequisites
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop/))
- Git (for cloning the repository)

### Step 1: Clone and Configure

```bash
# Clone the repository
git clone <your-repo-url>
cd saudi-impact-platform

# Create environment file
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit `.env` and set these **required** variables:

```bash
# Generate a strong session secret (or use: openssl rand -base64 32)
SESSION_SECRET=your_generated_session_secret_here

# Set admin password
ADMIN_PASSWORD=your_secure_admin_password

# Set PostgreSQL password
PGPASSWORD=your_secure_postgres_password

# Update database URL with your postgres password
DATABASE_URL=postgresql://postgres:your_secure_postgres_password@postgres:5432/saudi_impact
```

### Step 3: Start Everything

```bash
# Start the application and database
docker-compose up -d

# Wait 30 seconds for database to initialize
sleep 30

# Run database migrations and seed data
docker-compose --profile migration up db-migrate
docker-compose --profile seeding up db-seed
```

### Step 4: Access Your Application

🎉 **Your application is now running!**

- **Application**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin
  - Username: admin
  - Password: (use `ADMIN_PASSWORD` from your `.env` file)

## 📊 What Gets Seeded

The seed process creates:

### Reference Data (13 Regions, 10 Types, 10 Subtypes, 15 Services)
- ✅ **13 Saudi Regions**: Riyadh, Makkah, Madinah, Eastern Province, Asir, Tabuk, Qassim, Ha'il, Northern Borders, Jazan, Najran, Al-Bahah, Al-Jouf
- ✅ **10 Organization Types**: Government Entity, Non-Profit Organization, Private Sector, Social Enterprise, Foundation, Investment Fund, Development Agency, Research Institute, Educational Institution, Healthcare Provider
- ✅ **10 Organization Subtypes**: Venture Capital, Impact Investor, Accelerator, Incubator, Angel Investor Network, Corporate Foundation, Community Foundation, Grant Making Organization, Microfinance Institution, Development Bank
- ✅ **15 Services**: Funding & Investment, Mentorship & Advisory, Technical Training, Market Access Support, R&D, Networking Events, Workspace, Legal & Compliance, Marketing & PR, Product Development, Business Planning, Financial Management, Technology Infrastructure, Talent Recruitment, Impact Measurement

### Sample Data
- ✅ **91 Real Saudi Organizations** (if JSON file is available)
- ✅ **8 Sample Impact Projects** with real SDG mappings and geolocation

## 🔧 Common Commands

### View Logs
```bash
# All services
docker-compose logs -f

# App only
docker-compose logs -f app

# Database only
docker-compose logs -f postgres
```

### Restart Services
```bash
# Restart everything
docker-compose restart

# Restart app only
docker-compose restart app
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database)
docker-compose down -v
```

### Database Management

```bash
# Backup database
docker exec saudi-impact-db pg_dump -U postgres saudi_impact > backup.sql

# Restore database
docker exec -i saudi-impact-db psql -U postgres saudi_impact < backup.sql

# Access PostgreSQL CLI
docker exec -it saudi-impact-db psql -U postgres -d saudi_impact

# Re-run migrations only
docker-compose --profile migration up db-migrate

# Re-seed database (WARNING: clears existing data)
docker-compose --profile seeding up db-seed
```

### Run Seed Scripts Individually

```bash
# Seed reference data only (regions, types, services)
docker-compose exec app tsx server/seed-reference-data.ts

# Seed organizations and projects only
docker-compose exec app tsx server/seed.ts

# Seed everything (comprehensive)
docker-compose exec app tsx server/seed-all.ts
```

## 🔄 Development Mode

For local development with hot reload:

```bash
# Copy development environment
cp .env.development.example .env

# Start development services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app
```

Changes to your code will automatically reload!

## 🔐 Security Checklist for Production

Before deploying to production:

- [ ] Change all default passwords
- [ ] Generate strong `SESSION_SECRET` (32+ characters)
- [ ] Set secure `ADMIN_PASSWORD`
- [ ] Set secure `PGPASSWORD`
- [ ] Enable SSL/TLS (use nginx/Caddy reverse proxy)
- [ ] Set `TRUST_PROXY=true` if behind reverse proxy
- [ ] Review firewall rules
- [ ] Set up regular database backups
- [ ] Enable monitoring and alerts
- [ ] Review and update CORS settings if needed

## 🐛 Troubleshooting

### Application Won't Start

```bash
# Check logs
docker-compose logs app

# Common issues:
# - Port 5000 already in use: Change PORT in .env
# - Missing environment variables: Check .env file
# - Database not ready: Wait 30 seconds and try again
```

### Database Connection Errors

```bash
# Check database health
docker-compose ps postgres

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Seed Data Not Showing

```bash
# Check if data exists
docker exec -it saudi-impact-db psql -U postgres -d saudi_impact -c "SELECT COUNT(*) FROM regions;"

# Re-seed if needed
docker-compose --profile seeding up db-seed
```

### Port Already in Use

```bash
# Change port in .env
PORT=3000

# Restart
docker-compose down
docker-compose up -d
```

## 📝 Manual Seed Script Execution

If you prefer to run seed scripts manually:

```bash
# Connect to app container
docker-compose exec app sh

# Run individual seed scripts
tsx server/seed-reference-data.ts    # Reference data only
tsx server/seed.ts                   # Organizations and projects
tsx server/seed-all.ts               # Everything (recommended)

# Exit container
exit
```

## 🌐 Deploying to Cloud

### AWS (ECS/Fargate)
1. Push image to ECR
2. Create ECS task definition
3. Set environment variables in task
4. Create RDS PostgreSQL instance
5. Deploy service

### Google Cloud (Cloud Run)
1. Push image to GCR
2. Create Cloud SQL PostgreSQL instance
3. Deploy to Cloud Run with env vars
4. Connect Cloud Run to Cloud SQL

### Azure (Container Instances)
1. Push image to ACR
2. Create Azure Database for PostgreSQL
3. Deploy container instance
4. Configure networking

### DigitalOcean (App Platform)
1. Connect GitHub repository
2. Set environment variables
3. Add managed PostgreSQL database
4. Deploy

### Railway / Render / Fly.io
These platforms support Docker deployments directly from Git. Just:
1. Connect your repository
2. Set environment variables
3. Add PostgreSQL database addon
4. Deploy!

## 📚 Additional Resources

- **Full Deployment Guide**: See `DEPLOYMENT.md`
- **Environment Variables**: See `.env.example`
- **Docker Compose Reference**: See `docker-compose.yml`
- **Development Setup**: See `docker-compose.dev.yml`

## 🆘 Need Help?

- Check logs: `docker-compose logs -f`
- Restart services: `docker-compose restart`
- Full reset: `docker-compose down -v && docker-compose up -d`

---

**Made with ❤️ for Saudi Arabia's Impact Ecosystem**
