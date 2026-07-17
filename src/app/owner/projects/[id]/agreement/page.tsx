import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgreementDocument } from "@/components/agreement-document";
import { Button } from "@/components/ui/button";
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

  return <><div className="flex flex-col justify-between gap-5 border-b border-border pb-8 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Agreement record</p><h1 className="mt-3 font-display text-3xl font-extrabold">Immutable client agreement.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">This protected record shows the snapshot that the client reviewed and accepted for this project.</p></div><Button asChild variant="outline"><Link href={`/owner/projects/${project.id}`}>Back to project</Link></Button></div><AgreementDocument agreement={project.agreement} project={project} snapshot={snapshot} locale={locale} showAudit /></>;
}
