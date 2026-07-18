import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Brand } from "@/components/brand";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewForm } from "@/features/reviews/review-form";
import { hashPublicToken } from "@/lib/security/tokens";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function ReviewInvitationPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ submitted?: string }> }) {
  const { token } = await params;
  const { submitted } = await searchParams;
  const invitation = await prisma.reviewInvitation.findUnique({ where: { tokenHash: hashPublicToken(token) }, include: { project: true, review: true } });
  if (!invitation || invitation.revokedAt || invitation.expiresAt < new Date()) notFound();
  if (submitted || invitation.review) return <main className="grid min-h-screen place-items-center px-5"><Card className="max-w-lg"><CardContent className="p-10 text-center"><CheckCircle2 className="mx-auto size-12 text-success" /><h1 className="mt-5 font-display text-3xl font-extrabold">Thank you for the project review.</h1><p className="mt-3 leading-7 text-secondary">The submission is pending moderation before it can appear publicly as a verified review.</p></CardContent></Card></main>;

  return <main className="mx-auto min-h-screen max-w-2xl px-5 py-12"><Brand /><Card className="mt-8"><CardContent className="p-7 md:p-10"><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Verified project review</p><h1 className="mt-3 font-display text-3xl font-extrabold">How was the {invitation.project.title} project?</h1><p className="mt-3 text-sm leading-6 text-secondary">This invitation is tied to completed project {invitation.project.projectNumber}. Ratings must reflect your own experience.</p><ReviewForm token={token} /></CardContent></Card></main>;
}
