/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `chapters` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `lesson_version` on the `lesson_progress` table. All the data in the column will be lost.
  - You are about to drop the column `is_archived` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `youtube_video_id` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VideoProvider" AS ENUM ('YOUTUBE', 'BUNNY');

-- CreateEnum
CREATE TYPE "CourseAuditAction" AS ENUM ('CREATED', 'UPDATED', 'PUBLISHED', 'ARCHIVED', 'RESTORED', 'DELETED');

-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_course_id_fkey";

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "question_options" DROP CONSTRAINT "question_options_question_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_assignment_id_fkey";

-- DropIndex
DROP INDEX "lessons_is_archived_idx";

-- AlterTable
ALTER TABLE "chapters" DROP COLUMN "deleted_at",
ADD COLUMN     "archived_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "course_progress" ADD COLUMN     "last_lesson_id" UUID;

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "deleted_at",
ADD COLUMN     "archived_at" TIMESTAMPTZ(6),
ADD COLUMN     "archived_by" UUID,
ADD COLUMN     "promo_video_provider" "VideoProvider",
ADD COLUMN     "promo_video_url" TEXT,
ADD COLUMN     "published_by" UUID,
ADD COLUMN     "thumbnail_url" TEXT;

-- AlterTable
ALTER TABLE "lesson_progress" DROP COLUMN "lesson_version";

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "is_archived",
DROP COLUMN "youtube_video_id",
ADD COLUMN     "archived_at" TIMESTAMPTZ(6),
ADD COLUMN     "video_provider" "VideoProvider" NOT NULL DEFAULT 'YOUTUBE',
ADD COLUMN     "video_url" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "amount" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "deleted_at";

-- CreateTable
CREATE TABLE "course_audit_logs" (
    "id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "action" "CourseAuditAction" NOT NULL,
    "performed_by" UUID NOT NULL,
    "performed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "course_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "course_audit_logs_course_id_idx" ON "course_audit_logs"("course_id");

-- CreateIndex
CREATE INDEX "course_audit_logs_performed_by_idx" ON "course_audit_logs"("performed_by");

-- CreateIndex
CREATE INDEX "course_audit_logs_metadata_idx" ON "course_audit_logs" USING GIN ("metadata");

-- CreateIndex
CREATE INDEX "lessons_archived_at_idx" ON "lessons"("archived_at");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_published_by_fkey" FOREIGN KEY ("published_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_archived_by_fkey" FOREIGN KEY ("archived_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_audit_logs" ADD CONSTRAINT "course_audit_logs_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_audit_logs" ADD CONSTRAINT "course_audit_logs_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_last_lesson_id_fkey" FOREIGN KEY ("last_lesson_id") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
