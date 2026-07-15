import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock3, MessageCircle, RefreshCw } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const isId = locale === "id";
  const service = await prisma.service.findFirst({ where: { slug, isPublished: true } });
  if (!service) notFound();
  return <><SiteHeader /><main className="mx-auto max-w-[1280px] px-5 py-10 md:px-8 lg:px-16"><Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary"><ArrowLeft className="size-4" />{isId ? "Semua layanan" : "All services"}</Link><div className="mt-8 grid gap-12 lg:grid-cols-[1fr_360px]"><div><Badge>{service.category}</Badge><h1 className="text-balance mt-5 font-display text-4xl font-extrabold tracking-[-0.045em] md:text-6xl">{service.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-secondary">{service.summary}</p><div className="mt-10 aspect-[16/8] rounded-[20px] bg-[linear-gradient(145deg,#dce9e1,#f2f4f0)]" /><section className="mt-12"><h2 className="font-display text-2xl font-extrabold">{isId ? "Ringkasan layanan" : "Service overview"}</h2><p className="mt-5 whitespace-pre-line leading-8 text-secondary">{service.description}</p></section><section className="mt-12"><h2 className="font-display text-2xl font-extrabold">{isId ? "Yang dapat dikerjakan" : "What can be delivered"}</h2><ul className="mt-6 grid gap-3 sm:grid-cols-2">{service.deliverables.map((item) => <li key={item} className="flex items-start gap-3 rounded-[12px] border border-border bg-surface p-4 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{item}</li>)}</ul></section><section className="mt-12"><h2 className="font-display text-2xl font-extrabold">{isId ? "Teknologi dan keahlian" : "Technology and expertise"}</h2><div className="mt-5 flex flex-wrap gap-2">{service.technologies.map((item) => <Badge key={item} variant="neutral">{item}</Badge>)}</div></section></div><aside><Card className="sticky top-24"><CardContent className="p-7"><p className="text-sm text-secondary">{isId ? "Mulai dari" : "Starting from"}</p><p className="mt-2 font-display text-3xl font-extrabold text-primary">{service.startingPrice ? formatIdr(service.startingPrice.toString()) : isId ? "Scope khusus" : "Custom scope"}</p><p className="mt-3 text-sm leading-6 text-secondary">{isId ? "Harga final mengikuti scope yang disepakati dalam quotation." : "Final pricing follows the agreed scope and quotation."}</p><div className="mt-7 space-y-4 border-y border-border py-6 text-sm"><div className="flex items-center gap-3"><Clock3 className="size-4 text-primary" /><div><p className="text-xs text-secondary">{isId ? "Estimasi pengerjaan" : "Estimated delivery"}</p><p className="font-semibold">{service.deliveryEstimate ?? (isId ? "Dibahas setelah brief" : "Discussed after brief")}</p></div></div><div className="flex items-center gap-3"><RefreshCw className="size-4 text-primary" /><div><p className="text-xs text-secondary">{isId ? "Revisi" : "Revisions"}</p><p className="font-semibold">{service.revisionGuidance ?? (isId ? "Ditentukan dalam quotation" : "Defined in quotation")}</p></div></div></div><Button asChild size="lg" className="mt-7 w-full"><Link href={`/start-project?service=${service.slug}`}>{isId ? "Minta quotation" : "Request Quotation"}</Link></Button><Button asChild size="lg" variant="outline" className="mt-3 w-full"><Link href="/contact"><MessageCircle className="size-4" />{isId ? "Hubungi RRS" : "Contact RRS"}</Link></Button></CardContent></Card></aside></div></main><SiteFooter /></>;
}
