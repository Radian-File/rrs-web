import Link from "next/link";
import { Menu } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";

const links = [
  ["Services", "/services"],
  ["Portfolio", "/portfolio"],
  ["How It Works", "/#process"],
  ["Reviews", "/reviews"],
  ["About", "/about"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 md:px-8 lg:px-16">
        <Brand />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-medium text-secondary transition-colors hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/start-project">Start a Project</Link>
          </Button>
          <details className="group relative lg:hidden">
            <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-[10px] transition-colors hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden" aria-label="Open navigation menu">
              <Menu className="size-5" />
            </summary>
            <nav className="absolute right-0 top-12 w-56 rounded-[14px] border border-border bg-surface p-2 shadow-xl" aria-label="Mobile navigation">
              {links.map(([label, href]) => (
                <Link key={href} href={href} className="block rounded-[8px] px-3 py-2.5 text-sm font-medium text-secondary hover:bg-accent-soft hover:text-primary">
                  {label}
                </Link>
              ))}
              <Link href="/login" className="mt-1 block border-t border-border px-3 pt-3 text-sm font-semibold text-primary sm:hidden">Sign In</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
