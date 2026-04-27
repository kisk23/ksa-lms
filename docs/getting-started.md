# Getting Started

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9 (`npm install -g pnpm`)
- **Docker** & Docker Compose
- **Git**

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url> && cd lms

# 2. Install dependencies
pnpm install

# 3. Copy environment file
cp .env.example .env

# 4. Start infrastructure (PostgreSQL, Redis)
docker compose -f tools/docker/docker-compose.yml up -d

# 5. Generate Prisma client & run migrations
pnpm db:generate
pnpm db:migrate

# 6. Seed the database
pnpm db:seed

# 7. Start all apps in dev mode
pnpm dev
```

## Available URLs

| Service         | URL                          |
|-----------------|------------------------------|
| Web App         | http://localhost:3000         |
| Admin Dashboard | http://localhost:3001         |
| API             | http://localhost:4000/api/v1  |
| Swagger Docs    | http://localhost:4000/docs    |
| Prisma Studio   | Run `pnpm db:studio`         |
| Mailpit Web UI  | http://localhost:8025         |
| MinIO Console   | http://localhost:9001         |

## Running a Single App

```bash
# Only the web app
pnpm --filter @lms/web dev

# Only the API
pnpm --filter @lms/api dev

# Only the admin dashboard
pnpm --filter @lms/admin dev
```

## Useful Commands

```bash
pnpm dev             # Start all apps
pnpm build           # Build all apps
pnpm lint            # Lint all apps
pnpm test            # Run all tests
pnpm format          # Format all files
pnpm db:migrate      # Run Prisma migrations
pnpm db:seed         # Seed the database
pnpm db:studio       # Open Prisma Studio
pnpm clean           # Remove all build artifacts
```
