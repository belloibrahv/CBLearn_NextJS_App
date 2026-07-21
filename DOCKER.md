# Docker Deployment Guide

## Overview
This project has been dockerized for production deployment with PostgreSQL database.

## Files Created
- `Dockerfile` - Multi-stage build for Next.js app
- `docker-compose.yml` - Orchestrates app and PostgreSQL containers
- `.dockerignore` - Excludes unnecessary files from Docker build
- `.env.example` - Environment variables template
- `.env` - Current environment configuration
- `docker-entrypoint.sh` - Container startup script with database seeding

## Quick Start

### Build and Run
```bash
# Build the Docker images
docker compose build

# Start containers in detached mode
docker compose up -d

# View logs
docker compose logs app

# Stop containers
docker compose down
```

### Access the Application
- **App URL**: http://localhost:3001
- **PostgreSQL**: localhost:5433

### Default Admin Credentials
- Matric number: ADMIN/0001
- Password: admin123

## Container Services

### PostgreSQL (cblearn-postgres)
- Image: postgres:16-alpine
- Port: 5433 (mapped from 5432)
- Database: cblearn
- User: cblearn
- Password: cblearn_password
- Volume: postgres_data (persistent storage)

### Next.js App (cblearn-app)
- Port: 3001 (mapped from 3000)
- Environment: production
- Database: PostgreSQL via DATABASE_URL
- Auto-seeds database on first startup

## Environment Variables

Key variables in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret (CHANGE IN PRODUCTION)
- `NODE_ENV` - Node environment (production)
- `PORT` - Application port (3000)

## Production Deployment

### Before deploying to production:
1. Change the JWT_SECRET to a secure random string:
   ```bash
   openssl rand -base64 32
   ```
2. Update PostgreSQL password in docker-compose.yml
3. Remove port mappings if using cloud provider
4. Use proper secrets management (e.g., Docker Secrets, AWS Secrets Manager)

### Cloud Deployment Options
- **Render**: Use existing `render.yaml` blueprint
- **Docker Swarm**: Use `docker stack deploy`
- **Kubernetes**: Convert docker-compose.yml to Kubernetes manifests
- **AWS ECS/Fargate**: Push images to ECR and deploy

## Troubleshooting

### Port Conflicts
If ports 3000 or 5432 are in use, modify the port mappings in `docker-compose.yml`.

### Database Connection Issues
- Ensure PostgreSQL container is healthy: `docker compose ps`
- Check logs: `docker compose logs postgres`
- Verify DATABASE_URL format

### Rebuild After Code Changes
```bash
docker compose down
docker compose build
docker compose up -d
```

### Reset Database
```bash
docker compose down -v  # Removes volumes
docker compose up -d
```
