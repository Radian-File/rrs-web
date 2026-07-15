import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Card,CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requireClient } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
export const dynamic="force-dynamic";
export default async function ClientMessagesPage(){const user=await requireClient();const projects=await prisma.project.findMany({where:{clientId:user.id},include:{messages:{orderBy:{createdAt:"desc"},take:1}},orderBy:{updatedAt:"desc"}});return <><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Messages</p><h1 className="mt-3 font-display text-3xl font-extrabold">Project conversations with context.</h1>{projects.length===0?<EmptyState className="mt-8" icon={MessageSquare} title="No project conversation" description="Messages are organized by accepted project instead of detached public chat."/>:<div className="mt-8 space-y-4">{projects.map((project)=><Link key={project.id} href={`/client/projects/${project.id}`}><Card className="transition-all hover:-translate-y-0.5 hover:shadow-md"><CardContent><p className="font-display text-lg font-extrabold">{project.title}</p><p className="mt-2 truncate text-sm text-secondary">{project.messages[0]?.message??"Open the project to start the conversation."}</p></CardContent></Card></Link>)}</div>}</>}
