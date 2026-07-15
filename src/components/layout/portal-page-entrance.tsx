"use client";

import { usePathname } from "next/navigation";
import { PageEntrance } from "@/components/page-entrance";

export function PortalPageEntrance({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return pathname === "/owner" || pathname === "/client" ? <PageEntrance>{children}</PageEntrance> : children;
}
