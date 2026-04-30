# LMS — Learning Management System

A modern LMS monorepo built with **NestJS**, **Next.js**, **Prisma**, and **PostgreSQL**.

## Architecture

| App / Package           | Description                              | Port |
| ----------------------- | ---------------------------------------- | ---- |
| `apps/web`              | Student & Instructor portal (Next.js)    | 3000 |
| `apps/admin`            | Admin dashboard (Next.js)                | 3001 |
| `apps/api`              | REST API (NestJS + Prisma)               | 4000 |
| `packages/ui`           | Shared React component library           | —    |
| `packages/shared-types` | TypeScript interfaces shared across apps | —    |
| `packages/utils`        | Generic utility functions                | —    |
| `packages/logger`       | Structured logging                       | —    |
| `packages/config`       | Shared ESLint, TSConfig, Prettier        | —    |

## Quick Start

```bash
pnpm install
cp .env.example .env
docker compose -f tools/docker/docker-compose.yml up -d
pnpm db:generate && pnpm db:migrate && pnpm db:seed
pnpm dev
```

📖 See [docs/getting-started.md](docs/getting-started.md) for full setup instructions.

## Documentation

- [Getting Started](docs/getting-started.md)
- [Contributing](docs/contributing.md)
- [API Docs](http://localhost:4000/docs) (Swagger, available when API is running)
