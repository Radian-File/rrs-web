import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { AgreementDocument } from "@/components/agreement-document";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { normalizeAgreementSnapshot } from "@/features/agreements/content";
import { acceptAgreementAction } from "@/features/projects/actions";
import { getLocale } from "@/i18n/server";
import { requireClient } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ClientAgreementPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ accepted?: string }> }) {
  const [user, { id }, { accepted }, locale] = await Promise.all([requireClient(), params, searchParams, getLocale()]);
  const project = await prisma.project.findFirst({ where: { id, clientId: user.id }, include: { agreement: true } });
  if (!project?.agreement) notFound();
  const snapshot = normalizeAgreementSnapshot(project.agreement.contentSnapshot);
  const pending = project.agreement.status === "PENDING" && project.status === "AWAITING_AGREEMENT";

  return <>
    <div className="flex flex-col justify-between gap-5 border-b border-border pb-8 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Project agreement</p><h1 className="mt-3 font-display text-3xl font-extrabold">Review before accepting.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">This private document records the scope, payment schedule, and collaboration terms for your project.</p></div><Button asChild variant="outline"><Link href={`/client/projects/${project.id}`}>Back to project</Link></Button></div>
    {accepted === "1" && <div role="status" className="mt-6 flex gap-3 rounded-[12px] border border-success/25 bg-[#e5f3eb] p-4 text-sm text-success"><CheckCircle2 className="mt-0.5 size-5 shrink-0" /><p><strong>Agreement accepted.</strong> The project can now continue to the initial payment stage.</p></div>}
    <AgreementDocument agreement={project.agreement} project={project} snapshot={snapshot} locale={locale} />
    {pending && <Card className="mt-6 border-primary/25 bg-accent-soft"><CardContent><h2 className="font-display text-xl font-extrabold">Ready to accept this agreement?</h2><p className="mt-3 text-sm leading-6 text-secondary">By accepting, you confirm that you have reviewed this document, including the project scope, payment schedule, and collaboration terms.</p><form action={acceptAgreementAction} className="mt-5"><input type="hidden" name="projectId" value={project.id} /><input type="hidden" name="agreementVersion" value={project.agreement.version} /><label className="flex items-start gap-3 text-sm"><input name="acceptTerms" type="checkbox" required className="mt-1" />I have read and agree to this project agreement.</label><Button className="mt-5">Accept Agreement</Button></form></CardContent></Card>}
  </>;
}
