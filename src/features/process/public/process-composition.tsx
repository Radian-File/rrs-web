import Link from "next/link";
import { ArrowRight, Check, LockKeyhole, MessageCircle, UserRoundCheck } from "lucide-react";

export function ProcessComposition({ isId }: { isId: boolean }) {
  const copy = isId
    ? {
        eyebrow: "Cara kerja RRS / quotation-first",
        title: "Diskusi terbuka. Keputusan formal tetap terdokumentasi.",
        description:
          "Workflow dimulai dari percakapan tanpa komitmen, lalu berpindah ke akun Client untuk brief, quotation, agreement, pembayaran, delivery, dan review yang dapat diverifikasi.",
        guest: "Guest entry",
        formal: "Formal Client workflow",
        boundaryTitle: "Guest boleh berdiskusi. Workflow formal memerlukan akun Client.",
        boundaryDescription:
          "WhatsApp dan Contact tetap terbuka tanpa login. Technical brief, quotation decision, agreement, payment proof, delivery approval, dan verified review terikat ke akun serta ownership check.",
        discuss: "Mulai diskusi",
        account: "Buat akun Client",
        output: "Output",
        faq: "Sebelum project bergerak lebih jauh",
        questions: [
          ["Apakah saya harus langsung membayar?", "Tidak. Pembayaran baru diminta setelah quotation dan agreement disetujui."],
          ["Apakah harga layanan sudah final?", "Tidak. Harga layanan adalah estimasi awal; harga final mengikuti scope quotation."],
          ["Bagaimana jika scope berubah?", "Perubahan ditinjau dan didokumentasikan sebelum dikerjakan melalui quotation versi baru atau agreement tambahan yang sesuai."],
          ["Apakah progress dapat dipantau?", "Ya. Setelah project aktif, milestone, pesan, file, approval, dan invoice tersedia melalui Client Portal."],
        ],
        stages: [
          ["01", "Diskusi awal", "Guest dapat menjelaskan konteks melalui Contact atau WhatsApp tanpa membuat akun.", "Konteks awal tanpa komitmen", "guest"],
          ["02", "Akun Client", "Akun diperlukan sebelum memasuki workflow formal agar ownership dan continuation dapat dijaga.", "Identitas workflow terverifikasi", "formal"],
          ["03", "Technical brief → Inquiry", "Client mengirim tujuan, pengguna, fitur, referensi, budget range, dan timeline sebagai inquiry terstruktur.", "Inquiry yang dapat ditinjau Owner", "formal"],
          ["04", "Quotation Owner", "Owner meninjau kebutuhan dan menerbitkan scope, deliverables, exclusions, timeline, revisi, pembayaran, serta harga final.", "Quotation formal", "formal"],
          ["05", "Agreement", "Setelah quotation diterima, agreement disiapkan dan harus ditinjau Client sebelum pengerjaan formal.", "Persetujuan terdokumentasi", "formal"],
          ["06", "Invoice & pembayaran", "Invoice diterbitkan sesuai terms. Provider payment atau bukti manual diverifikasi sebelum status project bergerak.", "Pembayaran tercatat", "formal"],
          ["07", "Project workspace", "Milestone, pesan, file, invoice, dan progress dikelola melalui Client Portal.", "Progress yang dapat ditinjau", "formal"],
          ["08", "Delivery approval", "Client meninjau hasil akhir dan menyetujui delivery setelah milestone serta revisi selesai.", "Delivery disetujui", "formal"],
          ["09", "Verified review", "Review hanya tersedia setelah project selesai dan tetap melalui moderasi sebelum published.", "Proof terverifikasi", "formal"],
        ],
      }
    : {
        eyebrow: "How RRS works / quotation-first",
        title: "Open discussion. Documented formal decisions.",
        description:
          "The workflow begins with a no-commitment conversation, then moves into a Client account for the brief, quotation, agreement, payment, delivery, and verifiable review.",
        guest: "Guest entry",
        formal: "Formal Client workflow",
        boundaryTitle: "Guests can discuss. The formal workflow requires a Client account.",
        boundaryDescription:
          "WhatsApp and Contact remain open without sign-in. The technical brief, quotation decision, agreement, payment proof, delivery approval, and verified review are tied to an account and ownership checks.",
        discuss: "Start a discussion",
        account: "Create a Client account",
        output: "Output",
        faq: "Before the project moves forward",
        questions: [
          ["Do I need to pay immediately?", "No. Payment is requested only after the quotation and agreement are approved."],
          ["Are service prices final?", "No. Service prices are starting estimates; final pricing follows the quotation scope."],
          ["What if the scope changes?", "Changes are reviewed and documented before implementation through a new quotation version or an appropriate additional agreement."],
          ["Can progress be tracked?", "Yes. Once active, milestones, messages, files, approvals, and invoices are available through the Client Portal."],
        ],
        stages: [
          ["01", "Initial discussion", "A guest can explain the context through Contact or WhatsApp without creating an account.", "Initial context without commitment", "guest"],
          ["02", "Client account", "An account is required before the formal workflow so ownership and continuation remain protected.", "Verified workflow identity", "formal"],
          ["03", "Technical brief → Inquiry", "The Client submits goals, users, features, references, budget range, and timeline as a structured inquiry.", "An inquiry the Owner can review", "formal"],
          ["04", "Owner quotation", "The Owner reviews the need and publishes scope, deliverables, exclusions, timeline, revisions, payment terms, and final price.", "Formal quotation", "formal"],
          ["05", "Agreement", "After quotation acceptance, the agreement is prepared and reviewed by the Client before formal work begins.", "Documented approval", "formal"],
          ["06", "Invoice & payment", "Invoices follow the terms. Provider payments or manual proof are verified before the project status advances.", "Recorded payment", "formal"],
          ["07", "Project workspace", "Milestones, messages, files, invoices, and progress are managed through the Client Portal.", "Reviewable progress", "formal"],
          ["08", "Delivery approval", "The Client reviews and approves final delivery after milestones and revisions are complete.", "Approved delivery", "formal"],
          ["09", "Verified review", "A review is available only after project completion and remains moderated before publication.", "Verified proof", "formal"],
        ],
      };

  return (
    <main>
      <section className="rrs-grain relative isolate overflow-hidden border-b border-white/[.06] bg-[radial-gradient(circle_at_82%_26%,rgba(82,164,119,.18),transparent_28%),linear-gradient(180deg,#101211,#181a18)] text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-y-0 left-[7%] w-px bg-white/[.045]" />
          <div className="absolute inset-y-0 right-[7%] w-px bg-white/[.045]" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-8 lg:px-12 lg:py-28 xl:px-16">
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-accent-lime">{copy.eyebrow}</p>
          <h1 className="mt-6 max-w-6xl font-display text-[clamp(3.4rem,6.8vw,7.2rem)] font-black uppercase leading-[.83] tracking-[-.075em] text-[#f5f2ea]">{copy.title}</h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-white/58 md:text-lg">{copy.description}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent-lime px-6 text-sm font-bold text-background transition-colors hover:bg-[#d7f58f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <MessageCircle className="size-4" aria-hidden="true" />
              {copy.discuss}
            </Link>
            <Link href="/register?callbackUrl=%2Fstart-project" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[.04] px-6 text-sm font-bold text-white transition-colors hover:bg-white/[.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <UserRoundCheck className="size-4" aria-hidden="true" />
              {copy.account}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 lg:px-12 lg:py-28 xl:px-16" aria-label={copy.eyebrow}>
        <ol className="border-t border-border">
          {copy.stages.map(([number, title, description, output, mode], index) => (
            <li key={number} className={`grid gap-5 border-b border-border py-8 md:grid-cols-[72px_minmax(12rem,.42fr)_minmax(0,.9fr)_minmax(12rem,.38fr)] md:py-10 ${index === 0 ? "bg-accent-soft/35 px-5 md:px-6" : ""}`}>
              <div>
                <span className="font-display text-2xl font-extrabold tracking-[-.04em] text-primary">{number}</span>
                <p className="mt-2 text-[9px] font-bold uppercase tracking-[.14em] text-muted">{mode === "guest" ? copy.guest : copy.formal}</p>
              </div>
              <h2 className="font-display text-2xl font-extrabold tracking-[-.035em]">{title}</h2>
              <p className="text-sm leading-7 text-secondary">{description}</p>
              <p className="flex items-start gap-2 text-sm font-semibold leading-6 text-foreground">
                <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span><span className="sr-only">{copy.output}: </span>{output}</span>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-border bg-surface" aria-labelledby="workflow-boundary-title">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 md:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-12 lg:py-24 xl:px-16">
          <div>
            <LockKeyhole className="size-7 text-primary" aria-hidden="true" />
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[.18em] text-primary">Guest → Client</p>
            <h2 id="workflow-boundary-title" className="mt-4 font-display text-4xl font-extrabold tracking-[-.05em]">{copy.boundaryTitle}</h2>
          </div>
          <p className="max-w-3xl text-lg leading-9 text-secondary lg:pt-12">{copy.boundaryDescription}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 md:px-8 lg:grid-cols-[.65fr_1.35fr] lg:px-12 lg:py-28 xl:px-16" aria-labelledby="process-faq-title">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">FAQ</p>
          <h2 id="process-faq-title" className="mt-4 font-display text-4xl font-extrabold tracking-[-.05em]">{copy.faq}</h2>
        </div>
        <div className="border-t border-border">
          {copy.questions.map(([question, answer]) => (
            <details key={question} className="group border-b border-border py-6">
              <summary className="cursor-pointer list-none font-display text-lg font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <span className="flex items-center justify-between gap-4">{question}<ArrowRight className="size-4 text-primary transition-transform group-open:rotate-90" aria-hidden="true" /></span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-secondary">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
