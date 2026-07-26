import type { Prisma } from "@/generated/prisma/client";

type CatalogService = {
  typeSlug: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  catalogKind: "PROJECT" | "MICRO_TASK";
  startingPrice: string | null;
  deliveryEstimate: string | null;
  revisionGuidance: string | null;
  deliverables: string[];
  technologies: string[];
  searchAliases: string[];
  levels?: Array<{
    code: "ESSENTIAL" | "ADVANCED" | "PREMIUM";
    title: string;
    summary: string;
    indicators: string[];
    escalationSignals: string[];
    startingPrice: string;
    sortOrder: number;
  }>;
};

const serviceTypes = [
  { name: "Website Development", slug: "website-development", icon: "monitor", sortOrder: 10 },
  { name: "Android Development", slug: "android-development", icon: "smartphone", sortOrder: 20 },
  { name: "Desktop Application", slug: "desktop-application", icon: "monitor-cog", sortOrder: 30 },
  { name: "UI/UX Design", slug: "ui-ux-design", icon: "palette", sortOrder: 40 },
  { name: "Web Application & Business Systems", slug: "web-application-business-systems", icon: "layout-dashboard", sortOrder: 50 },
  { name: "Backend, API & Integration", slug: "backend-api-integration", icon: "waypoints", sortOrder: 60 },
  { name: "Maintenance & Technical Support", slug: "maintenance-technical-support", icon: "wrench", sortOrder: 70 },
] as const;

const projectLevels: CatalogService["levels"] = [
  {
    code: "ESSENTIAL",
    title: "Essential",
    summary: "Untuk satu tujuan utama dengan workflow sederhana dan risiko teknis yang terbatas.",
    indicators: ["Satu workflow utama", "Halaman atau screen terbatas", "Interaksi dan integrasi ringan"],
    escalationSignals: ["Membutuhkan dashboard atau role pengguna", "Memerlukan data online atau integrasi", "Scope mulai mencakup beberapa workflow"],
    startingPrice: "1000000",
    sortOrder: 10,
  },
  {
    code: "ADVANCED",
    title: "Advanced",
    summary: "Untuk kebutuhan bisnis custom dengan data, workflow, atau integrasi yang lebih berkembang.",
    indicators: ["Beberapa halaman atau screen", "Data online, login, atau dashboard", "Integrasi dan reporting yang terarah"],
    escalationSignals: ["Role dan approval semakin kompleks", "Membutuhkan real-time, payment, atau banyak integrasi", "Perlu arsitektur dan risiko delivery yang lebih tinggi"],
    startingPrice: "4000000",
    sortOrder: 20,
  },
  {
    code: "PREMIUM",
    title: "Premium",
    summary: "Untuk sistem dengan workflow multi-role, integrasi lanjutan, dan kebutuhan arsitektur yang lebih kompleks.",
    indicators: ["Workflow dan role yang saling terhubung", "Integrasi atau data lintas sistem", "Performa, keamanan, dan delivery membutuhkan perencanaan khusus"],
    escalationSignals: ["Scope perlu dipecah menjadi phase delivery", "Ada kebutuhan compliance atau hardware", "Discovery teknis diperlukan sebelum estimate diperluas"],
    startingPrice: "10000000",
    sortOrder: 30,
  },
];

const catalogServices: CatalogService[] = [
  {
    typeSlug: "website-development",
    title: "Website Development",
    slug: "website-development",
    summary: "Website custom dengan struktur konten, pengalaman pengguna, dan arah conversion yang jelas.",
    description: "Mulai dari landing page hingga website bisnis dengan scope yang ditentukan melalui discovery dan quotation.",
    category: "Website Development",
    catalogKind: "PROJECT",
    startingPrice: "1000000",
    deliveryEstimate: null,
    revisionGuidance: "Ditetapkan melalui quotation",
    deliverables: ["Responsive implementation", "Scope dan handoff yang disepakati"],
    technologies: ["Web development", "SEO foundation", "Deployment"],
    searchAliases: ["website", "landing page", "company profile"],
    levels: projectLevels,
  },
  {
    typeSlug: "android-development",
    title: "Android Development",
    slug: "android-development",
    summary: "Aplikasi Android untuk workflow, layanan, atau kebutuhan operasional yang telah ditinjau bersama.",
    description: "Capability draft untuk aplikasi Android. Stack, release policy, dan scope final dikonfirmasi sebelum dipublikasikan atau dikutip.",
    category: "Android Development",
    catalogKind: "PROJECT",
    startingPrice: "3000000",
    deliveryEstimate: null,
    revisionGuidance: "Ditetapkan melalui quotation",
    deliverables: ["Android workflow yang disepakati", "Release and handoff scope"],
    technologies: ["Android", "API integration", "Mobile UI"],
    searchAliases: ["android app", "mobile app", "webview"],
    levels: projectLevels.map((level) => ({
      ...level,
      startingPrice: level.code === "ESSENTIAL" ? "3000000" : level.code === "ADVANCED" ? "8000000" : "20000000",
    })),
  },
  {
    typeSlug: "desktop-application",
    title: "Desktop Application",
    slug: "desktop-application",
    summary: "Aplikasi desktop untuk kebutuhan tool, data, dan workflow operasional yang telah didefinisikan bersama.",
    description: "Capability draft untuk aplikasi desktop. Platform, distribution, hardware, dan support boundary ditinjau sebelum dipublikasikan atau dikutip.",
    category: "Desktop Application",
    catalogKind: "PROJECT",
    startingPrice: "2500000",
    deliveryEstimate: null,
    revisionGuidance: "Ditetapkan melalui quotation",
    deliverables: ["Desktop workflow yang disepakati", "Distribution and handoff scope"],
    technologies: ["Desktop application", "Local or server data", "Operational workflow"],
    searchAliases: ["desktop app", "desktop application", "utility tool"],
    levels: projectLevels.map((level) => ({
      ...level,
      startingPrice: level.code === "ESSENTIAL" ? "2500000" : level.code === "ADVANCED" ? "7000000" : "18000000",
    })),
  },
  {
    typeSlug: "maintenance-technical-support",
    title: "Micro Task & Quick Fix",
    slug: "micro-task-quick-fix",
    summary: "Perubahan kecil dengan scope terbatas setelah quick assessment.",
    description: "Untuk update kecil, perbaikan ringan, atau konsultasi singkat. Bukan untuk fitur besar, investigasi panjang, atau pembangunan aplikasi lengkap.",
    category: "Maintenance & Technical Support",
    catalogKind: "MICRO_TASK",
    startingPrice: "100000",
    deliveryEstimate: null,
    revisionGuidance: "Bergantung pada hasil assessment",
    deliverables: ["Small scoped change", "Escalation ke project bila scope berkembang"],
    technologies: ["Technical support", "Quick assessment"],
    searchAliases: ["quick fix", "bug fix", "micro task", "small update"],
  },
];

export type CatalogImportResult = {
  createdTypes: number;
  createdServices: number;
  createdLevels: number;
  skippedServices: number;
};

export async function importDefaultServiceCatalog(tx: Prisma.TransactionClient): Promise<CatalogImportResult> {
  const result: CatalogImportResult = { createdTypes: 0, createdServices: 0, createdLevels: 0, skippedServices: 0 };
  const typeIds = new Map<string, string>();

  for (const type of serviceTypes) {
    const current = await tx.serviceType.findUnique({ where: { slug: type.slug }, select: { id: true } });
    if (current) {
      typeIds.set(type.slug, current.id);
      continue;
    }
    const created = await tx.serviceType.create({ data: type, select: { id: true } });
    typeIds.set(type.slug, created.id);
    result.createdTypes += 1;
  }

  for (const service of catalogServices) {
    const existing = await tx.service.findUnique({ where: { slug: service.slug }, select: { id: true } });
    const serviceId = existing?.id ?? (await tx.service.create({
      data: {
        title: service.title,
        slug: service.slug,
        summary: service.summary,
        description: service.description,
        category: service.category,
        serviceTypeId: typeIds.get(service.typeSlug),
        catalogKind: service.catalogKind,
        showInPricingGuide: false,
        startingPrice: service.startingPrice,
        currency: "IDR",
        deliveryEstimate: service.deliveryEstimate,
        revisionGuidance: service.revisionGuidance,
        deliverables: service.deliverables,
        technologies: service.technologies,
        searchAliases: service.searchAliases,
        isFeatured: false,
        isPublished: false,
      },
      select: { id: true },
    })).id;

    if (existing) result.skippedServices += 1;
    else result.createdServices += 1;

    for (const level of service.levels ?? []) {
      const levelExists = await tx.serviceComplexityLevel.findUnique({
        where: { serviceId_code: { serviceId, code: level.code } },
        select: { id: true },
      });
      if (levelExists) continue;
      await tx.serviceComplexityLevel.create({
        data: { serviceId, ...level, currency: "IDR", isPublished: false },
      });
      result.createdLevels += 1;
    }
  }

  return result;
}
