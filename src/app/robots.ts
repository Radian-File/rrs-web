import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:["/","/services/","/portfolio/","/about","/contact","/reviews"],disallow:["/owner/","/client/","/api/","/quotation/","/brief-submitted"]},sitemap:`${publicEnv.appUrl}/sitemap.xml`}}
