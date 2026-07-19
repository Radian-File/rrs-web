CREATE TABLE "QuotationDiscussion" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuotationDiscussion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "QuotationDiscussion_quotationId_createdAt_idx" ON "QuotationDiscussion"("quotationId", "createdAt");

ALTER TABLE "QuotationDiscussion" ADD CONSTRAINT "QuotationDiscussion_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
