import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { requireClient } from "@/lib/authz";

export default async function ClientDashboard() {
  const [client, locale] = await Promise.all([requireClient(), getLocale()]);
  const dictionary = getDictionary(locale);

  return <>
    <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">{dictionary.dashboard.clientEyebrow}</p>
    <h1 className="mt-3 font-display text-3xl font-extrabold">{dictionary.dashboard.clientWelcome}, {client.name.split(" ")[0] ?? "Client"}.</h1>
    <p className="mt-3 text-secondary">{dictionary.dashboard.clientDescription}</p>
    <EmptyState className="mt-8" icon={FolderKanban} title={dictionary.dashboard.noActiveProject} description={dictionary.dashboard.noActiveProjectDescription} />
    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg"><Link href="/services">{dictionary.dashboard.exploreServices}<ArrowRight className="size-4" /></Link></Button>
      <Button asChild size="lg" variant="outline"><Link href="/start-project">{dictionary.dashboard.startProject}<ArrowRight className="size-4" /></Link></Button>
    </div>
  </>;
}
