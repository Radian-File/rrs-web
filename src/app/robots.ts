import type { MetadataRoute } from "next";
import { getServerAppUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const appUrl = getServerAppUrl().replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/services/", "/cara-kerja", "/about", "/contact", "/reviews"],
      disallow: [
        "/owner/",
        "/client/",
        "/api/",
        "/quotation/",
        "/review/",
        "/brief-submitted",
        "/start-project",
        "/login",
        "/register",
        "/auth/",
      ],
    },
    sitemap: `${appUrl}/sitemap.xml`,
    host: appUrl,
  };
}
