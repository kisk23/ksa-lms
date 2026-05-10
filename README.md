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

## Moyasar Payments

The payment integration lives in `apps/api/src/modules/payments` and `apps/web/src/features/payments`.

Backend routes:

- `POST /api/v1/payments` creates a Moyasar sandbox payment.
- `GET /api/v1/payments` lists local payment records.
- `GET /api/v1/payments/:id` fetches and syncs a payment from Moyasar.
- `PATCH /api/v1/payments/:id` updates local metadata/status and gateway metadata when available.
- `POST /api/v1/payments/:id/refund` refunds a payment.
- `POST /api/v1/payments/:id/capture` captures an authorized payment.
- `POST /api/v1/payments/:id/void` voids an authorized payment.
- `POST /api/v1/payments/webhooks/moyasar` accepts Moyasar webhook events without JWT.
- `GET /api/v1/payments/webhook-events` shows recent stored webhook events.

Required sandbox environment:

```bash
MOYASAR_SECRET_KEY=sk_test_replace_me
MOYASAR_PUBLISHABLE_KEY=pk_test_replace_me
MOYASAR_BASE_URL=https://api.moyasar.com/v1
NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY=pk_test_replace_me
```

Run the UI at `http://localhost:3000/payments` and the mock checkout at `http://localhost:3000/checkout/mock`. Payment routes require a JWT in `localStorage.accessToken`.

cURL examples:

```bash
curl -X POST http://localhost:4000/api/v1/payments \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: order-1001" \
  -d '{"orderId":"ORDER-1001","amount":19900,"currency":"SAR","studentUserId":"STUDENT_UUID","courseId":"COURSE_UUID","source":{"type":"creditcard","name":"Test User","number":"4111111111111111","month":12,"year":2028,"cvc":"123","manual":true}}'

curl -H "Authorization: Bearer $JWT" http://localhost:4000/api/v1/payments
curl -H "Authorization: Bearer $JWT" http://localhost:4000/api/v1/payments/PAYMENT_UUID
curl -X POST -H "Authorization: Bearer $JWT" http://localhost:4000/api/v1/payments/PAYMENT_UUID/capture -d '{"amount":19900}' -H "Content-Type: application/json"
curl -X POST -H "Authorization: Bearer $JWT" http://localhost:4000/api/v1/payments/PAYMENT_UUID/refund -d '{"amount":19900,"reason":"customer request"}' -H "Content-Type: application/json"
curl -X POST -H "Authorization: Bearer $JWT" http://localhost:4000/api/v1/payments/PAYMENT_UUID/void
curl -X POST http://localhost:4000/api/v1/payments/webhooks/moyasar -H "Content-Type: application/json" -d '{"id":"evt_test","type":"payment.paid","data":{"id":"moyasar_payment_id","status":"paid","amount":19900,"currency":"SAR"}}'
```

## Documentation

- [Getting Started](docs/getting-started.md)
- [Contributing](docs/contributing.md)
- [API Docs](http://localhost:4000/docs) (Swagger, available when API is running)
