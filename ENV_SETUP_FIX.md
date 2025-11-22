# 🔧 Fix for Database Connection Error

## ❌ The Error You're Seeing:

```
FATAL: database "saudi_impact_user" does not exist
```

## 🎯 Root Cause:

The `DATABASE_URL` in your `.env.production` file uses shell variable expansion (`${PGUSER}`), which **doesn't work** in Docker `.env` files.

---

## ✅ **THE FIX:**

### On Your Production Server:

**1. Edit your `.env.production` file:**

```bash
nano .env.production
```

**2. Update it to look like this:**

```bash
# Database Configuration
PGHOST=postgres
PGPORT=5432
PGUSER=postgres
PGPASSWORD=YourSecurePassword123    # ← Change this to your password
PGDATABASE=saudi_impact

# Application Configuration
NODE_ENV=production
PORT=5000

# Security
SESSION_SECRET=your_32_character_random_string_here
ADMIN_PASSWORD=YourAdminPassword123

# Database URL - IMPORTANT: Hard-code the SAME password here!
DATABASE_URL=postgresql://postgres:YourSecurePassword123@postgres:5432/saudi_impact
#                                   ^^^^^^^^^^^^^^^^^^^^^
#                                   MUST match PGPASSWORD above!
```

---

## ⚠️ **CRITICAL RULES:**

### ❌ **WRONG** (This doesn't work in Docker .env files):
```bash
DATABASE_URL=postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}
```

### ✅ **CORRECT** (Hard-code the actual values):
```bash
PGPASSWORD=myPassword123
DATABASE_URL=postgresql://postgres:myPassword123@postgres:5432/saudi_impact
```

---

## 🚀 **After Fixing `.env.production`:**

```bash
# Stop containers
docker-compose down

# Restart everything
docker-compose up -d postgres
sleep 10
docker-compose up -d app

# Check logs
docker-compose logs -f app
```

---

## ✅ **You Should See:**

```
✓ Database connected successfully
✓ Server running on port 5000
```

Instead of:
```
❌ FATAL: database "saudi_impact_user" does not exist
```

---

## 📝 **Example Working Configuration:**

```bash
# Example (DO NOT use these passwords in production!)
PGHOST=postgres
PGPORT=5432
PGUSER=postgres
PGPASSWORD=kJ8mN2pQ9rT5vW3xZ7aB4cF6gH1iL0o
PGDATABASE=saudi_impact

NODE_ENV=production
PORT=5000

SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
ADMIN_PASSWORD=SecureAdmin2024!

# Note: Same password in both places!
DATABASE_URL=postgresql://postgres:kJ8mN2pQ9rT5vW3xZ7aB4cF6gH1iL0o@postgres:5432/saudi_impact
```

---

## 🎉 **That's It!**

After fixing your `.env.production` file with hard-coded values (not variable expansion), the database connection error will be gone!
