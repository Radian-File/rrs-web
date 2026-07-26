-- CreateEnum
CREATE TYPE "ServiceCatalogKind" AS ENUM ('PROJECT', 'MICRO_TASK');

-- CreateEnum
CREATE TYPE "ComplexityLevelCode" AS ENUM ('ESSENTIAL', 'ADVANCED', 'PREMIUM');

-- AlterTable
ALTER TABLE "Service"
  ADD COLUMN "catalogKind" "ServiceCatalogKind" NOT NULL DEFAULT 'PROJECT',
  ADD COLUMN "showInPricingGuide" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ServiceComplexityLevel" (
  "id" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "code" "ComplexityLevelCode" NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "indicators" TEXT[] NOT NULL,
  "escalationSignals" TEXT[] NOT NULL,
  "startingPrice" DECIMAL(18,2),
  "currency" TEXT NOT NULL DEFAULT 'IDR',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ServiceComplexityLevel_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Inquiry"
  ADD COLUMN "initialComplexityLevelId" TEXT,
  ADD COLUMN "initialComplexityLevelCode" "ComplexityLevelCode",
  ADD COLUMN "initialComplexityLevelLabel" TEXT;

-- CreateIndex
CREATE INDEX "Service_showInPricingGuide_isPublished_idx" ON "Service"("showInPricingGuide", "isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceComplexityLevel_serviceId_code_key" ON "ServiceComplexityLevel"("serviceId", "code");

-- CreateIndex
CREATE INDEX "ServiceComplexityLevel_serviceId_isPublished_sortOrder_idx" ON "ServiceComplexityLevel"("serviceId", "isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "Inquiry_initialComplexityLevelId_idx" ON "Inquiry"("initialComplexityLevelId");

-- AddForeignKey
ALTER TABLE "ServiceComplexityLevel"
  ADD CONSTRAINT "ServiceComplexityLevel_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry"
  ADD CONSTRAINT "Inquiry_initialComplexityLevelId_fkey"
  FOREIGN KEY ("initialComplexityLevelId") REFERENCES "ServiceComplexityLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
