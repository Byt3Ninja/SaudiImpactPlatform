# 🚀 Production Server Deployment Guide

## Quick Production Setup (5 Steps)

### Step 1: Create Environment File

```bash
# Copy the production example
cp .env.production.example .env.production

# Edit with your secure values
nano .env.production
```

**Change these values:**
```bash
PGPASSWORD=your_strong_db_password_here
SESSION_SECRET=run_openssl_rand_base64_32
ADMIN_PASSWORD=your_admin_password_here
```

**Generate secure secrets:**
```bash
openssl rand -base64 32  # For SESSION_SECRET
openssl rand -base64 24  # For passwords
```

---

### Step 2: Build Docker Images

```bash
docker-compose build --no-cache
```

---

### Step 3: Start Database

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Wait for it to be ready (10-15 seconds)
sleep 10

# Verify it's healthy
docker-compose ps postgres
```

---

### Step 4: Run Migrations & Seed Data

```bash
# Run database schema migrations
docker-compose --profile migration up db-migrate

# Load initial data (organizations, projects, reference data)
docker-compose --profile seeding up db-seed
```

---

### Step 5: Start Application

```bash
# Start the main application
docker-compose up -d app

# Check if it's running
docker-compose ps app

# View logs
docker-compose logs -f app
```

---

## ✅ Verify Everything Works

```bash
# Check all services are running
docker-compose ps

# Test the API
curl http://localhost:5000/api/stats

# From another machine
curl http://YOUR_SERVER_IP:5000/api/stats
```

**Access the application:**
- Main site: `http://YOUR_SERVER_IP:5000`
- Admin panel: `http://YOUR_SERVER_IP:5000/admin/login`

---

## 🔄 Update/Redeploy

```bash
# Stop services
docker-compose down

# Pull latest code
git pull

# Rebuild with new code
docker-compose build --no-cache

# Start everything
docker-compose up -d postgres
sleep 10
docker-compose --profile migration up db-migrate  # If schema changed
docker-compose up -d app

# Verify
docker-compose logs -f app
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot find package 'vite'"

**Status:** ✅ **PERMANENTLY FIXED** - Vite is now completely excluded from production builds

**Technical Details:** The build process now uses an eval-wrapped dynamic import to prevent esbuild from bundling vite and its plugins into the production bundle. This ensures vite stays in devDependencies where it belongs.

**If you somehow still see this:**
```bash
# Pull the absolute latest code
git pull origin main

# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Issue 2: "drizzle-kit: not found"

**Status:** ✅ Fixed in latest version (drizzle-kit moved to production dependencies)

**If you still see this after rebuild:**
```bash
# Ensure you have the latest code
git pull

# Clean rebuild
docker-compose build --no-cache
docker-compose --profile migration up db-migrate
```

### Issue 3: Database connection failed

**Check:**
```bash
# Is postgres running?
docker-compose ps postgres

# View postgres logs
docker-compose logs postgres

# Verify DATABASE_URL in .env.production
cat .env.production | grep DATABASE_URL
```

### Issue 4: Port 5000 already in use

**Fix:**
```bash
# Option 1: Kill process on port
sudo lsof -ti:5000 | xargs kill -9

# Option 2: Change port in .env.production
echo "PORT=5001" >> .env.production
docker-compose up -d app
```

---

## 📊 Monitoring

```bash
# View application logs
docker-compose logs -f app

# View all services
docker-compose logs -f

# Check resource usage
docker stats saudi-impact-app saudi-impact-db

# Check health status
docker inspect saudi-impact-app | grep -A5 Health
```

---

## 💾 Backup Database

```bash
# Create backup
docker-compose exec postgres pg_dump -U saudi_impact_user saudi_impact_prod > backup_$(date +%Y%m%d).sql

# Restore from backup
cat backup_20240101.sql | docker-compose exec -T postgres psql -U saudi_impact_user -d saudi_impact_prod
```

---

## 🛑 Stop Everything

```bash
# Stop all services (keeps data)
docker-compose down

# Stop and remove volumes (deletes data!)
docker-compose down -v
```

---

## 🔒 Security Checklist

- [ ] Changed default passwords in `.env.production`
- [ ] `SESSION_SECRET` is random 32+ characters
- [ ] `ADMIN_PASSWORD` is strong and unique
- [ ] `.env.production` is NOT committed to git
- [ ] Only ports 80, 443, 22 open in firewall
- [ ] Consider adding SSL/TLS with Nginx reverse proxy

---

## 🆘 Need Help?

**View environment variables:**
```bash
docker-compose exec app env | grep -E "NODE_ENV|DATABASE|PORT"
```

**Restart app:**
```bash
docker-compose restart app
```

**Complete reset (WARNING: Deletes all data!):**
```bash
docker-compose down -v
docker-compose up -d
```

---

## 📞 Admin Panel Access

- URL: `http://YOUR_SERVER_IP:5000/admin/login`
- Password: The `ADMIN_PASSWORD` from your `.env.production` file
- No username required - just enter the password

---

**That's it! Your Saudi Impact Platform is now running in production! 🎉**

---

## 📝 Recent Fixes (Latest Version)

### ✅ Vite Import Error - PERMANENTLY FIXED
- **Issue**: `ERR_MODULE_NOT_FOUND: Cannot find package 'vite'` in production
- **Root Cause**: esbuild was bundling vite.ts and vite.config.ts into production build
- **Solution**: Implemented eval-wrapped dynamic import to exclude vite from bundle
- **Status**: Completely resolved - vite no longer appears in dist/index.js

### ✅ drizzle-kit Missing - FIXED
- **Issue**: `sh: drizzle-kit: not found` during migrations
- **Solution**: Moved drizzle-kit and tsx to production dependencies
- **Status**: Migration containers now work correctly

### ✅ Production-Ready
All known deployment blockers have been resolved. The platform is production-ready.

