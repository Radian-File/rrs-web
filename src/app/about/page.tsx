import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { PageEntrance } from "@/components/page-entrance";

export default async function AboutPage(){const locale=await getLocale();const dictionary=getDictionary(locale);const sections=[[dictionary.about.identityTitle,dictionary.about.identity],[dictionary.about.approachTitle,dictionary.about.approach],[dictionary.about.capabilityTitle,dictionary.about.capability],[dictionary.about.collaborationTitle,dictionary.about.collaboration]];return <><SiteHeader/><PageEntrance><main className="mx-auto max-w-[1100px] px-5 py-20 md:px-8"><Badge>{dictionary.about.badge}</Badge><h1 className="text-balance mt-5 max-w-5xl font-display text-5xl font-extrabold tracking-[-0.05em] md:text-6xl">{dictionary.about.title}</h1><p className="mt-8 max-w-3xl text-lg leading-8 text-secondary">{dictionary.about.intro}</p><div data-reveal-group className="mt-14 grid gap-5 md:grid-cols-2">{sections.map(([title,description])=><Card key={title} data-reveal-item data-motion-card><CardContent><h2 className="font-display text-xl font-extrabold">{title}</h2><p className="mt-4 leading-7 text-secondary">{description}</p></CardContent></Card>)}</div><div className="mt-14 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><a href="https://rrs-porto.vercel.app" target="_blank" rel="noreferrer"><ExternalLink className="size-4"/>{dictionary.about.portfolioCta}</a></Button><Button asChild size="lg" variant="outline"><Link href="/services">{dictionary.about.servicesCta}</Link></Button></div></main></PageEntrance><SiteFooter/></>}
