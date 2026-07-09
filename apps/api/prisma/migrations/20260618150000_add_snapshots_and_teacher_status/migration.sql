-- AlterTable
ALTER TABLE "users"
ADD COLUMN "is_locked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "lock_reason" TEXT,
ADD COLUMN "locked_at" TIMESTAMPTZ(6),
ADD COLUMN "is_banned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "ban_reason" TEXT,
ADD COLUMN "banned_at" TIMESTAMPTZ(6),
ADD COLUMN "ban_expires_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "approval_requests"
ADD COLUMN "rejection_reason" TEXT;

-- CreateTable
CREATE TABLE "course_snapshots" (
    "id" UUID NOT NULL,
    "course_id" UUID,
    "approval_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot_data" JSONB NOT NULL,
    "approved_by" UUID NOT NULL,
    "approved_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_snapshots_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "courses"
ADD COLUMN "live_snapshot_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "courses_live_snapshot_id_key" ON "courses"("live_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_snapshots_course_id_version_key" ON "course_snapshots"("course_id", "version");

-- CreateIndex
CREATE INDEX "course_snapshots_course_id_idx" ON "course_snapshots"("course_id");

-- AddForeignKey
ALTER TABLE "courses"
ADD CONSTRAINT "courses_live_snapshot_id_fkey"
FOREIGN KEY ("live_snapshot_id") REFERENCES "course_snapshots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_snapshots"
ADD CONSTRAINT "course_snapshots_course_id_fkey"
FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_snapshots"
ADD CONSTRAINT "course_snapshots_approval_id_fkey"
FOREIGN KEY ("approval_id") REFERENCES "approval_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_snapshots"
ADD CONSTRAINT "course_snapshots_approved_by_fkey"
FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
