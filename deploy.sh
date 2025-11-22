#!/bin/bash
# Saudi Impact Platform - Production Deployment Script
# Run this on your production server after pulling the latest code

set -e  # Exit on error

echo "🚀 Saudi Impact Platform - Production Deployment"
echo "=================================================="
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "⚠️  .env.production not found!"
    echo "📝 Creating from template..."
    cp .env.production.example .env.production
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.production with your secure passwords!"
    echo "   Run: nano .env.production"
    echo ""
    echo "Generate secure values with:"
    echo "   openssl rand -base64 32  # For SESSION_SECRET"
    echo "   openssl rand -base64 24  # For passwords"
    echo ""
    read -p "Press Enter after you've configured .env.production..."
fi

echo "🔨 Building Docker images..."
docker-compose build --no-cache

echo "🗄️  Starting PostgreSQL database..."
docker-compose up -d postgres

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "📊 Running database migrations..."
docker-compose --profile migration up db-migrate

echo "🌱 Seeding database with initial data..."
docker-compose --profile seeding up db-seed

echo "🚀 Starting application..."
docker-compose up -d app

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Checking services..."
docker-compose ps

echo ""
echo "📝 View logs with:"
echo "   docker-compose logs -f app"
echo ""
echo "🌐 Access your application:"
echo "   Main site: http://YOUR_SERVER_IP:5000"
echo "   Admin panel: http://YOUR_SERVER_IP:5000/admin/login"
echo ""
echo "🎉 Done!"
