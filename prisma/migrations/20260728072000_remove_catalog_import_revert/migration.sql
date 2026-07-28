-- Remove the reverted catalog import ledger after restoring every archived service.
DROP TABLE IF EXISTS "CatalogImportEntry";
DROP TABLE IF EXISTS "CatalogImportRun";
DROP INDEX IF EXISTS "Service_archivedAt_isPublished_idx";
ALTER TABLE "Service" DROP COLUMN IF EXISTS "archivedAt";
DROP TYPE IF EXISTS "CatalogImportOperation";
DROP TYPE IF EXISTS "CatalogImportSource";
