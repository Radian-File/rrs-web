import Link from "next/link";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
export default async function NotFound(){const dictionary=getDictionary(await getLocale());return <main className="grid min-h-screen place-items-center px-5"><div className="max-w-lg text-center"><Brand className="justify-center"/><p className="mt-10 font-display text-7xl font-extrabold text-primary/20">404</p><h1 className="mt-4 font-display text-3xl font-extrabold">{dictionary.errors.notFoundTitle}</h1><p className="mt-4 leading-7 text-secondary">{dictionary.errors.notFoundDescription}</p><Button asChild className="mt-7"><Link href="/">{dictionary.errors.home}</Link></Button></div></main>}
