-- CreateEnum
CREATE TYPE "CatalogImportSource" AS ENUM ('DEFAULT_CATALOG', 'SERVICES_III');

-- CreateEnum
CREATE TYPE "CatalogImportOperation" AS ENUM ('CREATED', 'UPDATED');

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CatalogImportRun" (
    "id" TEXT NOT NULL,
    "source" "CatalogImportSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revertedAt" TIMESTAMP(3),

    CONSTRAINT "CatalogImportRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogImportEntry" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "operation" "CatalogImportOperation" NOT NULL,
    "snapshot" JSONB,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revertedAt" TIMESTAMP(3),

    CONSTRAINT "CatalogImportEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CatalogImportRun_source_createdAt_idx" ON "CatalogImportRun"("source", "createdAt");

-- CreateIndex
CREATE INDEX "CatalogImportRun_revertedAt_idx" ON "CatalogImportRun"("revertedAt");

-- CreateIndex
CREATE INDEX "CatalogImportEntry_runId_revertedAt_idx" ON "CatalogImportEntry"("runId", "revertedAt");

-- CreateIndex
CREATE INDEX "CatalogImportEntry_serviceId_idx" ON "CatalogImportEntry"("serviceId");

-- CreateIndex
CREATE INDEX "Service_archivedAt_isPublished_idx" ON "Service"("archivedAt", "isPublished");

-- AddForeignKey
ALTER TABLE "CatalogImportEntry" ADD CONSTRAINT "CatalogImportEntry_runId_fkey" FOREIGN KEY ("runId") REFERENCES "CatalogImportRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogImportEntry" ADD CONSTRAINT "CatalogImportEntry_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
