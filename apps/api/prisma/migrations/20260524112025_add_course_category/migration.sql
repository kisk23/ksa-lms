-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "category" VARCHAR(100);

-- CreateIndex
CREATE INDEX "courses_category_idx" ON "courses"("category");
