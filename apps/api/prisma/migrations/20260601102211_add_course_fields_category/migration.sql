-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "category" TEXT;

-- CreateIndex
CREATE INDEX "courses_category_idx" ON "courses"("category");
