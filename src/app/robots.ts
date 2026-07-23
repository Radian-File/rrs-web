import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/services/", "/portfolio", "/cara-kerja", "/about", "/contact", "/reviews"],
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
    sitemap: `${publicEnv.appUrl}/sitemap.xml`,
    host: publicEnv.appUrl,
  };
}
