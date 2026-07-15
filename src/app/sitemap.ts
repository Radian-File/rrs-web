import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";
export default function sitemap():MetadataRoute.Sitemap{const routes=["","/services","/portfolio","/about","/contact","/reviews","/start-project"];return routes.map((route)=>({url:`${publicEnv.appUrl}${route}`,lastModified:new Date(),changeFrequency:route===""?"weekly":"monthly",priority:route===""?1:0.7}))}
