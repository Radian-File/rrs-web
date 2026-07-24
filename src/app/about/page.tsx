import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageEntrance } from "@/components/page-entrance";
import { AboutComposition } from "@/features/about/public/about-composition";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

const professionalPortfolio = "https://rrs-porto.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const isId = (await getLocale()) === "id";
  return {
    title: isId ? "Tentang RRS" : "About RRS",
    description: isId
      ? "Independent digital studio di Bekasi untuk product thinking, interface design, dan full-stack development."
      : "An independent digital studio in Bekasi for product thinking, interface design, and full-stack development.",
  };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);

  return (
    <>
      <SiteHeader />
      <PageEntrance>
        <AboutComposition
          copy={dictionary.about}
          isId={locale === "id"}
          portfolioUrl={professionalPortfolio}
        />
      </PageEntrance>
      <SiteFooter />
    </>
  );
}
