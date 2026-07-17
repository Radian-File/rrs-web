import { z } from "zod";

const moneySchema = z.string();
const itemSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  quantity: moneySchema,
  unitPrice: moneySchema,
  total: moneySchema,
});
const paymentTermSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  percentage: moneySchema.nullable().optional(),
  amount: moneySchema,
  dueTrigger: z.string(),
  sequence: z.number(),
});
const clauseSchema = z.object({ title: z.string(), body: z.string() });

const v2SnapshotSchema = z.object({
  schemaVersion: z.literal(2),
  standardTermsVersion: z.string(),
  quotation: z.object({ number: z.string(), version: z.number() }),
  client: z.object({ name: z.string(), email: z.string().nullable(), companyName: z.string().nullable() }),
  project: z.object({ title: z.string(), type: z.string().nullable(), summary: z.string().nullable(), estimatedStartDate: z.string().nullable(), estimatedCompletionAt: z.string().nullable() }),
  commercial: z.object({ currency: z.string(), subtotal: moneySchema, discount: moneySchema, tax: moneySchema, total: moneySchema }),
  items: z.array(itemSchema),
  paymentTerms: z.array(paymentTermSchema),
  scopeIncluded: z.string().nullable(),
  scopeExcluded: z.string().nullable(),
  revisionLimit: z.number().nullable(),
  maintenanceDays: z.number().nullable(),
  ownerTerms: z.string().nullable(),
  standardClauses: z.array(clauseSchema),
});

const legacySnapshotSchema = z.object({
  quotationNumber: z.string().optional(),
  quotationVersion: z.number().optional(),
  scopeIncluded: z.string().nullable().optional(),
  scopeExcluded: z.string().nullable().optional(),
  revisionLimit: z.number().nullable().optional(),
  maintenanceDays: z.number().nullable().optional(),
  terms: z.string().nullable().optional(),
  total: moneySchema.optional(),
  items: z.array(itemSchema).optional(),
  paymentTerms: z.array(paymentTermSchema).optional(),
}).passthrough();

export const standardAgreementClauses = [
  { title: "Ruang lingkup dan perubahan", body: "Pekerjaan mencakup deliverables yang tercantum dalam agreement ini. Permintaan di luar scope akan dibahas dan disetujui secara tertulis sebelum memengaruhi biaya atau timeline." },
  { title: "Tanggung jawab client", body: "Client menyediakan materi, akses, umpan balik, dan keputusan yang diperlukan secara tepat waktu. Keterlambatan dependency dari client dapat menyesuaikan timeline delivery." },
  { title: "Pembayaran dan awal pekerjaan", body: "Pekerjaan dimulai sesuai syarat pembayaran pada schedule. Pembayaran yang terlambat dapat menunda pekerjaan sampai status pembayaran diselesaikan." },
  { title: "Revisi dan persetujuan", body: "Batas revisi mengikuti agreement ini. Umpan balik diberikan secara terkonsolidasi oleh pihak client yang berwenang agar proses review tetap jelas dan terukur." },
  { title: "Delivery dan maintenance", body: "Delivery mengikuti scope yang disetujui. Masa maintenance, bila tercantum, mencakup perbaikan terhadap deliverable yang telah disetujui dan tidak mencakup fitur atau perubahan scope baru." },
  { title: "Handover dan penggunaan hasil", body: "Handover dilakukan sesuai deliverables. Pengalihan atau penggunaan hasil kerja mengikuti penyelesaian kewajiban pembayaran yang disepakati." },
  { title: "Kerahasiaan dan portofolio", body: "Kedua pihak menjaga informasi nonpublik yang diterima selama proyek. RRS hanya menggunakan project sebagai portofolio dengan persetujuan client atau ketika informasi tersebut telah menjadi publik." },
  { title: "Penundaan, pembatalan, dan komunikasi", body: "Perubahan besar, penundaan, atau pembatalan dibahas secara tertulis dengan mengacu pada pekerjaan dan pembayaran yang telah berjalan. Kedua pihak mengutamakan komunikasi yang jelas untuk penyelesaian masalah." },
] as const;

export type AgreementSnapshot = z.infer<typeof v2SnapshotSchema>;

type SnapshotInput = {
  quotation: {
    quotationNumber: string; version: number; clientName: string; clientEmail: string | null; companyName: string | null;
    projectTitle: string; projectType: string | null; projectSummary: string | null; estimatedStartDate: Date | null; estimatedCompletionAt: Date | null;
    currency: string; subtotal: { toString(): string }; discount: { toString(): string }; tax: { toString(): string }; total: { toString(): string };
    scopeIncluded: string | null; scopeExcluded: string | null; revisionLimit: number | null; maintenanceDays: number | null; terms: string | null;
    items: Array<{ title: string; description: string | null; quantity: { toString(): string }; unitPrice: { toString(): string }; total: { toString(): string } }>;
    paymentTerms: Array<{ title: string; description: string | null; percentage: { toString(): string } | null; amount: { toString(): string }; dueTrigger: string; sequence: number }>;
  };
  client?: { name: string; email: string; companyName: string | null };
};

export function buildAgreementSnapshot({ quotation, client }: SnapshotInput): AgreementSnapshot {
  return {
    schemaVersion: 2,
    standardTermsVersion: "rrs-collaboration-v1",
    quotation: { number: quotation.quotationNumber, version: quotation.version },
    client: { name: client?.name ?? quotation.clientName, email: client?.email ?? quotation.clientEmail, companyName: client?.companyName ?? quotation.companyName },
    project: { title: quotation.projectTitle, type: quotation.projectType, summary: quotation.projectSummary, estimatedStartDate: quotation.estimatedStartDate?.toISOString() ?? null, estimatedCompletionAt: quotation.estimatedCompletionAt?.toISOString() ?? null },
    commercial: { currency: quotation.currency, subtotal: quotation.subtotal.toString(), discount: quotation.discount.toString(), tax: quotation.tax.toString(), total: quotation.total.toString() },
    items: quotation.items.map((item) => ({ title: item.title, description: item.description, quantity: item.quantity.toString(), unitPrice: item.unitPrice.toString(), total: item.total.toString() })),
    paymentTerms: quotation.paymentTerms.map((term) => ({ title: term.title, description: term.description, percentage: term.percentage?.toString() ?? null, amount: term.amount.toString(), dueTrigger: term.dueTrigger, sequence: term.sequence })),
    scopeIncluded: quotation.scopeIncluded,
    scopeExcluded: quotation.scopeExcluded,
    revisionLimit: quotation.revisionLimit,
    maintenanceDays: quotation.maintenanceDays,
    ownerTerms: quotation.terms,
    standardClauses: [...standardAgreementClauses],
  };
}

export function normalizeAgreementSnapshot(value: unknown): AgreementSnapshot {
  const current = v2SnapshotSchema.safeParse(value);
  if (current.success) return current.data;

  const legacy = legacySnapshotSchema.safeParse(value);
  if (!legacy.success) throw new Error("Agreement snapshot is malformed.");
  const data = legacy.data;
  return {
    schemaVersion: 2,
    standardTermsVersion: "rrs-collaboration-v1",
    quotation: { number: data.quotationNumber ?? "—", version: data.quotationVersion ?? 1 },
    client: { name: "—", email: null, companyName: null },
    project: { title: "—", type: null, summary: null, estimatedStartDate: null, estimatedCompletionAt: null },
    commercial: { currency: "IDR", subtotal: data.total ?? "0", discount: "0", tax: "0", total: data.total ?? "0" },
    items: data.items ?? [],
    paymentTerms: data.paymentTerms ?? [],
    scopeIncluded: data.scopeIncluded ?? null,
    scopeExcluded: data.scopeExcluded ?? null,
    revisionLimit: data.revisionLimit ?? null,
    maintenanceDays: data.maintenanceDays ?? null,
    ownerTerms: data.terms ?? null,
    standardClauses: [...standardAgreementClauses],
  };
}
