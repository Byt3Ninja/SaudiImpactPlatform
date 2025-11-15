# Saudi Impact Platform - Docker Deployment Guide

## Overview

This guide covers deploying the Saudi Impact Platform using Docker and Docker Compose for production and development environments.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB free RAM
- At least 5GB free disk space

## Quick Start

### 1. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and configure the following **required** variables:

```env
# Generate a strong session secret (use: openssl rand -base64 32)
SESSION_SECRET=your_generated_session_secret_here

# Set a secure admin password
ADMIN_PASSWORD=your_secure_admin_password

# Set a secure PostgreSQL password
PGPASSWORD=your_secure_postgres_password

# Update DATABASE_URL with your postgres password
DATABASE_URL=postgresql://postgres:your_secure_postgres_password@postgres:5432/saudi_impact
```

### 2. Start the Application

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app
```

### 3. Initialize Database

Run database migrations and seed data:

```bash
# Run migrations
docker-compose --profile migration up db-migrate

# Seed reference data and sample organizations
docker-compose --profile seeding up db-seed
```

### 4. Access the Application

- **Application**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin (use ADMIN_PASSWORD from .env)

## Development Setup

For local development with hot reload:

```bash
# Copy development environment
cp .env.development.example .env

# Start development services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app
```

## Production Deployment

### Security Checklist

Before deploying to production:

- [ ] Generate strong `SESSION_SECRET` (32+ characters)
- [ ] Set secure `ADMIN_PASSWORD`
- [ ] Set secure `PGPASSWORD`
- [ ] Update `DATABASE_URL` with production credentials
- [ ] Set `NODE_ENV=production`
- [ ] Enable `TRUST_PROXY=true` if behind reverse proxy
- [ ] Review and restrict database access
- [ ] Configure SSL/TLS certificates for HTTPS
- [ ] Set up regular database backups

### Deployment Steps

1. **Build Production Image**
   ```bash
   docker-compose build
   ```

2. **Start Services**
   ```bash
   docker-compose up -d
   ```

3. **Run Migrations**
   ```bash
   docker-compose --profile migration up db-migrate
   ```

4. **Seed Database** (first time only)
   ```bash
   docker-compose --profile seeding up db-seed
   ```

5. **Verify Health**
   ```bash
   docker-compose ps
   curl http://localhost:5000/api/stats
   ```

## Database Management

### Backup Database

```bash
docker exec saudi-impact-db pg_dump -U postgres saudi_impact > backup.sql
```

### Restore Database

```bash
docker exec -i saudi-impact-db psql -U postgres saudi_impact < backup.sql
```

### Access PostgreSQL CLI

```bash
docker exec -it saudi-impact-db psql -U postgres -d saudi_impact
```

### Run Custom Seed Scripts

```bash
docker-compose exec app tsx server/seed-reference-data.ts
docker-compose exec app tsx server/seed.ts
```

## Service Management

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Restart Services

```bash
# Restart all
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

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

## Scaling

### Horizontal Scaling

To run multiple app instances behind a load balancer:

```bash
docker-compose up -d --scale app=3
```

**Note**: Requires session persistence (Redis) for multiple instances.

## Troubleshooting

### Application Won't Start

Check logs:
```bash
docker-compose logs app
```

Common issues:
- Missing environment variables
- Database connection failed
- Port 5000 already in use

### Database Connection Errors

Verify database is healthy:
```bash
docker-compose ps postgres
docker-compose logs postgres
```

Test connection:
```bash
docker exec saudi-impact-db pg_isready -U postgres
```

### Permission Errors

Ensure proper ownership:
```bash
docker-compose exec app chown -R nodejs:nodejs /app
```

### Container Health Check Failing

View health status:
```bash
docker inspect saudi-impact-app | grep -A 10 Health
```

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `production` | Yes |
| `PORT` | Application port | `5000` | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `SESSION_SECRET` | Session encryption key | - | Yes |
| `ADMIN_PASSWORD` | Admin panel password | - | Yes |
| `PGHOST` | PostgreSQL host | `postgres` | Yes |
| `PGPORT` | PostgreSQL port | `5432` | No |
| `PGUSER` | PostgreSQL user | `postgres` | Yes |
| `PGPASSWORD` | PostgreSQL password | - | Yes |
| `PGDATABASE` | PostgreSQL database name | `saudi_impact` | Yes |
| `TRUST_PROXY` | Enable proxy trust | `false` | No |

## Monitoring

### Health Checks

Application health endpoint:
```bash
curl http://localhost:5000/api/stats
```

Database health:
```bash
docker-compose exec postgres pg_isready
```

### Performance Monitoring

View container stats:
```bash
docker stats saudi-impact-app saudi-impact-db
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong passwords** (16+ characters, mixed case, numbers, symbols)
3. **Rotate secrets regularly** (SESSION_SECRET, passwords)
4. **Limit database access** to application network only
5. **Enable SSL/TLS** for production deployments
6. **Regular backups** of PostgreSQL data
7. **Update Docker images** regularly for security patches
8. **Use reverse proxy** (nginx, Traefik) for SSL termination
9. **Enable rate limiting** on public endpoints
10. **Monitor logs** for suspicious activity

## Advanced Configuration

### Custom PostgreSQL Configuration

Create `postgres.conf`:
```ini
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
```

Mount in docker-compose.yml:
```yaml
volumes:
  - ./postgres.conf:/etc/postgresql/postgresql.conf
```

### SSL/TLS Configuration

Use a reverse proxy (nginx, Traefik, Caddy) for SSL termination.

Example nginx configuration:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Set `TRUST_PROXY=true` in `.env`.

## Support

For issues and questions:
- GitHub Issues: [Project Repository]
- Documentation: [Project Wiki]

## License

MIT License - See LICENSE file for details
