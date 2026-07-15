-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Inquiry_archivedAt_createdAt_idx" ON "Inquiry"("archivedAt", "createdAt");

-- CreateIndex
CREATE INDEX "Quotation_archivedAt_updatedAt_idx" ON "Quotation"("archivedAt", "updatedAt");
