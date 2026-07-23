import { Check, FileCheck2, FolderKanban, ReceiptText } from "lucide-react";

export function WorkflowArtifacts({ isId }: { isId: boolean }) {
  const copy = isId
    ? {
        demo: "Demonstrasi",
        caption: "Antarmuka demonstrasi RRS · tanpa data Client nyata",
        workspace: "Project workspace",
        project: "Website & internal workflow",
        attention: "Perlu ditinjau",
        quotation: "Quotation v2",
        agreement: "Agreement siap",
        invoice: "Invoice terbit",
        progress: "Progress project",
        activeStage: "Development aktif",
        nextReview: "Berikutnya · Client review",
        scope: "Scope disepakati",
        milestones: "Milestone",
        messages: "Pembaruan",
        files: "File",
        quoteLabel: "RRS / Quotation",
        quoteTitle: "Scope sebelum commitment",
        included: ["Deliverables", "Timeline", "Payment terms"],
        statusLabel: "RRS / Project",
        statusTitle: "Satu portal hingga delivery",
      }
    : {
        demo: "Demonstration",
        caption: "RRS demonstration interface · no real Client data",
        workspace: "Project workspace",
        project: "Website & internal workflow",
        attention: "Needs review",
        quotation: "Quotation v2",
        agreement: "Agreement ready",
        invoice: "Invoice issued",
        progress: "Project progress",
        activeStage: "Development active",
        nextReview: "Up next · Client review",
        scope: "Scope agreed",
        milestones: "Milestones",
        messages: "Updates",
        files: "Files",
        quoteLabel: "RRS / Quotation",
        quoteTitle: "Scope before commitment",
        included: ["Deliverables", "Timeline", "Payment terms"],
        statusLabel: "RRS / Project",
        statusTitle: "One portal through delivery",
      };

  return (
    <figure className="relative mx-auto min-h-[720px] w-full max-w-[1040px] sm:min-h-[650px] lg:min-h-[690px]" aria-label={copy.caption}>
      <figcaption className="absolute bottom-5 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/45 px-4 py-2 text-[8px] font-bold uppercase tracking-[.14em] text-white/45 backdrop-blur-md sm:text-[9px]">{copy.caption}</figcaption>

      <article data-hero-artifact className="absolute left-[3%] top-[122px] z-10 hidden w-[34%] -rotate-[6deg] overflow-hidden rounded-[20px] border border-white/12 bg-[#3a2b30] p-4 text-white shadow-[0_32px_90px_rgba(0,0,0,.42)] [transform-style:preserve-3d] sm:block lg:left-[1%] lg:top-[158px] lg:p-5" aria-label={copy.quoteTitle}>
        <div className="flex items-center justify-between border-b border-white/12 pb-3"><p className="text-[8px] font-bold uppercase tracking-[.16em] text-white/48">{copy.quoteLabel}</p><DemoLabel>{copy.demo}</DemoLabel></div>
        <h2 className="mt-5 font-display text-lg font-black uppercase leading-[.95] tracking-[-.04em] lg:text-2xl">{copy.quoteTitle}</h2>
        <ol className="mt-5 divide-y divide-white/10 border-y border-white/10">{copy.included.map((item, index) => <li key={item} className="flex items-center gap-2 py-2 text-[9px] font-semibold text-white/72 lg:text-[11px]"><span className="font-mono text-[8px] text-accent-lime">0{index + 1}</span>{item}</li>)}</ol>
        <div className="mt-5 flex items-center justify-between"><span className="text-[8px] uppercase tracking-[.12em] text-white/38">QT-DEMO / V2</span><FileCheck2 className="size-5 text-accent-lime" aria-hidden="true" /></div>
      </article>

      <article data-hero-artifact className="absolute left-[4%] top-[56px] z-20 w-[92%] overflow-hidden rounded-[22px] border border-white/15 bg-[#202320] text-white shadow-[0_40px_120px_rgba(0,0,0,.55)] [transform-style:preserve-3d] sm:left-[13%] sm:top-[86px] sm:w-[74%] lg:left-[14%] lg:top-[92px] lg:w-[72%]" aria-labelledby="demo-workspace-title">
        <div className="flex h-9 items-center gap-2 border-b border-white/10 bg-[#343735] px-4 sm:h-11"><span className="size-2 rounded-full bg-[#f37b65]" /><span className="size-2 rounded-full bg-[#e7c35c]" /><span className="size-2 rounded-full bg-[#69b77c]" /><div className="mx-auto hidden h-5 w-1/3 rounded-full border border-white/[.06] bg-black/15 sm:block" /><DemoLabel>{copy.demo}</DemoLabel></div>
        <div className="grid min-h-[390px] grid-cols-[44px_1fr] sm:min-h-[470px] sm:grid-cols-[58px_1fr] lg:min-h-[520px]">
          <aside className="border-r border-white/10 bg-[#191b1a] py-4" aria-label="Demonstration navigation"><div className="mx-auto grid size-8 place-items-center rounded-full bg-accent-lime font-display text-sm font-black text-background">R</div><div className="mt-6 grid gap-3">{[FolderKanban, FileCheck2, ReceiptText].map((Icon, index) => <span key={index} className={`mx-auto grid size-7 place-items-center rounded-full ${index === 0 ? "bg-white text-background" : "bg-white/[.07] text-white/38"}`}><Icon className="size-3.5" aria-hidden="true" /></span>)}</div></aside>
          <div className="min-w-0 p-4 sm:p-6 lg:p-8">
            <div className="flex items-start justify-between gap-3"><div><p className="text-[8px] font-bold uppercase tracking-[.16em] text-white/38 sm:text-[9px]">RRS / {copy.workspace}</p><h2 id="demo-workspace-title" className="mt-2 font-display text-lg font-black tracking-[-.035em] sm:text-2xl lg:text-3xl">{copy.project}</h2></div><span className="rounded-full border border-accent-lime/25 bg-accent-lime/10 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[.1em] text-accent-lime sm:text-[9px]">{copy.activeStage}</span></div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1.1fr_.9fr] lg:mt-7">
              <div className="rounded-[14px] border border-white/10 bg-[#282b29] p-4 sm:p-5"><div className="flex items-center justify-between"><p className="text-[9px] uppercase tracking-[.12em] text-white/42">{copy.progress}</p><p className="font-display text-xl font-black text-accent-lime sm:text-2xl">68%</p></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-accent-lime" /></div><p className="mt-3 text-[9px] text-white/48 sm:text-[11px]">{copy.nextReview}</p></div>
              <div className="rounded-[14px] border border-[#546e51]/55 bg-[#30452f] p-4 sm:p-5"><p className="text-[9px] uppercase tracking-[.12em] text-white/45">{copy.attention}</p><p className="mt-4 font-display text-lg font-black tracking-[-.03em] sm:text-xl">{copy.agreement}</p><p className="mt-2 text-[9px] text-white/48 sm:text-[11px]">{copy.scope}</p></div>
            </div>

            <div className="mt-3 rounded-[14px] border border-white/10 bg-[#292c2a] p-4 sm:mt-4 sm:p-5"><div className="grid grid-cols-3 gap-3">{[[copy.milestones, "05"], [copy.messages, "12"], [copy.files, "08"]].map(([label, value]) => <div key={label} className="border-r border-white/10 last:border-r-0"><p className="font-display text-lg font-black sm:text-2xl">{value}</p><p className="mt-1 text-[8px] uppercase tracking-[.1em] text-white/38 sm:text-[9px]">{label}</p></div>)}</div></div>

            <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2"><div className="rounded-[12px] border border-white/10 bg-[#242725] p-3"><p className="text-[8px] uppercase tracking-[.1em] text-white/35">{copy.quotation}</p><div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-white/72"><Check className="size-3.5 text-accent-lime" aria-hidden="true" />{copy.scope}</div></div><div className="rounded-[12px] border border-white/10 bg-[#242725] p-3"><p className="text-[8px] uppercase tracking-[.1em] text-white/35">{copy.invoice}</p><div className="mt-3 h-1 rounded-full bg-white/10"><div className="h-full w-1/2 rounded-full bg-[#d7ab5b]" /></div></div></div>
          </div>
        </div>
      </article>

      <article data-hero-artifact className="absolute right-[1%] top-[188px] z-30 hidden w-[31%] rotate-[7deg] overflow-hidden rounded-[20px] border border-white/12 bg-[#313b43] p-4 text-white shadow-[0_32px_90px_rgba(0,0,0,.45)] [transform-style:preserve-3d] sm:block lg:right-[.5%] lg:top-[212px] lg:p-5" aria-label={copy.statusTitle}>
        <div className="flex items-center justify-between"><p className="text-[8px] font-bold uppercase tracking-[.16em] text-white/46">{copy.statusLabel}</p><DemoLabel>{copy.demo}</DemoLabel></div>
        <h2 className="mt-5 font-display text-lg font-black uppercase leading-[.95] tracking-[-.04em] lg:text-2xl">{copy.statusTitle}</h2>
        <div className="mt-5 rounded-[12px] bg-black/16 p-3"><div className="flex items-center justify-between text-[9px]"><span className="text-white/48">{copy.progress}</span><span className="font-bold text-accent-lime">68%</span></div><div className="mt-3 h-1 rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-accent-lime" /></div></div>
        <p className="mt-4 text-[9px] leading-5 text-white/52 lg:text-[11px]">{copy.nextReview}</p>
      </article>
    </figure>
  );
}

function DemoLabel({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/15 px-2 py-1 text-[7px] font-bold uppercase tracking-[.12em] text-white/45 sm:text-[8px]">{children}</span>;
}
