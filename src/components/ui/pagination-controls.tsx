import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const pageSize = 12;
export function parsePage(value?: string) { const page = Number(value); return Number.isInteger(page) && page > 0 ? page : 1; }
export function PaginationControls({ pathname, page, hasNext, params = {} }: { pathname: string; page: number; hasNext: boolean; params?: Record<string, string | undefined> }) {
  const href = (next: number) => { const search = new URLSearchParams(Object.entries({ ...params, page: String(next) }).filter(([, value]) => value)); return `${pathname}?${search.toString()}`; };
  if (page === 1 && !hasNext) return null;
  return <nav className="mt-8 flex items-center justify-between gap-4" aria-label="Pagination">{page > 1 ? <Button asChild variant="outline" size="sm"><Link href={href(page - 1)}><ArrowLeft className="size-4"/>Previous</Link></Button> : <Button variant="outline" size="sm" disabled><ArrowLeft className="size-4"/>Previous</Button>}<p className="text-sm text-secondary">Page {page}</p>{hasNext ? <Button asChild variant="outline" size="sm"><Link href={href(page + 1)}>Next<ArrowRight className="size-4"/></Link></Button> : <Button variant="outline" size="sm" disabled>Next<ArrowRight className="size-4"/></Button>}</nav>;
}
