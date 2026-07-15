# Phase 16 Handoff — AWS Deployment

Phase 1–15 prepares provider boundaries but does not create infrastructure.

## Planned AWS topology

```text
Route 53 / Domain
→ EC2
  → Nginx + HTTPS
  → Next.js application
  → PostgreSQL container (initial deployment)

Private files → Amazon S3
Email → Amazon SES
Logs/metrics/alarms → CloudWatch
CI/CD → GitHub Actions
Backups → pg_dump → encrypted S3
```

## Safe activation order

1. Enable AWS Budget and billing alerts.
2. Select one region and define project/environment/owner tags.
3. Create EC2, security group, Elastic IP, Docker, and persistent volume.
4. Configure PostgreSQL backup and perform restore rehearsal.
5. Configure Nginx, HTTPS, health check, and trusted proxy headers.
6. Implement/activate S3 storage provider with private bucket and signed downloads.
7. Activate SES domain/sender and background notification delivery.
8. Configure Route 53/domain.
9. Add GitHub Actions quality gates and controlled deployment.
10. Add CloudWatch metrics/log retention/alarms.
11. Configure Midtrans production keys and HTTPS webhook after business approval.
12. Run production smoke, authorization, upload, payment, backup, and rollback tests.

## Cost controls

- Target initial monthly cost: $15–$20
- Budget alerts: 50%, 80%, 100%
- Avoid NAT Gateway, Load Balancer, Multi-AZ RDS, idle Elastic IP, and unlimited log retention initially.
- RDS remains an optional upgrade based on reliability, traffic, and budget.

## Application changes expected in Phase 16

- Add S3 provider implementation behind the existing storage boundary.
- Add SES provider implementation behind the existing email boundary.
- Add shared rate-limit storage if multiple processes are deployed.
- Add production environment validation and readiness command.
- Add Midtrans GET Status API reconciliation.
- Add deployment, health, backup, restore, and rollback scripts.
