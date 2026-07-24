-- CreateEnum
CREATE TYPE "StudioStackCategory" AS ENUM ('FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS', 'MOBILE', 'TOOLING', 'OTHER');

-- CreateTable
CREATE TABLE "StudioStackItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "StudioStackCategory" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudioStackItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudioStackItem_slug_key" ON "StudioStackItem"("slug");

-- CreateIndex
CREATE INDEX "StudioStackItem_isPublished_category_sortOrder_idx" ON "StudioStackItem"("isPublished", "category", "sortOrder");
