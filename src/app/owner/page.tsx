import { getOwnerDashboardData } from "@/features/owner-dashboard/data";
import { OwnerCommandCenter } from "@/features/owner-dashboard/owner-command-center";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function OwnerDashboard() {
  const [locale, data] = await Promise.all([
    getLocale(),
    getOwnerDashboardData(),
  ]);

  return <OwnerCommandCenter data={data} locale={locale} />;
}
