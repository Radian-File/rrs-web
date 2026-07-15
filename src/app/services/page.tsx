import Link from "next/link";
import { ArrowRight, Clock3, Search } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q, category } = await searchParams;
  const services = await prisma.service.findMany({
    where: {
      isPublished: true,
      ...(category ? { category } : {}),
      ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { summary: { contains: q, mode: "insensitive" } }, { technologies: { has: q } }] } : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { title: "asc" }],
  });
  const categories = [...new Set(services.map((service) => service.category))];

  return <><SiteHeader /><main><section className="border-b border-border"><div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 lg:px-16"><Badge>Curated services</Badge><h1 className="text-balance mt-5 max-w-4xl font-display text-5xl font-extrabold tracking-[-0.05em] md:text-6xl">Expertise for digital projects that need a clear process.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-secondary">Browse capabilities and starting estimates. Every final scope, timeline, and price is prepared as a quotation after discussion.</p><form className="relative mt-9 max-w-2xl"><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-secondary" /><Input name="q" defaultValue={q} placeholder="Search web development, design, or technology" className="h-14 pl-12 pr-28" /><Button size="sm" className="absolute right-2 top-2 h-10">Search</Button></form><div className="mt-5 flex flex-wrap gap-2"><Link href="/services"><Badge variant={!category ? "default" : "neutral"}>All</Badge></Link>{categories.map((item) => <Link key={item} href={`/services?category=${encodeURIComponent(item)}`}><Badge variant={category === item ? "default" : "neutral"}>{item}</Badge></Link>)}</div></div></section><section className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 lg:px-16"><div className="grid gap-5 lg:grid-cols-3">{services.map((service) => <Card key={service.id} className="group transition-all hover:-translate-y-1 hover:shadow-lg"><CardContent className="flex h-full flex-col"><div className="h-44 rounded-[10px] bg-[linear-gradient(145deg,#e8f0ec,#d6e4dc)]" /><p className="mt-6 text-xs font-bold uppercase tracking-[.13em] text-primary">{service.category}</p><h2 className="mt-3 font-display text-xl font-extrabold">{service.title}</h2><p className="mt-3 text-sm leading-6 text-secondary">{service.summary}</p><div className="mt-5 flex flex-wrap gap-2">{service.technologies.slice(0, 3).map((tag) => <Badge key={tag} variant="neutral">{tag}</Badge>)}</div><div className="mt-auto flex items-end justify-between border-t border-border pt-6"><div><p className="text-xs text-secondary">Starting from</p><p className="mt-1 font-display text-lg font-extrabold">{service.startingPrice ? formatIdr(service.startingPrice.toString()) : "Custom scope"}</p></div><span className="flex items-center gap-1 text-xs text-secondary"><Clock3 className="size-4" />{service.deliveryEstimate}</span></div><Button asChild variant="outline" className="mt-6 w-full"><Link href={`/services/${service.slug}`}>View Service <ArrowRight className="size-4" /></Link></Button></CardContent></Card>)}</div>{services.length === 0 && <div className="rounded-[20px] border border-dashed border-border p-12 text-center"><h2 className="font-display text-xl font-extrabold">No matching service</h2><p className="mt-2 text-sm text-secondary">Try a broader search or start a custom project brief.</p></div>}</section></main><SiteFooter /></>;
}
