-- This migration was a duplicate of 20260519181652_add_thumbnail_url and is commented out to avoid shadow database collision.
-- AlterTable
-- ALTER TABLE "assignment_attempts" ADD COLUMN     "snapshot" JSONB;

-- AlterTable
-- ALTER TABLE "assignment_best_scores" ADD COLUMN     "best_attempt_id" UUID NOT NULL;

-- AlterTable
-- ALTER TABLE "assignments" ADD COLUMN     "archived_at" TIMESTAMPTZ(6),
-- ADD COLUMN     "archived_by" UUID;

-- AddForeignKey
-- ALTER TABLE "assignments" ADD CONSTRAINT "assignments_archived_by_fkey" FOREIGN KEY ("archived_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
-- ALTER TABLE "assignment_best_scores" ADD CONSTRAINT "assignment_best_scores_best_attempt_id_fkey" FOREIGN KEY ("best_attempt_id") REFERENCES "assignment_attempts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
