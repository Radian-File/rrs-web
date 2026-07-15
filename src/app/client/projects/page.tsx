import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card,CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requireClient } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
export const dynamic="force-dynamic";
export default async function ClientProjectsPage(){const user=await requireClient();const projects=await prisma.project.findMany({where:{clientId:user.id},orderBy:{updatedAt:"desc"}});return <><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Projects</p><h1 className="mt-3 font-display text-3xl font-extrabold">Progress, files, milestones, and approvals.</h1>{projects.length===0?<EmptyState className="mt-8" icon={FolderKanban} title="No project workspace yet" description="A workspace is created automatically after a quotation is accepted."/>:<div className="mt-8 grid gap-4">{projects.map((project)=><Link key={project.id} href={`/client/projects/${project.id}`}><Card className="transition-all hover:-translate-y-0.5 hover:shadow-md"><CardContent className="flex justify-between gap-4"><div><p className="font-display text-lg font-extrabold">{project.title}</p><p className="mt-1 text-xs text-secondary">{project.projectNumber}</p></div><Badge>{project.status.replaceAll("_"," ")}</Badge></CardContent></Card></Link>)}</div>}</>}
