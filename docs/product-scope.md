# Product Scope

## Product statement

RRS Freelancer is a production-oriented freelance project management and client collaboration platform presented through a premium service-discovery website.

## Actors

- **Visitor:** explores services and portfolio, submits a brief, and continues consultation via WhatsApp.
- **Client:** reviews quotations, accepts agreements, tracks projects, reviews files, manages invoices/payments, and submits a verified review.
- **Owner:** manages content, inquiries, quotations, projects, milestones, invoices, payments, delivery, and review moderation.

There is no public specialist/seller onboarding.

## Source-of-truth flow

1. Visitor chooses a service or starts a project brief.
2. System creates an inquiry and WhatsApp continuation message.
3. Owner records discussion and prepares a quotation.
4. Client accepts, rejects, or requests a versioned revision.
5. Accepted quotation atomically provisions agreement, project, payment schedule, and first invoice.
6. Agreement and required payment unlock project work.
7. Client tracks milestones, messages, files, delivery, and approvals.
8. Completed project can issue exactly one verified review invitation.

## Out of scope before Phase 16

- AWS resource creation and production deployment
- Multi-vendor marketplace behavior
- Public specialist registration
- Automatic WhatsApp bot messaging
- AI features
- Production Midtrans keys
- Fabricated testimonials, reviews, or client logos
