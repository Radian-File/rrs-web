import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectBriefForm } from "@/features/inquiries/project-brief-form";
import { prisma } from "@/lib/db/prisma";

export const dynamic="force-dynamic";
export default async function StartProjectPage({searchParams}:{searchParams:Promise<{service?:string}>}){const {service}=await searchParams;const services=await prisma.service.findMany({where:{isPublished:true},select:{slug:true,title:true},orderBy:{title:"asc"}});return <><SiteHeader/><main className="mx-auto max-w-[1000px] px-5 py-16 md:px-8"><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Project brief</p><h1 className="text-balance mt-4 font-display text-4xl font-extrabold tracking-[-0.045em] md:text-5xl">Tell me what you want to build.</h1><p className="mt-5 leading-7 text-secondary">This is not a checkout. Your brief creates an inquiry, then we continue the discussion on WhatsApp before any quotation is issued.</p></div><Card className="mt-10"><CardContent className="p-6 md:p-10"><ProjectBriefForm services={services} selectedService={service}/></CardContent></Card></main><SiteFooter/></>}
