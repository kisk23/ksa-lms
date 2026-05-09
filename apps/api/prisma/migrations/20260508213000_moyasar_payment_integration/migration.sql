-- Add Moyasar-specific payment fields.
ALTER TABLE "payments" ADD COLUMN "order_id" VARCHAR(255);
UPDATE "payments" SET "order_id" = 'order_' || "id"::text WHERE "order_id" IS NULL;
ALTER TABLE "payments" ALTER COLUMN "order_id" SET NOT NULL;

ALTER TABLE "payments" ADD COLUMN "amount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "payments" ADD COLUMN "refunded_amount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "payments" ADD COLUMN "captured_amount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "payments" ADD COLUMN "raw_gateway_response" JSONB;

CREATE INDEX "payments_order_id_idx" ON "payments"("order_id");

-- Replace legacy internal payment statuses with the Moyasar-facing lifecycle.
ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT;

CREATE TYPE "PaymentStatus_new" AS ENUM (
  'initiated',
  'paid',
  'authorized',
  'captured',
  'refunded',
  'failed',
  'voided'
);

ALTER TABLE "payments"
  ALTER COLUMN "status" TYPE "PaymentStatus_new"
  USING (
    CASE "status"::text
      WHEN 'PAID' THEN 'paid'
      WHEN 'FAILED' THEN 'failed'
      WHEN 'REFUNDED' THEN 'refunded'
      WHEN 'PARTIALLY_REFUNDED' THEN 'refunded'
      ELSE 'initiated'
    END
  )::"PaymentStatus_new";

ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";

ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'initiated';

-- Durable Moyasar webhook audit log with idempotent event processing.
CREATE TABLE "payment_webhook_events" (
  "id" UUID NOT NULL,
  "event_id" VARCHAR(255),
  "payment_id" UUID,
  "moyasar_payment_id" VARCHAR(255),
  "event_type" VARCHAR(100) NOT NULL,
  "payload" JSONB NOT NULL,
  "processed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "payment_webhook_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payment_webhook_events_event_id_key" ON "payment_webhook_events"("event_id");
CREATE INDEX "payment_webhook_events_payment_id_idx" ON "payment_webhook_events"("payment_id");
CREATE INDEX "payment_webhook_events_moyasar_payment_id_idx" ON "payment_webhook_events"("moyasar_payment_id");
CREATE INDEX "payment_webhook_events_event_type_idx" ON "payment_webhook_events"("event_type");

ALTER TABLE "payment_webhook_events"
  ADD CONSTRAINT "payment_webhook_events_payment_id_fkey"
  FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
