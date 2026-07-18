import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const pageSize = 12;
export function parsePage(value?: string) { const page = Number(value); return Number.isInteger(page) && page > 0 ? page : 1; }
export function PaginationControls({ pathname, page, hasNext }: { pathname: string; page: number; hasNext: boolean }) { const href = (next: number) => `${pathname}?page=${next}`; if (page === 1 && !hasNext) return null; return <nav className="mt-8 flex items-center justify-between gap-4" aria-label="Pagination"><Button asChild variant="outline" size="sm" disabled={page === 1}><Link href={href(Math.max(1, page - 1))} aria-disabled={page === 1}><ArrowLeft className="size-4"/>Previous</Link></Button><p className="text-sm text-secondary">Page {page}</p><Button asChild variant="outline" size="sm" disabled={!hasNext}><Link href={href(page + 1)} aria-disabled={!hasNext}>Next<ArrowRight className="size-4"/></Link></Button></nav>; }
