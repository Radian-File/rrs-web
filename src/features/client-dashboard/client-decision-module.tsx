import Link from "next/link";
import { ArrowRight, FileCheck2, FolderKanban, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspaceDecisionModule } from "@/components/workspace/decision-module";
import { WorkspaceModule, WorkspaceModuleHeader } from "@/components/workspace/workspace-module";
import { WorkspaceRecordLink, WorkspaceRecordList } from "@/components/workspace/record-list";
import { cn } from "@/lib/utils";

export type ClientDashboardAction = {
  kind: "agreement" | "invoice" | "project" | "review" | "notifications";
  icon: LucideIcon;
  category: string;
  title: string;
  description: string;
  href: string;
  label: string;
  details: ReadonlyArray<{ label: string; value: string }>;
  supporting?: boolean;
  tone?: "warning";
};

type DecisionModuleCopy = {
  primaryEyebrow: string;
  primaryContext: string;
  queueEyebrow: string;
  queueTitle: string;
  contextEyebrow: string;
  contextTitle: string;
};

type EmptyWorkspaceCopy = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  pathEyebrow: string;
  pathTitle: string;
  pathSteps: readonly string[];
};

export function ClientDecisionModule({
  actions,
  copy,
}: {
  actions: readonly ClientDashboardAction[];
  copy: DecisionModuleCopy;
}) {
  const [primaryAction, ...remainingActions] = actions;

  if (!primaryAction) return null;

  const decisions = remainingActions.filter((action) => !action.supporting);
  const supportingActions = remainingActions.filter((action) => action.supporting);

  return (
    <>
      <WorkspaceDecisionModule
        titleId="client-primary-decision"
        icon={primaryAction.icon}
        eyebrow={copy.primaryEyebrow}
        category={primaryAction.category}
        title={primaryAction.title}
        description={primaryAction.description}
        href={primaryAction.href}
        actionLabel={primaryAction.label}
        contextLabel={copy.primaryContext}
        details={primaryAction.details}
        tone={primaryAction.tone === "warning" ? "warning" : "default"}
      />

      {(decisions.length > 0 || supportingActions.length > 0) && (
        <div
          className={cn(
            "mt-4 grid gap-4",
            decisions.length > 0 && supportingActions.length > 0 &&
              "xl:grid-cols-[minmax(0,1fr)_minmax(20rem,.46fr)]",
          )}
        >
          {decisions.length > 0 && <DecisionQueue actions={decisions} copy={copy} />}
          {supportingActions.length > 0 && <SupportingLinks actions={supportingActions} copy={copy} />}
        </div>
      )}
    </>
  );
}

function DecisionQueue({
  actions,
  copy,
}: {
  actions: readonly ClientDashboardAction[];
  copy: DecisionModuleCopy;
}) {
  return (
    <WorkspaceModule titleId="client-decision-queue" className="rounded-none">
      <WorkspaceModuleHeader
        titleId="client-decision-queue"
        eyebrow={copy.queueEyebrow}
        title={copy.queueTitle}
        className="px-5 py-4 sm:px-6 md:px-6 md:py-4"
        eyebrowClassName="text-[10px] tracking-[.18em]"
        titleClassName="mt-1.5 text-lg font-bold tracking-[-.025em]"
      />
      <WorkspaceRecordList>
        {actions.map((action) => (
          <WorkspaceRecordLink
            key={`${action.kind}-${action.href}`}
            href={action.href}
            icon={action.icon}
            eyebrow={action.category}
            title={action.title}
            description={action.description}
            iconClassName={cn(
              "size-10",
              action.tone === "warning"
                ? "border-warning/25 bg-warning-soft text-warning"
                : "border-border bg-surface-container text-primary",
            )}
            titleClassName="font-semibold leading-6"
            trailingClassName="font-bold text-primary"
            trailing={
              <>
                {action.label}
                <ArrowRight
                  className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </>
            }
            className="gap-4 px-5 py-5 sm:px-6 md:px-6"
          />
        ))}
      </WorkspaceRecordList>
    </WorkspaceModule>
  );
}

function SupportingLinks({
  actions,
  copy,
}: {
  actions: readonly ClientDashboardAction[];
  copy: DecisionModuleCopy;
}) {
  return (
    <WorkspaceModule
      as="aside"
      titleId="client-supporting-context"
      className="rounded-none bg-background"
    >
      <WorkspaceModuleHeader
        titleId="client-supporting-context"
        eyebrow={copy.contextEyebrow}
        title={copy.contextTitle}
        className="px-5 py-4 sm:px-6 md:px-6 md:py-4"
        eyebrowClassName="text-[10px] tracking-[.18em] text-muted"
        titleClassName="mt-1.5 text-lg font-bold tracking-[-.025em]"
      />
      <div className="divide-y divide-border">
        {actions.map((action) => (
          <Link
            key={`${action.kind}-${action.href}`}
            href={action.href}
            className="group flex min-h-24 items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-hover sm:px-6"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-surface text-primary">
              <action.icon className="size-[18px]" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-[.14em] text-muted">
                {action.category}
              </span>
              <span className="mt-1 block break-words text-sm font-semibold leading-5 text-foreground">{action.title}</span>
              <span className="mt-1 block break-words text-xs leading-5 text-secondary">
                {action.details.map((detail) => `${detail.label}: ${detail.value}`).join(" · ")}
              </span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-primary transition-transform motion-safe:group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </WorkspaceModule>
  );
}

export function ClientEmptyWorkspace({ copy }: { copy: EmptyWorkspaceCopy }) {
  return (
    <section className="mt-8 overflow-hidden border border-border bg-surface" aria-labelledby="client-empty-workspace">
      <div className="grid min-h-[420px] lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,.8fr)]">
        <div className="flex flex-col justify-between px-6 py-8 sm:p-10 lg:p-12">
          <div>
            <span className="grid size-12 place-items-center rounded-full border border-accent-lime/20 bg-accent-lime-soft text-accent-lime">
              <FolderKanban className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[.18em] text-primary">{copy.eyebrow}</p>
            <h2
              id="client-empty-workspace"
              className="mt-3 max-w-xl font-display text-3xl font-bold tracking-[-.045em] sm:text-4xl"
            >
              {copy.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-secondary sm:text-[15px]">{copy.description}</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/start-project">
                {copy.primaryLabel}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/services">{copy.secondaryLabel}</Link>
            </Button>
          </div>
        </div>

        <aside className="border-t border-border bg-accent-soft/55 px-6 py-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
          <span className="grid size-11 place-items-center rounded-full border border-primary/25 bg-background/35 text-primary">
            <FileCheck2 className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-8 text-[10px] font-bold uppercase tracking-[.18em] text-primary">{copy.pathEyebrow}</p>
          <h3 className="mt-3 max-w-sm font-display text-2xl font-bold tracking-[-.035em]">{copy.pathTitle}</h3>
          <ol className="mt-7 border-y border-border/80">
            {copy.pathSteps.map((step, index) => (
              <li key={step} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-border/80 py-4 last:border-b-0">
                <span className="pt-0.5 font-mono text-[10px] text-accent-lime">0{index + 1}</span>
                <span className="text-sm font-semibold leading-6 text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}
