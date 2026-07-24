import type { MetadataRoute } from "next";
import { getServerAppUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{ path: string; priority: number; frequency: "weekly" | "monthly" }> = [
    { path: "", priority: 1, frequency: "weekly" },
    { path: "/services", priority: 0.9, frequency: "weekly" },
    { path: "/portfolio", priority: 0.8, frequency: "monthly" },
    { path: "/cara-kerja", priority: 0.8, frequency: "monthly" },
    { path: "/reviews", priority: 0.7, frequency: "monthly" },
    { path: "/about", priority: 0.7, frequency: "monthly" },
    { path: "/contact", priority: 0.6, frequency: "monthly" },
  ];
  const now = new Date();
  const appUrl = getServerAppUrl().replace(/\/$/, "");
  return routes.map((route) => ({
    url: `${appUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.frequency,
    priority: route.priority,
  }));
}
