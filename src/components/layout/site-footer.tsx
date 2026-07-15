import Link from "next/link";
import { Brand } from "@/components/brand";

const groups = [
  { title: "Services", links: [["Web Development", "/services"], ["UI/UX Design", "/services"], ["Web Applications", "/services"]] },
  { title: "For Clients", links: [["How It Works", "/#process"], ["Start a Project", "/start-project"], ["Client Portal", "/login"]] },
  { title: "Company", links: [["About", "/about"], ["Contact", "/contact"], ["Privacy", "/privacy"], ["Terms", "/terms"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-8 lg:px-16">
        <div>
          <Brand />
          <p className="mt-4 max-w-sm text-sm leading-6 text-secondary">Professional digital services with a clearer process—from the first brief to final delivery.</p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-bold">{group.title}</h2>
            <ul className="mt-4 space-y-3">
              {group.links.map(([label, href]) => (
                <li key={label}><Link href={href} className="text-sm text-secondary transition-colors hover:text-primary">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-5 py-6 text-center text-xs text-secondary">© 2026 RRS Freelancer. Built for transparent collaboration.</div>
    </footer>
  );
}
