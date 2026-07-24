import Decimal from "decimal.js";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CreditCard,
  FileText,
  FolderKanban,
  MessageSquareText,
  Plus,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type {
  ActiveProjectStatus,
  OwnerDashboardData,
  RecordedActivityEvent,
  RecordedActivitySource,
} from "@/features/owner-dashboard/types";

const dashboardCopy = {
  en: {
    eyebrow: "Owner command center",
    title: "Operations, in their current state.",
    description:
      "A focused view of live records, open receivables, and the limited event streams already recorded by RRS.",
    createQuotation: "Create quotation",
    openAnalytics: "Open analytics",
    attentionEyebrow: "Attention now",
    attentionTitle: "Verification queue",
    verificationLabel: "Payment proofs awaiting verification",
    verificationEmpty: "No manual payment proof is waiting for verification.",
    verificationPending:
      "Manual payment proof records are waiting for an Owner decision.",
    reviewPayments: "Review payment records",
    activeQueues: "Current operational queues",
    activeInquiries: "Active inquiries",
    currentQuotations: "Open current quotations",
    exactQueueNote:
      "Exact current counts only. No deadline, risk, or priority is inferred.",
    stateEyebrow: "Current work / exact state",
    stateTitle: "Current operational state",
    currentScope: "Current snapshot",
    outstandingLabel: "Current outstanding receivable",
    outstandingScope:
      "Remaining amount across every open invoice, kept separate by currency.",
    noOpenInvoices: "No open invoice currently contributes to receivables.",
    activeProjects: "Active projects",
    publishedServices: "Published services",
    catalogueLink: "Open service catalogue",
    workflowRecords: "Current workflow records",
    workflowNote:
      "These are independent current-state counts—not a cohort funnel or conversion model.",
    distributionEyebrow: "Delivery workload",
    distributionTitle: "Active project distribution",
    distributionDescription:
      "Every active project is represented once by its current status.",
    noActiveProjects: "No active project is currently recorded.",
    activityEyebrow: "Recorded operations",
    activityTitle: "Recent recorded activity",
    activityDescription:
      "Allowlisted events from Inquiry, Quotation, and Project activity tables.",
    activityLimit: "Bounded · latest 6 maximum",
    noActivityTitle: "No safe recorded activity available",
    noActivityDescription:
      "No allowlisted event is available yet. Record timestamps are not substituted, and this panel does not claim a complete history.",
    activityDisclosure:
      "Descriptions and metadata are intentionally excluded. This is a partial recorded stream, not a complete audit log.",
    quickEyebrow: "Route-backed actions",
    quickTitle: "Continue the workflow",
    quickDescription:
      "Each action opens an existing authoritative Owner route; no new business action is introduced here.",
    createQuotationTitle: "Create quotation",
    createQuotationDescription: "Prepare scope and price before commitment.",
    reviewInquiriesTitle: "Review inquiries",
    reviewInquiriesDescription: "Open the active request workspace.",
    verifyPaymentsTitle: "Verify payments",
    verifyPaymentsDescription: "Review provider attempts and manual proofs.",
    manageServicesTitle: "Manage services",
    manageServicesDescription: "Maintain the published public catalogue.",
  },
  id: {
    eyebrow: "Pusat kendali owner",
    title: "Operasional, dalam kondisi terkini.",
    description:
      "Tampilan terfokus untuk record aktif, piutang terbuka, dan aliran event terbatas yang sudah tercatat di RRS.",
    createQuotation: "Buat quotation",
    openAnalytics: "Buka analitik",
    attentionEyebrow: "Perlu diperhatikan",
    attentionTitle: "Antrean verifikasi",
    verificationLabel: "Bukti pembayaran menunggu verifikasi",
    verificationEmpty: "Tidak ada bukti pembayaran manual yang menunggu verifikasi.",
    verificationPending:
      "Record bukti pembayaran manual sedang menunggu keputusan Owner.",
    reviewPayments: "Tinjau record pembayaran",
    activeQueues: "Antrean operasional saat ini",
    activeInquiries: "Inquiry aktif",
    currentQuotations: "Quotation aktif terkini",
    exactQueueNote:
      "Hanya hitungan kondisi saat ini. Tidak ada deadline, risiko, atau prioritas yang diasumsikan.",
    stateEyebrow: "Pekerjaan aktif / kondisi pasti",
    stateTitle: "Kondisi operasional saat ini",
    currentScope: "Snapshot saat ini",
    outstandingLabel: "Piutang berjalan saat ini",
    outstandingScope:
      "Sisa nilai seluruh invoice terbuka, tetap dipisahkan berdasarkan mata uang.",
    noOpenInvoices: "Tidak ada invoice terbuka yang membentuk piutang saat ini.",
    activeProjects: "Project aktif",
    publishedServices: "Layanan published",
    catalogueLink: "Buka katalog layanan",
    workflowRecords: "Record workflow saat ini",
    workflowNote:
      "Ini adalah hitungan kondisi record yang berdiri sendiri—bukan funnel cohort atau model konversi.",
    distributionEyebrow: "Workload delivery",
    distributionTitle: "Distribusi project aktif",
    distributionDescription:
      "Setiap project aktif diwakili satu kali oleh statusnya saat ini.",
    noActiveProjects: "Belum ada project aktif yang tercatat.",
    activityEyebrow: "Operasional tercatat",
    activityTitle: "Aktivitas tercatat terbaru",
    activityDescription:
      "Event yang diizinkan dari tabel aktivitas Inquiry, Quotation, dan Project.",
    activityLimit: "Terbatas · maksimal 6 terbaru",
    noActivityTitle: "Belum ada aktivitas tercatat yang aman",
    noActivityDescription:
      "Belum ada event yang diizinkan. Timestamp record tidak digunakan sebagai pengganti dan panel ini tidak mengklaim riwayat lengkap.",
    activityDisclosure:
      "Deskripsi dan metadata sengaja tidak dimuat. Ini adalah aliran record parsial, bukan audit log lengkap.",
    quickEyebrow: "Aksi berbasis route",
    quickTitle: "Lanjutkan workflow",
    quickDescription:
      "Setiap aksi membuka route Owner yang sudah authoritative; tidak ada business action baru di halaman ini.",
    createQuotationTitle: "Buat quotation",
    createQuotationDescription: "Siapkan scope dan harga sebelum komitmen.",
    reviewInquiriesTitle: "Tinjau inquiry",
    reviewInquiriesDescription: "Buka workspace permintaan aktif.",
    verifyPaymentsTitle: "Verifikasi pembayaran",
    verifyPaymentsDescription: "Tinjau percobaan provider dan bukti manual.",
    manageServicesTitle: "Kelola layanan",
    manageServicesDescription: "Pertahankan katalog publik yang published.",
  },
} as const;

const projectStatusLabels: Record<
  Locale,
  Record<ActiveProjectStatus, string>
> = {
  en: {
    AWAITING_AGREEMENT: "Awaiting agreement",
    AWAITING_DOWN_PAYMENT: "Awaiting down payment",
    PLANNING: "Planning",
    IN_PROGRESS: "In progress",
    CLIENT_REVIEW: "Client review",
    REVISION: "Revision",
    ON_HOLD: "On hold",
  },
  id: {
    AWAITING_AGREEMENT: "Menunggu agreement",
    AWAITING_DOWN_PAYMENT: "Menunggu pembayaran awal",
    PLANNING: "Perencanaan",
    IN_PROGRESS: "Sedang dikerjakan",
    CLIENT_REVIEW: "Review client",
    REVISION: "Revisi",
    ON_HOLD: "Ditahan",
  },
};

const activityEventLabels: Record<
  Locale,
  Record<RecordedActivityEvent, string>
> = {
  en: {
    "inquiry-submitted": "Inquiry submitted",
    "inquiry-status-updated": "Inquiry status updated",
    "inquiry-quotation-sent": "Quotation recorded from inquiry",
    "record-archived": "Record archived",
    "record-restored": "Record restored",
    "quotation-created": "Quotation created",
    "quotation-draft-updated": "Quotation draft updated",
    "quotation-sent": "Quotation sent",
    "quotation-viewed": "Quotation viewed",
    "quotation-revision-requested": "Quotation revision requested",
    "quotation-rejected": "Quotation rejected",
    "quotation-accepted": "Quotation accepted",
    "quotation-link-regenerated": "Secure quotation link regenerated",
    "quotation-version-created": "Quotation version created",
    "quotation-discussion-recorded": "Quotation discussion recorded",
    "project-agreement-accepted": "Project agreement accepted",
    "project-status-updated": "Project status updated",
    "project-delivery-approved": "Project delivery approved",
    "project-review-submitted": "Verified review submitted",
    "project-review-invitation-reissued": "Review invitation reissued",
  },
  id: {
    "inquiry-submitted": "Inquiry dikirim",
    "inquiry-status-updated": "Status inquiry diperbarui",
    "inquiry-quotation-sent": "Quotation tercatat dari inquiry",
    "record-archived": "Record diarsipkan",
    "record-restored": "Record dipulihkan",
    "quotation-created": "Quotation dibuat",
    "quotation-draft-updated": "Draft quotation diperbarui",
    "quotation-sent": "Quotation dikirim",
    "quotation-viewed": "Quotation dilihat",
    "quotation-revision-requested": "Revisi quotation diminta",
    "quotation-rejected": "Quotation ditolak",
    "quotation-accepted": "Quotation diterima",
    "quotation-link-regenerated": "Link aman quotation dibuat ulang",
    "quotation-version-created": "Versi quotation dibuat",
    "quotation-discussion-recorded": "Diskusi quotation tercatat",
    "project-agreement-accepted": "Agreement project diterima",
    "project-status-updated": "Status project diperbarui",
    "project-delivery-approved": "Delivery project disetujui",
    "project-review-submitted": "Review terverifikasi dikirim",
    "project-review-invitation-reissued": "Undangan review dibuat ulang",
  },
};

const activitySourceLabels: Record<
  Locale,
  Record<RecordedActivitySource, string>
> = {
  en: { inquiry: "Inquiry", quotation: "Quotation", project: "Project" },
  id: { inquiry: "Inquiry", quotation: "Quotation", project: "Project" },
};

const activitySourceIcons: Record<RecordedActivitySource, LucideIcon> = {
  inquiry: MessageSquareText,
  quotation: FileText,
  project: FolderKanban,
};

const ownerCommandGridStyles = `
  [data-owner-command-grid] {
    display: grid;
    min-width: 0;
    gap: 1rem;
  }

  [data-owner-command-grid] > [data-owner-command-module] {
    display: grid;
    min-width: 0;
  }

  @media (min-width: 80rem) {
    [data-owner-command-grid] {
      grid-template-columns: repeat(12, minmax(0, 1fr));
    }

    [data-owner-command-module="attention"] {
      grid-column: 9 / span 4;
      grid-row: 1;
    }

    [data-owner-command-module="current-state"] {
      grid-column: 1 / span 8;
      grid-row: 1;
    }

    [data-owner-command-module="distribution"] {
      grid-column: 1 / span 5;
      grid-row: 2;
    }

    [data-owner-command-module="activity"] {
      grid-column: 6 / span 7;
      grid-row: 2;
    }

    [data-owner-command-module="quick-actions"] {
      grid-column: 1 / span 12;
      grid-row: 3;
    }
  }
`;

function formatDecimalMoney(
  value: string,
  currency: string,
  locale: Locale,
) {
  const [integerPart, fractionPart = "00"] = new Decimal(value)
    .toFixed(2)
    .split(".");
  const isNegative = integerPart.startsWith("-");
  const digits = isNegative ? integerPart.slice(1) : integerPart;
  const groupSeparator = locale === "id" ? "." : ",";
  const decimalSeparator = locale === "id" ? "," : ".";
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
  const fraction = fractionPart === "00" ? "" : `${decimalSeparator}${fractionPart}`;
  const sign = isNegative ? "-" : "";

  return currency === "IDR"
    ? `${sign}Rp${grouped}${fraction}`
    : `${sign}${currency} ${grouped}${fraction}`;
}

function formatRecordedAt(value: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export function OwnerCommandCenter({
  data,
  locale,
}: {
  data: OwnerDashboardData;
  locale: Locale;
}) {
  const copy = dashboardCopy[locale];

  return (
    <>
      <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-[-.045em] md:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">
            {copy.description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" size="sm">
            <Link href="/owner/analytics">
              <ChartNoAxesCombined className="size-4" aria-hidden="true" />
              {copy.openAnalytics}
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/owner/quotations/create">
              <Plus className="size-4" aria-hidden="true" />
              {copy.createQuotation}
            </Link>
          </Button>
        </div>
      </header>

      <style>{ownerCommandGridStyles}</style>
      <div className="mt-6" data-owner-command-grid="">
        <div data-owner-command-module="attention">
          <AttentionModule data={data} locale={locale} />
        </div>
        <div data-owner-command-module="current-state">
          <CurrentStateModule data={data} locale={locale} />
        </div>
        <div data-owner-command-module="distribution">
          <ProjectDistributionModule data={data} locale={locale} />
        </div>
        <div data-owner-command-module="activity">
          <RecordedActivityModule data={data} locale={locale} />
        </div>
        <div data-owner-command-module="quick-actions">
          <QuickActionsModule locale={locale} />
        </div>
      </div>
    </>
  );
}

function AttentionModule({
  data,
  locale,
}: {
  data: OwnerDashboardData;
  locale: Locale;
}) {
  const copy = dashboardCopy[locale];
  const count = data.counts.paymentVerifications;

  return (
    <section
      className="flex min-w-0 flex-col overflow-hidden rounded-[16px] border border-[#bde77e]/55 bg-[#cceb9c] text-[#0a261f]"
      aria-labelledby="owner-attention-title"
    >
      <div className="p-5 md:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#31533d]">
          {copy.attentionEyebrow}
        </p>
        <h2
          id="owner-attention-title"
          className="mt-2 font-display text-2xl font-extrabold tracking-[-.035em]"
        >
          {copy.attentionTitle}
        </h2>

        <div className="mt-7 border-l-2 border-[#123d30] pl-4">
          <p className="font-display text-6xl font-extrabold leading-none tracking-[-.06em] tabular-nums">
            {count}
          </p>
          <p className="mt-3 max-w-xs text-sm font-bold leading-5">
            {copy.verificationLabel}
          </p>
        </div>
        <p className="mt-4 text-sm leading-6 text-[#29483a]">
          {count === 0 ? copy.verificationEmpty : copy.verificationPending}
        </p>
        <Link
          href="/owner/payments"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-[#123d30]/30 bg-[#0b2d24] px-4 text-sm font-bold text-white transition-colors hover:bg-[#123d30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b2d24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#cceb9c]"
        >
          {copy.reviewPayments}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-auto border-t border-[#123d30]/20 bg-[#bde77e]/45 p-5 md:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[#31533d]">
          {copy.activeQueues}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <QueueCount
            label={copy.activeInquiries}
            value={data.counts.activeInquiries}
            href="/owner/inquiries"
          />
          <QueueCount
            label={copy.currentQuotations}
            value={data.counts.currentQuotations}
            href="/owner/quotations"
          />
        </dl>
        <p className="mt-4 text-xs leading-5 text-[#31533d]">
          {copy.exactQueueNote}
        </p>
      </div>
    </section>
  );
}

function QueueCount({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <div className="min-w-0 rounded-[10px] border border-[#123d30]/15 bg-[#e4f6c5]/70 p-3.5">
      <dt className="text-xs font-semibold leading-5 text-[#31533d]">{label}</dt>
      <dd className="mt-2">
        <Link
          href={href}
          className="inline-flex items-center gap-2 font-display text-2xl font-extrabold tabular-nums hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b2d24]"
        >
          {value}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      </dd>
    </div>
  );
}

function CurrentStateModule({
  data,
  locale,
}: {
  data: OwnerDashboardData;
  locale: Locale;
}) {
  const copy = dashboardCopy[locale];
  const receivables =
    data.outstandingReceivable.currencies.length > 0
      ? data.outstandingReceivable.currencies
      : [{ currency: "IDR", amount: "0.00" }];
  const workflowSteps: Array<{
    label: string;
    value: number;
    href: string;
    icon: LucideIcon;
  }> = [
    {
      label: copy.activeInquiries,
      value: data.counts.activeInquiries,
      href: "/owner/inquiries",
      icon: MessageSquareText,
    },
    {
      label: copy.currentQuotations,
      value: data.counts.currentQuotations,
      href: "/owner/quotations",
      icon: FileText,
    },
    {
      label: copy.activeProjects,
      value: data.counts.activeProjects,
      href: "/owner/projects",
      icon: FolderKanban,
    },
  ];
  const invoiceScope =
    locale === "id"
      ? `Dihitung dari ${data.outstandingReceivable.openInvoiceCount} invoice terbuka.`
      : `Computed from ${data.outstandingReceivable.openInvoiceCount} open invoices.`;

  return (
    <section
      className="min-w-0 overflow-hidden rounded-[16px] border border-[#1b4a3e] bg-[#071f1a] text-white"
      aria-labelledby="owner-current-state-title"
    >
      <div className="grid gap-7 p-5 md:p-7 lg:grid-cols-[minmax(0,1.3fr)_minmax(14rem,.7fr)]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#bde77e]">
              {copy.stateEyebrow}
            </p>
            <span className="rounded-full border border-white/15 bg-white/[.05] px-3 py-1 text-[11px] font-semibold text-white/70">
              {copy.currentScope}
            </span>
          </div>
          <h2
            id="owner-current-state-title"
            className="mt-3 font-display text-2xl font-extrabold tracking-[-.04em] md:text-3xl"
          >
            {copy.stateTitle}
          </h2>

          <div className="mt-8 min-w-0">
            <p className="text-sm font-semibold text-white/70">
              {copy.outstandingLabel}
            </p>
            <div className="mt-3 flex min-w-0 flex-wrap items-end gap-x-5 gap-y-2">
              {receivables.map((item) => (
                <p
                  key={item.currency}
                  className="min-w-0 [overflow-wrap:anywhere] font-display text-[clamp(2.15rem,6vw,4.4rem)] font-extrabold leading-none tracking-[-.065em] text-[#d9f7a8] tabular-nums"
                >
                  {formatDecimalMoney(item.amount, item.currency, locale)}
                </p>
              ))}
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
              {data.outstandingReceivable.openInvoiceCount === 0
                ? copy.noOpenInvoices
                : `${copy.outstandingScope} ${invoiceScope}`}
            </p>
          </div>
        </div>

        <div className="grid min-w-0 gap-px overflow-hidden rounded-[12px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-1">
          <Link
            href="/owner/projects"
            className="group flex min-h-36 min-w-0 flex-col justify-between bg-[#0c2d26] p-5 transition-colors hover:bg-[#10382e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#bde77e]"
          >
            <FolderKanban className="size-5 text-[#bde77e]" aria-hidden="true" />
            <div className="mt-6">
              <p className="font-display text-4xl font-extrabold tracking-[-.05em] tabular-nums">
                {data.counts.activeProjects}
              </p>
              <p className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold text-white/75">
                {copy.activeProjects}
                <ArrowUpRight
                  className="size-4 text-[#bde77e]"
                  aria-hidden="true"
                />
              </p>
            </div>
          </Link>
          <Link
            href="/owner/services"
            className="group flex min-h-36 min-w-0 flex-col justify-between bg-[#0c2d26] p-5 transition-colors hover:bg-[#10382e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#bde77e]"
          >
            <BriefcaseBusiness
              className="size-5 text-[#bde77e]"
              aria-hidden="true"
            />
            <div className="mt-6">
              <p className="font-display text-4xl font-extrabold tracking-[-.05em] tabular-nums">
                {data.counts.publishedServices}
              </p>
              <p className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold text-white/75">
                {copy.publishedServices}
                <ArrowUpRight
                  className="size-4 text-[#bde77e]"
                  aria-hidden="true"
                />
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#09251f] p-5 md:p-7">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <p className="text-[11px] font-bold uppercase tracking-[.15em] text-white/65">
            {copy.workflowRecords}
          </p>
          <p className="max-w-xl text-xs leading-5 text-white/60">
            {copy.workflowNote}
          </p>
        </div>
        <ol className="mt-5 grid gap-px overflow-hidden rounded-[12px] border border-white/10 bg-white/10 sm:grid-cols-3">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.href} className="min-w-0 bg-[#0c2d26]">
                <Link
                  href={step.href}
                  className="group flex min-h-40 min-w-0 flex-col justify-between p-4 transition-colors hover:bg-[#10382e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#bde77e] md:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Icon
                      className="size-4 text-[#bde77e]"
                      aria-hidden="true"
                    />
                    <span className="font-mono text-[10px] text-white/60">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="mt-7">
                    <p className="font-display text-3xl font-extrabold tracking-[-.045em] tabular-nums">
                      {step.value}
                    </p>
                    <p className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold text-white/75">
                      {step.label}
                      <ArrowRight
                        className="size-4 text-[#bde77e]"
                        aria-hidden="true"
                      />
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function ProjectDistributionModule({
  data,
  locale,
}: {
  data: OwnerDashboardData;
  locale: Locale;
}) {
  const copy = dashboardCopy[locale];
  const total = data.counts.activeProjects;

  return (
    <section
      className="min-w-0 rounded-[16px] border border-border bg-surface p-5 md:p-6"
      aria-labelledby="owner-project-distribution-title"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-primary">
            {copy.distributionEyebrow}
          </p>
          <h2
            id="owner-project-distribution-title"
            className="mt-2 font-display text-2xl font-extrabold tracking-[-.035em]"
          >
            {copy.distributionTitle}
          </h2>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-primary/25 bg-accent-soft font-display text-lg font-extrabold text-primary tabular-nums">
          {total}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-secondary">
        {copy.distributionDescription}
      </p>

      {total === 0 ? (
        <p className="mt-7 rounded-[12px] border border-dashed border-border p-6 text-sm leading-6 text-secondary">
          {copy.noActiveProjects}
        </p>
      ) : (
        <dl className="mt-7 space-y-4">
          {data.projectDistribution.map((item) => {
            const share = (item.count / total) * 100;
            return (
              <div key={item.status}>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <dt className="min-w-0 font-semibold text-secondary">
                    {projectStatusLabels[locale][item.status]}
                  </dt>
                  <dd className="shrink-0 font-display font-extrabold tabular-nums">
                    {item.count}
                  </dd>
                </div>
                <div
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container"
                  aria-hidden="true"
                >
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${share}%` }}
                  />
                </div>
              </div>
            );
          })}
        </dl>
      )}
    </section>
  );
}

function RecordedActivityModule({
  data,
  locale,
}: {
  data: OwnerDashboardData;
  locale: Locale;
}) {
  const copy = dashboardCopy[locale];

  return (
    <section
      className="min-w-0 overflow-hidden rounded-[16px] border border-border bg-surface"
      aria-labelledby="owner-recorded-activity-title"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-start md:p-6">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-primary">
            {copy.activityEyebrow}
          </p>
          <h2
            id="owner-recorded-activity-title"
            className="mt-2 font-display text-2xl font-extrabold tracking-[-.035em]"
          >
            {copy.activityTitle}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-secondary">
            {copy.activityDescription}
          </p>
        </div>
        <span className="w-fit shrink-0 rounded-full border border-border bg-surface-container px-3 py-1.5 text-[11px] font-semibold text-secondary">
          {copy.activityLimit}
        </span>
      </div>

      {data.recentRecordedActivity.length === 0 ? (
        <div className="p-5 md:p-6">
          <div className="rounded-[12px] border border-dashed border-border p-6">
            <ReceiptText className="size-5 text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg font-extrabold">
              {copy.noActivityTitle}
            </h3>
            <p className="mt-2 text-sm leading-6 text-secondary">
              {copy.noActivityDescription}
            </p>
          </div>
        </div>
      ) : (
        <ol className="divide-y divide-border">
          {data.recentRecordedActivity.map((activity) => {
            const Icon = activitySourceIcons[activity.source];
            return (
              <li key={activity.id}>
                <Link
                  href={activity.href}
                  className="group grid min-w-0 gap-3 px-5 py-4 transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center md:px-6"
                >
                  <span className="grid size-9 place-items-center rounded-full border border-border bg-surface-container text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">
                      {activityEventLabels[locale][activity.event]}
                    </span>
                    <span className="mt-1 block min-w-0 break-words text-xs leading-5 text-secondary">
                      {activitySourceLabels[locale][activity.source]} · {activity.identifier}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-xs text-secondary sm:justify-self-end">
                    <time dateTime={activity.recordedAt.toISOString()}>
                      {formatRecordedAt(activity.recordedAt, locale)}
                    </time>
                    <ArrowUpRight
                      className="size-3.5 text-primary"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}

      <p className="border-t border-border bg-surface-container/40 px-5 py-3 text-xs leading-5 text-secondary md:px-6">
        {copy.activityDisclosure}
      </p>
    </section>
  );
}

function QuickActionsModule({ locale }: { locale: Locale }) {
  const copy = dashboardCopy[locale];
  const actions: Array<{
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
  }> = [
    {
      title: copy.createQuotationTitle,
      description: copy.createQuotationDescription,
      href: "/owner/quotations/create",
      icon: Plus,
    },
    {
      title: copy.reviewInquiriesTitle,
      description: copy.reviewInquiriesDescription,
      href: "/owner/inquiries",
      icon: MessageSquareText,
    },
    {
      title: copy.verifyPaymentsTitle,
      description: copy.verifyPaymentsDescription,
      href: "/owner/payments",
      icon: CreditCard,
    },
    {
      title: copy.manageServicesTitle,
      description: copy.manageServicesDescription,
      href: "/owner/services",
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <section
      className="min-w-0 overflow-hidden rounded-[16px] border border-border bg-surface"
      aria-labelledby="owner-quick-actions-title"
    >
      <div className="grid gap-5 border-b border-border p-5 md:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)] md:items-end md:p-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-primary">
            {copy.quickEyebrow}
          </p>
          <h2
            id="owner-quick-actions-title"
            className="mt-2 font-display text-2xl font-extrabold tracking-[-.035em]"
          >
            {copy.quickTitle}
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-secondary md:justify-self-end">
          {copy.quickDescription}
        </p>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex min-h-44 min-w-0 flex-col justify-between bg-surface p-5 transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus md:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="grid size-10 place-items-center rounded-full border border-primary/25 bg-accent-soft text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="font-mono text-[10px] text-muted">
                  0{index + 1}
                </span>
              </div>
              <div className="mt-8">
                <h3 className="flex items-center justify-between gap-3 font-display text-lg font-extrabold tracking-[-.025em]">
                  {action.title}
                  <ArrowUpRight
                    className="size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                </h3>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
