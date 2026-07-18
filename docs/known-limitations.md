# Known Limitations After Phase 15

- Tencent Cloud CVM self-hosted deployment configuration exists, but no staging or production deployment has been performed.
- Storage uses a private local Docker volume; backup/restore rehearsal is required and COS/S3-compatible storage remains a future scale option.
- Email delivery uses the console adapter; an approved production provider and worker activation are pending.
- Midtrans is Sandbox-only and requires user-provided sandbox keys for a live Snap checkout.
- Webhook signature verification is implemented; production should additionally reconcile against Midtrans GET Status API.
- Rate limiting is process-local and assumes the initial single-instance/single-process deployment.
- Owner MFA and password-reset email are not implemented.
- Automatic WhatsApp messaging is intentionally not implemented; the application generates deep links only.
- PDF output currently uses browser print/save-as-PDF rather than a server-side PDF renderer.
- Final brand assets, portfolio case studies, legal text, service copy, owner contact details, and production domain remain user-provided content.
- Public reviews remain empty until real completed projects submit verified feedback.
- Automated email queue processing is owner-triggered locally; a scheduled worker is a Phase 16 concern.
- Public review submission and recent payment/project controls return recoverable inline validation states. Remaining lower-risk Owner/client server-action forms should be migrated to the same pattern incrementally rather than in one high-risk rewrite.
