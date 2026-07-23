import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Check, FileCheck2, FolderKanban, MessageCircle, Quote, ReceiptText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeReview } from "@/components/home/home-sections";

export function ReferenceReviewFan({ isId, reviews }: { isId: boolean; reviews: HomeReview[] }) {
  const hasReviews = reviews.length > 0;
  const cards = hasReviews
    ? reviews.slice(0, 5).map((review) => ({ id: review.id, kicker: isId ? "Project terverifikasi" : "Verified project", title: review.clientName, body: review.comment, detail: review.projectTitle, rating: review.overallRating }))
    : (isId
      ? [
          { id: "standard-1", kicker: "Standar delivery", title: "Scope dapat ditinjau", body: "Deliverables, exclusions, timeline, revisi, dan payment terms ditulis sebelum commitment.", detail: "Quotation-first workflow", rating: 0 },
          { id: "standard-2", kicker: "Standar delivery", title: "Progress terdokumentasi", body: "Milestone, file, pesan, invoice, dan action Client berada dalam satu portal.", detail: "Operational transparency", rating: 0 },
          { id: "standard-3", kicker: "Standar delivery", title: "Approval tercatat", body: "Agreement dan delivery approval disimpan sebagai bagian dari project record.", detail: "Accountable handoff", rating: 0 },
          { id: "standard-4", kicker: "Standar review", title: "Tidak ada testimonial palsu", body: "Review hanya dapat diterbitkan setelah project selesai dan melewati moderasi.", detail: "Verified review policy", rating: 0 },
        ]
      : [
          { id: "standard-1", kicker: "Delivery standard", title: "Reviewable scope", body: "Deliverables, exclusions, timeline, revisions, and payment terms are documented before commitment.", detail: "Quotation-first workflow", rating: 0 },
          { id: "standard-2", kicker: "Delivery standard", title: "Documented progress", body: "Milestones, files, messages, invoices, and Client actions stay in one portal.", detail: "Operational transparency", rating: 0 },
          { id: "standard-3", kicker: "Delivery standard", title: "Recorded approval", body: "Agreement and delivery approval remain part of the project record.", detail: "Accountable handoff", rating: 0 },
          { id: "standard-4", kicker: "Review standard", title: "No invented testimonials", body: "A review can only be published after project completion and moderation.", detail: "Verified review policy", rating: 0 },
        ]);
  const headline = hasReviews
    ? (isId ? ["APA YANG CLIENT SUKAI", "TENTANG RRS"] : ["WHAT CLIENTS VALUE", "ABOUT RRS"])
    : (isId ? ["BUKTI DELIVERY,", "BUKAN PUJIAN PALSU"] : ["DELIVERY PROOF,", "NOT INVENTED PRAISE"]);
  const tones = ["bg-[#34444f]", "bg-[#514047]", "bg-[#344c32]", "bg-[#806400]", "bg-[#3f343a]"];

  return (
    <section data-review-fan className="rrs-grain relative min-h-[880px] overflow-hidden border-y border-white/[.06] bg-[#1c1e1d] text-white">
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-24 pt-24 text-center md:px-8 lg:px-12 lg:pt-28 xl:px-16">
        <p className="text-[10px] font-black uppercase tracking-[.2em] text-accent-lime">{hasReviews ? (isId ? "ULASAN TERVERIFIKASI" : "VERIFIED REVIEWS") : (isId ? "STANDAR TERBUKA" : "OPEN STANDARDS")}</p>
        <h2 aria-label={headline.join(" ")} className="mx-auto mt-5 max-w-6xl font-display text-[clamp(3rem,6.6vw,6.8rem)] font-black uppercase leading-[.84] tracking-[-.07em]">{headline.map((line) => <span key={line} className="block">{line}</span>)}</h2>
        <div className="mx-auto mt-16 grid max-w-xl gap-4 text-left sm:grid-cols-2 lg:relative lg:mt-20 lg:block lg:h-[430px] lg:max-w-none">
          {cards.map((card, index) => { const center=(cards.length-1)/2; const distance=index-center; return <article key={card.id} data-review-card style={{"--fan-x":`${distance*158}px`,"--fan-y":`${Math.abs(distance)*34}px`,"--fan-r":`${distance*6}deg`,"--fan-z":String(30-Math.abs(distance)*2)} as React.CSSProperties} className={`relative rounded-[20px] border border-white/10 p-5 shadow-[0_30px_80px_rgba(0,0,0,.34)] sm:p-6 lg:absolute lg:left-1/2 lg:top-16 lg:w-[310px] ${tones[index % tones.length]}`}>
            <div className="flex items-start justify-between gap-3"><div><p className="text-[8px] font-black uppercase tracking-[.15em] text-white/42">{card.kicker}</p><h3 className="mt-2 font-display text-xl font-black leading-[.95] tracking-[-.035em]">{card.title}</h3></div>{hasReviews ? <BadgeCheck className="size-5 shrink-0 text-accent-lime" aria-hidden="true" /> : <Check className="size-5 shrink-0 text-accent-lime" aria-hidden="true" />}</div>
            <Quote className="mt-7 size-6 text-white/18" aria-hidden="true" />
            <p className="mt-3 text-sm leading-6 text-white/78">{card.body}</p>
            <div className="mt-6 border-t border-white/10 pt-4"><p className="text-[9px] font-bold uppercase tracking-[.12em] text-white/38">{card.detail}</p>{card.rating > 0 && <div className="mt-3 flex gap-1" aria-label={`${card.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, star) => <Star key={star} className={`size-3 ${star < card.rating ? "fill-accent-lime text-accent-lime" : "text-white/15"}`} aria-hidden="true" />)}</div>}</div>
          </article>;})}
        </div>
        <Link href="/reviews" className="relative z-40 mt-8 inline-flex items-center gap-2 text-sm font-black text-accent-lime hover:text-white">{isId ? "Lihat halaman ulasan" : "Open the reviews page"}<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
      </div>
    </section>
  );
}

export function ReferenceFaq({ isId }: { isId: boolean }) {
  const faq = isId ? [
    ["APAKAH HARGA LAYANAN SUDAH FINAL?", "Belum. Harga pada katalog adalah estimasi awal. Harga final ditulis dalam quotation setelah scope ditinjau."],
    ["MENGAPA TECHNICAL BRIEF PERLU LOGIN?", "Akun menghubungkan identity Client dengan inquiry, quotation, agreement, project, invoice, file, dan approval privat."],
    ["APAKAH DISKUSI BISA TANPA AKUN?", "Bisa. Contact form dan WhatsApp tetap terbuka untuk diskusi awal."],
    ["KAPAN AGREEMENT DAN PEMBAYARAN DIMULAI?", "Agreement tersedia setelah quotation diterima. Pembayaran dilakukan melalui invoice sesuai jadwal yang disepakati."],
    ["BAGAIMANA PROGRESS DIPANTAU?", "Client Portal menampilkan milestone, pesan, file, invoice, dan action yang perlu ditinjau."],
  ] : [
    ["ARE SERVICE PRICES FINAL?", "No. Catalogue prices are starting estimates. Final pricing is documented in the quotation after scope review."],
    ["WHY DOES THE TECHNICAL BRIEF REQUIRE SIGN-IN?", "The account connects the Client identity to private inquiries, quotations, agreements, projects, invoices, files, and approvals."],
    ["CAN WE DISCUSS WITHOUT AN ACCOUNT?", "Yes. The contact form and WhatsApp remain available for the initial discussion."],
    ["WHEN DO THE AGREEMENT AND PAYMENT BEGIN?", "The agreement becomes available after quotation acceptance. Payments originate from invoices under the agreed schedule."],
    ["HOW IS PROGRESS TRACKED?", "The Client Portal presents milestones, messages, files, invoices, and actions awaiting review."],
  ];

  return (
    <section className="rrs-grain relative border-b border-white/[.06] bg-[#1d1f1e] text-white">
      <div className="relative z-10 mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:px-8 lg:grid-cols-[.78fr_1.22fr] lg:gap-20 lg:px-12 lg:py-32 xl:px-16">
        <div className="lg:sticky lg:top-28 lg:self-start"><p className="text-[10px] font-black uppercase tracking-[.2em] text-accent-lime">FAQ</p><h2 className="mt-5 font-display text-[clamp(3.3rem,6vw,6.2rem)] font-black uppercase leading-[.84] tracking-[-.07em]">{isId ? "MASIH PUNYA PERTANYAAN?" : "STILL HAVE QUESTIONS?"}</h2><p className="mt-6 max-w-md text-base text-white/62">{isId ? "Kami dapat membantu menjelaskan kebutuhan sebelum technical brief formal." : "We can clarify the requirement before the formal technical brief."}</p><Button asChild variant="outline" className="mt-8 rounded-full border-white/15 bg-white/[.05] text-white hover:bg-white/10"><Link href="/contact">{isId ? "Hubungi RRS" : "Contact RRS"}<MessageCircle className="size-4" aria-hidden="true" /></Link></Button></div>
        <div className="rounded-[24px] border border-white/[.07] bg-[#272927] px-5 sm:px-8">{faq.map(([question, answer], index) => <details key={question} open={index === 0} className="group border-b border-white/10 py-7 last:border-b-0"><summary className="grid min-h-11 cursor-pointer list-none grid-cols-[1fr_auto] items-start gap-5 font-display text-xl font-black uppercase leading-[1.05] tracking-[-.035em] sm:text-2xl"><span>{question}</span><span className="text-accent-lime transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary><p className="mt-5 max-w-2xl text-sm leading-7 text-white/52">{answer}</p></details>)}</div>
      </div>
    </section>
  );
}

export function ReferenceClosingStage({ isId, primaryHref, primaryLabel }: { isId: boolean; primaryHref: string; primaryLabel: string }) {
  const headline = isId ? ["SATU WORKFLOW DARI BRIEF", "HINGGA DELIVERY"] : ["ONE WORKFLOW FROM BRIEF", "THROUGH DELIVERY"];
  return (
    <section data-closing-stage className="rrs-grain relative overflow-hidden bg-[#1a1c1b] px-5 py-24 text-white md:px-8 lg:px-12 lg:py-32">
      <div className="relative z-10 mx-auto max-w-[1160px] overflow-hidden rounded-[34px] border border-white/10 bg-[radial-gradient(circle_at_50%_10%,rgba(200,237,115,.14),transparent_36%),linear-gradient(180deg,#302d1d,#25241d)] px-5 pb-0 pt-14 text-center shadow-[0_42px_120px_rgba(0,0,0,.4)] sm:px-9 lg:pt-16">
        <p className="text-[10px] font-black uppercase tracking-[.2em] text-accent-lime">{isId ? "MULAI DENGAN SCOPE" : "START WITH SCOPE"}</p>
        <h2 aria-label={headline.join(" ")} className="mx-auto mt-5 max-w-5xl font-display text-[clamp(2.8rem,5vw,5.2rem)] font-black uppercase leading-[.84] tracking-[-.07em]">{headline.map((line) => <span key={line} className="block lg:whitespace-nowrap">{line}</span>)}</h2>
        <Button asChild size="lg" className="mt-7 rounded-full bg-accent-lime px-7 text-background hover:bg-[#d7f58f]"><Link href={primaryHref}>{primaryLabel}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button>

        <div data-closing-browser className="mx-auto mt-12 max-w-[900px] translate-y-10 overflow-hidden rounded-t-[22px] border border-white/15 bg-[#202320] text-left shadow-[0_36px_100px_rgba(0,0,0,.45)]">
          <div className="flex h-11 items-center gap-2 border-b border-white/10 bg-[#353835] px-4"><span className="size-2 rounded-full bg-[#f37b65]" /><span className="size-2 rounded-full bg-[#e7c35c]" /><span className="size-2 rounded-full bg-[#69b77c]" /><div className="mx-auto hidden h-5 w-1/3 rounded-full border border-white/[.06] bg-black/15 sm:block" /><span className="text-[7px] font-bold uppercase tracking-[.12em] text-white/35">RRS / DEMO</span></div>
          <div className="grid min-h-[420px] grid-cols-[46px_1fr] sm:grid-cols-[62px_1fr]">
            <aside className="border-r border-white/10 bg-[#181a19] py-5"><span className="mx-auto grid size-8 place-items-center rounded-full bg-accent-lime font-display font-black text-background">R</span><div className="mt-7 grid gap-4">{[FolderKanban, FileCheck2, ReceiptText].map((Icon, index) => <span key={index} className={`mx-auto grid size-7 place-items-center rounded-full ${index === 0 ? "bg-white text-background" : "bg-white/[.06] text-white/35"}`}><Icon className="size-3.5" aria-hidden="true" /></span>)}</div></aside>
            <div className="p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[8px] font-bold uppercase tracking-[.15em] text-white/35">{isId ? "Project workspace" : "Project workspace"}</p><h3 className="mt-2 font-display text-2xl font-black tracking-[-.04em]">{isId ? "Scope jelas. Progress terlihat." : "Clear scope. Visible progress."}</h3></div><span className="rounded-full bg-[#30472f] px-3 py-1 text-[8px] font-bold uppercase tracking-[.1em] text-accent-lime">{isId ? "Aktif" : "Active"}</span></div><div className="mt-7 grid gap-4 sm:grid-cols-[1.2fr_.8fr]"><div className="rounded-[16px] border border-white/10 bg-[#292c2a] p-5"><p className="text-[9px] uppercase tracking-[.12em] text-white/38">{isId ? "Progress project" : "Project progress"}</p><p className="mt-4 font-display text-4xl font-black text-accent-lime">68%</p><div className="mt-5 h-1.5 rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-accent-lime" /></div><p className="mt-3 text-[10px] text-white/42">{isId ? "Development → Client review" : "Development → Client review"}</p></div><div className="rounded-[16px] border border-white/10 bg-[#30472f] p-5"><p className="text-[9px] uppercase tracking-[.12em] text-white/38">{isId ? "Keputusan berikutnya" : "Next decision"}</p><p className="mt-5 font-display text-xl font-black">{isId ? "Tinjau milestone" : "Review milestone"}</p><p className="mt-3 text-[10px] leading-5 text-white/45">{isId ? "File dan catatan tersedia di portal." : "Files and notes are available in the portal."}</p></div></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
