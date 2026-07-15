-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'CLIENT');

-- CreateEnum
CREATE TYPE "PortfolioSource" AS ENUM ('MANUAL', 'GITHUB');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'REVIEWING', 'DISCUSSING', 'WAITING_FOR_CLIENT', 'READY_FOR_QUOTATION', 'QUOTATION_SENT', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "InquirySource" AS ENUM ('WEBSITE_TO_WHATSAPP', 'MANUAL', 'REFERRAL');

-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'REVISION_REQUESTED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QuotationSource" AS ENUM ('MANUAL', 'INQUIRY', 'EXISTING_CLIENT', 'EXISTING_PROJECT');

-- CreateEnum
CREATE TYPE "PaymentPlanType" AS ENUM ('FULL_PAYMENT', 'DOWN_PAYMENT_AND_FINAL', 'MILESTONE_BASED', 'CUSTOM');

-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('PENDING', 'ACCEPTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('AWAITING_AGREEMENT', 'AWAITING_DOWN_PAYMENT', 'PLANNING', 'IN_PROGRESS', 'CLIENT_REVIEW', 'REVISION', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'CLIENT_REVIEW', 'APPROVED', 'COMPLETED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'PUBLISHED', 'HIDDEN', 'REJECTED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'VOID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('MIDTRANS', 'MANUAL');

-- CreateEnum
CREATE TYPE "ManualPaymentStatus" AS ENUM ('AWAITING_PROOF', 'UNDER_VERIFICATION', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('BRIEF_ATTACHMENT', 'REFERENCE', 'PROJECT_FILE', 'DELIVERY', 'REVISION', 'PAYMENT_PROOF', 'REVIEW_MEDIA', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INQUIRY_SUBMITTED', 'QUOTATION_SENT', 'QUOTATION_VIEWED', 'QUOTATION_ACTIONED', 'AGREEMENT_READY', 'PROJECT_UPDATED', 'MESSAGE_RECEIVED', 'FILE_UPLOADED', 'INVOICE_ISSUED', 'PAYMENT_UPDATED', 'REVIEW_INVITED', 'REVIEW_SUBMITTED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "NotificationDeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "ContactMessageStatus" AS ENUM ('NEW', 'READ', 'REPLIED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "whatsappNumber" TEXT,
    "companyName" TEXT,
    "address" TEXT,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "expiresAt" INTEGER,
    "tokenType" TEXT,
    "scope" TEXT,
    "idToken" TEXT,
    "sessionState" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "startingPrice" DECIMAL(18,2),
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "deliveryEstimate" TEXT,
    "revisionGuidance" TEXT,
    "deliverables" TEXT[],
    "technologies" TEXT[],
    "coverImageUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "technologies" TEXT[],
    "coverImageUrl" TEXT,
    "galleryUrls" TEXT[],
    "liveUrl" TEXT,
    "repositoryUrl" TEXT,
    "source" "PortfolioSource" NOT NULL DEFAULT 'MANUAL',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "inquiryNumber" TEXT NOT NULL,
    "clientId" TEXT,
    "selectedServiceId" TEXT,
    "clientName" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "companyName" TEXT,
    "projectTitle" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "projectGoals" TEXT NOT NULL,
    "targetUsers" TEXT,
    "requiredFeatures" TEXT[],
    "referenceLinks" TEXT[],
    "budgetRange" TEXT,
    "expectedDeadline" TIMESTAMP(3),
    "hasDesign" BOOLEAN,
    "hasDomain" BOOLEAN,
    "hasHosting" BOOLEAN,
    "needsMaintenance" BOOLEAN,
    "isRedesign" BOOLEAN,
    "source" "InquirySource" NOT NULL DEFAULT 'WEBSITE_TO_WHATSAPP',
    "status" "InquiryStatus" NOT NULL DEFAULT 'SUBMITTED',
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InquiryActivity" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InquiryActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentSequence" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lastValue" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "quotationNumber" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT',
    "sourceType" "QuotationSource" NOT NULL DEFAULT 'MANUAL',
    "inquiryId" TEXT,
    "clientId" TEXT,
    "serviceId" TEXT,
    "clientName" TEXT NOT NULL,
    "companyName" TEXT,
    "clientEmail" TEXT,
    "clientPhone" TEXT,
    "clientAddress" TEXT,
    "projectTitle" TEXT NOT NULL,
    "projectSummary" TEXT,
    "projectType" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "subtotal" DECIMAL(18,2) NOT NULL,
    "discount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(18,2) NOT NULL,
    "paymentPlanType" "PaymentPlanType" NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "estimatedStartDate" TIMESTAMP(3),
    "estimatedCompletionAt" TIMESTAMP(3),
    "scopeIncluded" TEXT,
    "scopeExcluded" TEXT,
    "revisionLimit" INTEGER,
    "maintenanceDays" INTEGER,
    "terms" TEXT,
    "notes" TEXT,
    "publicTokenHash" TEXT,
    "publicTokenRevokedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "sentAt" TIMESTAMP(3),
    "viewedAt" TIMESTAMP(3),
    "lastViewedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationItem" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(12,2) NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(18,2) NOT NULL,
    "total" DECIMAL(18,2) NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "QuotationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationPaymentTerm" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "percentage" DECIMAL(5,2),
    "amount" DECIMAL(18,2) NOT NULL,
    "dueTrigger" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "QuotationPaymentTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationRevisionRequest" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuotationRevisionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationActivity" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuotationActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "projectNumber" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "inquiryId" TEXT,
    "clientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'AWAITING_AGREEMENT',
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "total" DECIMAL(18,2) NOT NULL,
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agreement" (
    "id" TEXT NOT NULL,
    "agreementNumber" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "AgreementStatus" NOT NULL DEFAULT 'PENDING',
    "contentSnapshot" JSONB NOT NULL,
    "acceptedByName" TEXT,
    "acceptedByEmail" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "acceptanceIp" TEXT,
    "acceptanceAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMilestone" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PLANNED',
    "sequence" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMessage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectActivity" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSchedule" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "percentage" DECIMAL(5,2),
    "amount" DECIMAL(18,2) NOT NULL,
    "dueTrigger" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "sequence" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "paymentScheduleId" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "subtotal" DECIMAL(18,2) NOT NULL,
    "discount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(18,2) NOT NULL,
    "paidAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "dueDate" TIMESTAMP(3),
    "issuedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "voidedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentAttempt" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "manualStatus" "ManualPaymentStatus",
    "amount" DECIMAL(18,2) NOT NULL,
    "providerOrderId" TEXT,
    "providerTransactionId" TEXT,
    "providerPaymentType" TEXT,
    "providerStatus" TEXT,
    "checkoutUrl" TEXT,
    "snapToken" TEXT,
    "rawResponse" JSONB,
    "submittedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "rejectionReason" TEXT,
    "paidAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventKey" TEXT NOT NULL,
    "eventType" TEXT,
    "referenceId" TEXT,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewInvitation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "serviceId" TEXT,
    "portfolioProjectId" TEXT,
    "overallRating" INTEGER NOT NULL,
    "communicationRating" INTEGER NOT NULL,
    "qualityRating" INTEGER NOT NULL,
    "deliveryRating" INTEGER NOT NULL,
    "valueRating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "ownerResponse" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAsset" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT,
    "projectId" TEXT,
    "paymentAttemptId" TEXT,
    "uploaderId" TEXT,
    "type" "FileType" NOT NULL DEFAULT 'OTHER',
    "originalName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "checksum" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "href" TEXT,
    "metadata" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationDelivery" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "recipient" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsappNumber" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ContactMessageStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_category_idx" ON "Service"("category");

-- CreateIndex
CREATE INDEX "Service_isPublished_isFeatured_idx" ON "Service"("isPublished", "isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioProject_slug_key" ON "PortfolioProject"("slug");

-- CreateIndex
CREATE INDEX "PortfolioProject_category_idx" ON "PortfolioProject"("category");

-- CreateIndex
CREATE INDEX "PortfolioProject_isPublished_isFeatured_idx" ON "PortfolioProject"("isPublished", "isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "Inquiry_inquiryNumber_key" ON "Inquiry"("inquiryNumber");

-- CreateIndex
CREATE INDEX "Inquiry_clientId_idx" ON "Inquiry"("clientId");

-- CreateIndex
CREATE INDEX "Inquiry_selectedServiceId_idx" ON "Inquiry"("selectedServiceId");

-- CreateIndex
CREATE INDEX "Inquiry_status_createdAt_idx" ON "Inquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Inquiry_clientEmail_idx" ON "Inquiry"("clientEmail");

-- CreateIndex
CREATE INDEX "InquiryActivity_inquiryId_createdAt_idx" ON "InquiryActivity"("inquiryId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentSequence_type_year_key" ON "DocumentSequence"("type", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_publicTokenHash_key" ON "Quotation"("publicTokenHash");

-- CreateIndex
CREATE INDEX "Quotation_groupId_isCurrent_idx" ON "Quotation"("groupId", "isCurrent");

-- CreateIndex
CREATE INDEX "Quotation_status_createdAt_idx" ON "Quotation"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Quotation_clientId_idx" ON "Quotation"("clientId");

-- CreateIndex
CREATE INDEX "Quotation_inquiryId_idx" ON "Quotation"("inquiryId");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_quotationNumber_version_key" ON "Quotation"("quotationNumber", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_groupId_version_key" ON "Quotation"("groupId", "version");

-- CreateIndex
CREATE INDEX "QuotationItem_quotationId_idx" ON "QuotationItem"("quotationId");

-- CreateIndex
CREATE UNIQUE INDEX "QuotationItem_quotationId_sequence_key" ON "QuotationItem"("quotationId", "sequence");

-- CreateIndex
CREATE INDEX "QuotationPaymentTerm_quotationId_idx" ON "QuotationPaymentTerm"("quotationId");

-- CreateIndex
CREATE UNIQUE INDEX "QuotationPaymentTerm_quotationId_sequence_key" ON "QuotationPaymentTerm"("quotationId", "sequence");

-- CreateIndex
CREATE INDEX "QuotationRevisionRequest_quotationId_createdAt_idx" ON "QuotationRevisionRequest"("quotationId", "createdAt");

-- CreateIndex
CREATE INDEX "QuotationActivity_quotationId_createdAt_idx" ON "QuotationActivity"("quotationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectNumber_key" ON "Project"("projectNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Project_quotationId_key" ON "Project"("quotationId");

-- CreateIndex
CREATE INDEX "Project_clientId_status_idx" ON "Project"("clientId", "status");

-- CreateIndex
CREATE INDEX "Project_inquiryId_idx" ON "Project"("inquiryId");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Agreement_agreementNumber_key" ON "Agreement"("agreementNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Agreement_projectId_key" ON "Agreement"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Agreement_quotationId_key" ON "Agreement"("quotationId");

-- CreateIndex
CREATE INDEX "ProjectMilestone_projectId_status_idx" ON "ProjectMilestone"("projectId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMilestone_projectId_sequence_key" ON "ProjectMilestone"("projectId", "sequence");

-- CreateIndex
CREATE INDEX "ProjectMessage_projectId_createdAt_idx" ON "ProjectMessage"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "ProjectMessage_senderId_idx" ON "ProjectMessage"("senderId");

-- CreateIndex
CREATE INDEX "ProjectActivity_projectId_createdAt_idx" ON "ProjectActivity"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "PaymentSchedule_projectId_idx" ON "PaymentSchedule"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentSchedule_projectId_sequence_key" ON "PaymentSchedule"("projectId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_paymentScheduleId_key" ON "Invoice"("paymentScheduleId");

-- CreateIndex
CREATE INDEX "Invoice_projectId_status_idx" ON "Invoice"("projectId", "status");

-- CreateIndex
CREATE INDEX "Invoice_clientId_createdAt_idx" ON "Invoice"("clientId", "createdAt");

-- CreateIndex
CREATE INDEX "Invoice_dueDate_idx" ON "Invoice"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentAttempt_providerOrderId_key" ON "PaymentAttempt"("providerOrderId");

-- CreateIndex
CREATE INDEX "PaymentAttempt_invoiceId_status_idx" ON "PaymentAttempt"("invoiceId", "status");

-- CreateIndex
CREATE INDEX "PaymentAttempt_projectId_idx" ON "PaymentAttempt"("projectId");

-- CreateIndex
CREATE INDEX "PaymentAttempt_clientId_createdAt_idx" ON "PaymentAttempt"("clientId", "createdAt");

-- CreateIndex
CREATE INDEX "PaymentAttempt_provider_providerStatus_idx" ON "PaymentAttempt"("provider", "providerStatus");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_eventKey_key" ON "WebhookEvent"("eventKey");

-- CreateIndex
CREATE INDEX "WebhookEvent_provider_referenceId_idx" ON "WebhookEvent"("provider", "referenceId");

-- CreateIndex
CREATE INDEX "WebhookEvent_processed_createdAt_idx" ON "WebhookEvent"("processed", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewInvitation_projectId_key" ON "ReviewInvitation"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewInvitation_tokenHash_key" ON "ReviewInvitation"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Review_projectId_key" ON "Review"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_invitationId_key" ON "Review"("invitationId");

-- CreateIndex
CREATE INDEX "Review_status_isPublished_idx" ON "Review"("status", "isPublished");

-- CreateIndex
CREATE INDEX "Review_serviceId_idx" ON "Review"("serviceId");

-- CreateIndex
CREATE INDEX "Review_portfolioProjectId_idx" ON "Review"("portfolioProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "FileAsset_storageKey_key" ON "FileAsset"("storageKey");

-- CreateIndex
CREATE INDEX "FileAsset_inquiryId_type_idx" ON "FileAsset"("inquiryId", "type");

-- CreateIndex
CREATE INDEX "FileAsset_projectId_type_idx" ON "FileAsset"("projectId", "type");

-- CreateIndex
CREATE INDEX "FileAsset_paymentAttemptId_idx" ON "FileAsset"("paymentAttemptId");

-- CreateIndex
CREATE INDEX "FileAsset_uploaderId_idx" ON "FileAsset"("uploaderId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_createdAt_idx" ON "Notification"("userId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "NotificationDelivery_status_createdAt_idx" ON "NotificationDelivery"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationDelivery_notificationId_channel_key" ON "NotificationDelivery"("notificationId", "channel");

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ContactMessage_status_createdAt_idx" ON "ContactMessage"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContactMessage_email_idx" ON "ContactMessage"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_selectedServiceId_fkey" FOREIGN KEY ("selectedServiceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryActivity" ADD CONSTRAINT "InquiryActivity_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationPaymentTerm" ADD CONSTRAINT "QuotationPaymentTerm_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationRevisionRequest" ADD CONSTRAINT "QuotationRevisionRequest_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationActivity" ADD CONSTRAINT "QuotationActivity_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMilestone" ADD CONSTRAINT "ProjectMilestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMessage" ADD CONSTRAINT "ProjectMessage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMessage" ADD CONSTRAINT "ProjectMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectActivity" ADD CONSTRAINT "ProjectActivity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSchedule" ADD CONSTRAINT "PaymentSchedule_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_paymentScheduleId_fkey" FOREIGN KEY ("paymentScheduleId") REFERENCES "PaymentSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAttempt" ADD CONSTRAINT "PaymentAttempt_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAttempt" ADD CONSTRAINT "PaymentAttempt_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAttempt" ADD CONSTRAINT "PaymentAttempt_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewInvitation" ADD CONSTRAINT "ReviewInvitation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "ReviewInvitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_portfolioProjectId_fkey" FOREIGN KEY ("portfolioProjectId") REFERENCES "PortfolioProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_paymentAttemptId_fkey" FOREIGN KEY ("paymentAttemptId") REFERENCES "PaymentAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
