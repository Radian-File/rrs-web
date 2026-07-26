import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageEntrance } from "@/components/page-entrance";
import { AboutComposition } from "@/features/about/public/about-composition";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const isId = (await getLocale()) === "id";
  return {
    title: isId ? "Tentang RRS" : "About RRS",
    description: isId
      ? "Independent digital studio di Bandung dan Bekasi untuk product thinking, interface design, dan full-stack development."
      : "An independent digital studio in Bandung and Bekasi for product thinking, interface design, and full-stack development.",
  };
}

export default async function AboutPage() {
  const [locale, stackItems] = await Promise.all([
    getLocale(),
    prisma.studioStackItem.findMany({
      where: { isPublished: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, category: true },
    }),
  ]);
  const dictionary = getDictionary(locale);

  return (
    <>
      <SiteHeader />
      <PageEntrance>
        <AboutComposition
          copy={dictionary.about}
          isId={locale === "id"}
          stackItems={stackItems}
        />
      </PageEntrance>
      <SiteFooter />
    </>
  );
}
