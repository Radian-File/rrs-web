import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgreementDocument } from "@/components/agreement-document";
import { Button } from "@/components/ui/button";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { normalizeAgreementSnapshot } from "@/features/agreements/content";
import { getLocale } from "@/i18n/server";
import { requireOwner } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function OwnerAgreementPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, locale] = await Promise.all([params, getLocale(), requireOwner()]);
  const project = await prisma.project.findUnique({ where: { id }, include: { agreement: true } });
  if (!project?.agreement) notFound();
  const snapshot = normalizeAgreementSnapshot(project.agreement.contentSnapshot);

  return <><WorkspacePageHeader eyebrow="Agreement record" title="Immutable Client agreement." description="This protected record shows the snapshot that the Client reviewed and accepted for this project." actions={<Button asChild variant="outline"><Link href={`/owner/projects/${project.id}`}>Back to project</Link></Button>}/><AgreementDocument agreement={project.agreement} project={project} snapshot={snapshot} locale={locale} showAudit /></>;
}
