import { auth } from "@/auth";
import { EmptyState } from "@/components/ui/empty-state";
import { FolderKanban } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export default async function ClientDashboard() { const [session,locale]=await Promise.all([auth(),getLocale()]);const dictionary=getDictionary(locale);return <><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">{dictionary.dashboard.clientEyebrow}</p><h1 className="mt-3 font-display text-3xl font-extrabold">{dictionary.dashboard.clientWelcome}, {session?.user.name?.split(" ")[0] ?? "Client"}.</h1><p className="mt-3 text-secondary">{dictionary.dashboard.clientDescription}</p><EmptyState className="mt-8" icon={FolderKanban} title={dictionary.dashboard.noActiveProject} description={dictionary.dashboard.noActiveProjectDescription} /></>; }
