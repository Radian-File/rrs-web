import type { Prisma } from "@/generated/prisma/client";

type CatalogLevel = {
  code: "ESSENTIAL" | "ADVANCED" | "PREMIUM";
  title: string;
  summary: string;
  indicators: string[];
  escalationSignals: string[];
  startingPrice: string | null;
  sortOrder: number;
};

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
  levels?: CatalogLevel[];
};

type DraftSpec = {
  typeSlug: string;
  category: string;
  title: string;
  slug: string;
  summary: string;
  aliases?: string[];
  technologies?: string[];
  hasLevels?: boolean;
};

const serviceTypes = [
  { name: "Website Development", slug: "website-development", icon: "monitor", sortOrder: 10 },
  { name: "Web Application & Business Systems", slug: "web-application-business-systems", icon: "layout-dashboard", sortOrder: 20 },
  { name: "Android Development", slug: "android-development", icon: "smartphone", sortOrder: 30 },
  { name: "Desktop Application", slug: "desktop-application", icon: "monitor-cog", sortOrder: 40 },
  { name: "UI/UX Design", slug: "ui-ux-design", icon: "palette", sortOrder: 50 },
  { name: "Backend & System Services", slug: "backend-system-services", icon: "waypoints", sortOrder: 60 },
  { name: "Additional Technical Services", slug: "additional-technical-services", icon: "settings-2", sortOrder: 70 },
  { name: "Maintenance & Technical Support", slug: "maintenance-technical-support", icon: "wrench", sortOrder: 80 },
] as const;

export function defaultComplexityLevels(prices?: Partial<Record<CatalogLevel["code"], string>>): CatalogLevel[] {
  return [
    {
      code: "ESSENTIAL",
      title: "Essential",
      summary: "Untuk satu tujuan utama dengan workflow sederhana dan risiko teknis yang terbatas.",
      indicators: ["Satu workflow utama", "Halaman atau screen terbatas", "Interaksi dan integrasi ringan"],
      escalationSignals: ["Membutuhkan dashboard atau role pengguna", "Memerlukan data online atau integrasi", "Scope mulai mencakup beberapa workflow"],
      startingPrice: prices?.ESSENTIAL ?? null,
      sortOrder: 10,
    },
    {
      code: "ADVANCED",
      title: "Advanced",
      summary: "Untuk kebutuhan custom dengan data, workflow, atau integrasi yang lebih berkembang.",
      indicators: ["Beberapa halaman atau screen", "Data online, login, atau dashboard", "Integrasi dan reporting yang terarah"],
      escalationSignals: ["Role dan approval semakin kompleks", "Membutuhkan real-time, payment, atau banyak integrasi", "Perlu arsitektur dan risiko delivery yang lebih tinggi"],
      startingPrice: prices?.ADVANCED ?? null,
      sortOrder: 20,
    },
    {
      code: "PREMIUM",
      title: "Premium",
      summary: "Untuk sistem dengan workflow multi-role, integrasi lanjutan, dan kebutuhan arsitektur yang lebih kompleks.",
      indicators: ["Workflow dan role yang saling terhubung", "Integrasi atau data lintas sistem", "Performa, keamanan, dan delivery membutuhkan perencanaan khusus"],
      escalationSignals: ["Scope perlu dipecah menjadi phase delivery", "Ada kebutuhan compliance atau hardware", "Discovery teknis diperlukan sebelum estimate diperluas"],
      startingPrice: prices?.PREMIUM ?? null,
      sortOrder: 30,
    },
  ];
}

function draftService(spec: DraftSpec): CatalogService {
  const hasLevels = spec.hasLevels ?? true;
  return {
    typeSlug: spec.typeSlug,
    title: spec.title,
    slug: spec.slug,
    summary: spec.summary,
    description: `${spec.title} adalah template layanan draft yang dapat disesuaikan Owner setelah discovery. Scope, deliverables, timeline, revision, provider cost, dan harga final selalu dikonfirmasi melalui quotation.`,
    category: spec.category,
    catalogKind: "PROJECT",
    startingPrice: null,
    deliveryEstimate: null,
    revisionGuidance: "Ditetapkan melalui quotation",
    deliverables: ["Scope yang disepakati melalui quotation", "Handoff sesuai kebutuhan project"],
    technologies: spec.technologies ?? ["Custom workflow", "Discovery", "Technical handoff"],
    searchAliases: spec.aliases ?? [],
    levels: hasLevels ? defaultComplexityLevels() : undefined,
  };
}

const catalogServices: CatalogService[] = [
  {
    ...draftService({
      typeSlug: "website-development",
      category: "Website Development",
      title: "Website Development",
      slug: "website-development",
      summary: "Website custom dengan struktur konten, pengalaman pengguna, dan arah conversion yang jelas.",
      aliases: ["website", "landing page", "company profile"],
      technologies: ["Web development", "SEO foundation", "Deployment"],
    }),
    startingPrice: "1000000",
    levels: defaultComplexityLevels({ ESSENTIAL: "1000000", ADVANCED: "4000000", PREMIUM: "10000000" }),
  },
  ...[
    ["Landing Page", "landing-page-campaign", "Landing page untuk campaign, validasi ide, lead, atau peluncuran layanan.", ["landing page", "campaign page"]],
    ["Company Profile Website", "company-profile-website", "Website resmi untuk memperkenalkan bisnis, organisasi, atau layanan profesional.", ["company profile", "business website"]],
    ["Portfolio Website", "portfolio-website", "Website untuk menampilkan karya, case study, pengalaman, dan identitas profesional.", ["portfolio", "personal website"]],
    ["E-Commerce Website", "e-commerce-website", "Website penjualan dengan katalog, order flow, dan integrasi yang dibahas sesuai kebutuhan.", ["online store", "ecommerce"]],
    ["Booking & Reservation Website", "booking-reservation-website", "Website untuk reservasi, availability, schedule, atau booking workflow.", ["booking", "reservation"]],
    ["Learning Management System", "learning-management-system", "Platform pembelajaran, course, progress, dan operasional kelas digital.", ["lms", "online course"]],
    ["Membership Website", "membership-website", "Website dengan akses konten atau workflow berdasarkan status keanggotaan.", ["membership", "protected content"]],
    ["Blog & News Website", "blog-news-website", "Website editorial untuk artikel, berita, atau content publishing.", ["blog", "news"]],
    ["Web Application", "web-application", "Aplikasi web custom untuk workflow internal, portal client, dan sistem operasional.", ["web app", "internal tool"]],
    ["Admin Dashboard", "operations-dashboard", "Dashboard untuk mengelola data, content, workflow, dan operasi sistem.", ["dashboard", "admin panel"]],
    ["Website Redesign", "website-redesign", "Redesign website untuk memperbaiki hierarchy, usability, mobile experience, dan visual system.", ["redesign", "ui audit"]],
    ["Website Revamp", "website-revamp", "Pembaruan website menyeluruh dengan mempertimbangkan design, code, responsiveness, dan deployment.", ["revamp", "website update"]],
    ["Website Migration", "website-migration", "Migrasi website, content, hosting, framework, atau database dengan scope yang ditinjau bersama.", ["migration", "hosting migration"]],
    ["Website Performance Optimization", "website-performance-optimization", "Audit dan optimasi performa website berdasarkan bottleneck yang terverifikasi.", ["performance", "core web vitals"]],
    ["Website SEO Setup", "website-seo-setup", "Setup SEO teknis dan content foundation tanpa menjanjikan peringkat mesin pencari.", ["seo", "search console"]],
    ["Website Maintenance", "website-maintenance", "Maintenance website sesuai policy support dan scope periodik yang disepakati.", ["maintenance", "website support"], false],
  ].map(([title, slug, summary, aliases, hasLevels]) => draftService({ typeSlug: title === "Web Application" || title === "Admin Dashboard" ? "web-application-business-systems" : "website-development", category: title === "Web Application" || title === "Admin Dashboard" ? "Web Application & Business Systems" : "Website Development", title: title as string, slug: slug as string, summary: summary as string, aliases: aliases as string[], hasLevels: hasLevels as boolean | undefined })),

  {
    ...draftService({
      typeSlug: "android-development",
      category: "Android Development",
      title: "Android Development",
      slug: "android-development",
      summary: "Aplikasi Android untuk workflow, layanan, atau kebutuhan operasional yang ditinjau bersama.",
      aliases: ["android app", "mobile app", "webview"],
      technologies: ["Android", "API integration", "Mobile UI"],
    }),
    startingPrice: "3000000",
    levels: defaultComplexityLevels({ ESSENTIAL: "3000000", ADVANCED: "8000000", PREMIUM: "20000000" }),
  },
  ...[
    ["Android WebView Application", "android-webview-application", "Aplikasi Android yang membungkus workflow web yang telah tersedia."],
    ["Android Utility Application", "android-utility-application", "Aplikasi Android sederhana untuk utility atau produktivitas."],
    ["Android Business Application", "android-business-application", "Aplikasi Android untuk workflow bisnis atau operasional."],
    ["Android E-Commerce Application", "android-e-commerce-application", "Aplikasi Android untuk katalog, order, dan commerce workflow."],
    ["Android Booking Application", "android-booking-application", "Aplikasi Android untuk booking, availability, dan scheduling."],
    ["Android Delivery Application", "android-delivery-application", "Aplikasi Android untuk workflow delivery yang memerlukan discovery khusus."],
    ["Android Marketplace Application", "android-marketplace-application", "Aplikasi marketplace dengan scope, role, payment, dan risk review terpisah."],
    ["Android Membership Application", "android-membership-application", "Aplikasi untuk membership, protected access, atau subscription workflow."],
    ["Android Learning Application", "android-learning-application", "Aplikasi Android untuk course, learning content, dan progress workflow."],
    ["Android Application Redesign", "android-application-redesign", "Redesign Android app untuk UI, UX, navigation, dan accessibility review."],
    ["Android Application Maintenance", "android-application-maintenance", "Maintenance Android sesuai scope support dan compatibility review." , false],
    ["Android Play Store Support", "android-play-store-support", "Bantuan preparation release Android dengan account dan policy Client yang diperlukan.", false],
  ].map(([title, slug, summary, hasLevels]) => draftService({ typeSlug: "android-development", category: "Android Development", title: title as string, slug: slug as string, summary: summary as string, hasLevels: hasLevels as boolean | undefined })),

  {
    ...draftService({
      typeSlug: "desktop-application",
      category: "Desktop Application",
      title: "Desktop Application",
      slug: "desktop-application",
      summary: "Aplikasi desktop untuk tool, data, dan workflow operasional yang didefinisikan bersama.",
      aliases: ["desktop app", "desktop application", "utility tool"],
      technologies: ["Desktop application", "Local or server data", "Operational workflow"],
    }),
    startingPrice: "2500000",
    levels: defaultComplexityLevels({ ESSENTIAL: "2500000", ADVANCED: "7000000", PREMIUM: "18000000"})
  },
  ...[
    ["Desktop Utility Application", "desktop-utility-application", "Aplikasi desktop sederhana untuk task khusus dan produktivitas."],
    ["Point of Sale Application", "point-of-sale-application", "Aplikasi kasir dengan scope transaksi, inventory, report, dan hardware yang disepakati."],
    ["Inventory Application", "inventory-application", "Aplikasi untuk stock, movement, supplier, warehouse, dan reporting workflow."],
    ["Accounting & Finance Application", "accounting-finance-application", "Aplikasi pencatatan keuangan yang tidak menggantikan keputusan akuntan atau pajak Client."],
    ["Employee Management Application", "employee-management-application", "Aplikasi untuk data dan workflow karyawan dengan privacy review yang diperlukan."],
    ["School Management Application", "school-management-application", "Aplikasi untuk workflow sekolah atau lembaga pendidikan."],
    ["Clinic Management Application", "clinic-management-application", "Aplikasi klinik yang memerlukan security, retention, dan compliance review terpisah."],
    ["Rental Management Application", "rental-management-application", "Aplikasi untuk booking, availability, return, dan rental workflow."],
    ["Document Management Application", "document-management-application", "Aplikasi untuk dokumen, access control, history, dan approval workflow."],
    ["Multi-User Desktop System", "multi-user-desktop-system", "Desktop system dengan user, data, synchronization, dan operational workflow."],
    ["Hardware Integration", "hardware-integration", "Integrasi desktop dengan hardware setelah driver, SDK, dan vendor access ditinjau."],
    ["Desktop Application Maintenance", "desktop-application-maintenance", "Maintenance desktop app sesuai policy support, environment, dan scope yang disepakati.", false],
  ].map(([title, slug, summary, hasLevels]) => draftService({ typeSlug: "desktop-application", category: "Desktop Application", title: title as string, slug: slug as string, summary: summary as string, hasLevels: hasLevels as boolean | undefined })),

  ...[
    ["UI Design", "ui-design", "Desain interface untuk website, Android, desktop, atau product surface."],
    ["UX Design", "ux-design", "Perancangan user flow, information architecture, dan interaction direction."],
    ["UI/UX Audit", "ui-ux-audit", "Evaluasi UI, UX, accessibility, responsiveness, dan usability."],
    ["Design System", "design-system", "Sistem design untuk consistency, component reuse, dan implementation handoff."],
    ["Interactive Prototype", "interactive-prototype", "Prototype interaktif untuk validation, review, atau handoff sebelum development."],
  ].map(([title, slug, summary]) => draftService({ typeSlug: "ui-ux-design", category: "UI/UX Design", title: title as string, slug: slug as string, summary: summary as string, technologies: ["Design workflow", "Prototype", "Handoff"] })),

  ...[
    ["Backend Development", "backend-development", "Backend untuk data, workflow, API, access control, dan operational integration."],
    ["API Development", "api-development", "API untuk frontend, application, database, atau workflow integration."],
    ["Third-Party API Integration", "third-party-api-integration", "Integrasi provider eksternal dengan scope, credential, cost, dan policy yang ditinjau."],
    ["Authentication System", "authentication-system", "Authentication dan authorization system dengan security boundary yang didefinisikan."],
    ["Database Design", "database-design", "Perancangan schema, relation, migration, access rule, dan documentation database."],
    ["Admin Panel Development", "admin-panel-development", "Admin panel untuk content, workflow, report, settings, dan operational management."],
  ].map(([title, slug, summary]) => draftService({ typeSlug: "backend-system-services", category: "Backend & System Services", title: title as string, slug: slug as string, summary: summary as string, technologies: ["Backend", "Database", "Integration"] })),

  ...[
    ["Domain Setup", "domain-setup", "Domain, DNS, redirect, SSL, atau verification setup sesuai Client-owned access.", false],
    ["Hosting & Deployment", "hosting-deployment", "Hosting, environment, deployment, database connection, dan domain setup sesuai quotation.", false],
    ["Email Setup", "email-setup", "Business email, SMTP, sender verification, atau notification email setup.", false],
    ["Analytics Setup", "analytics-setup", "Analytics, Search Console, event tracking, pixel, atau conversion setup.", false],
    ["Content Entry", "content-entry", "Input content, product, article, portfolio, atau category berdasarkan scope quantity.", false],
    ["Data Import & Export", "data-import-export", "Data import/export dari file, database, old system, atau API dengan validation scope.", false],
    ["Technical Consultation", "technical-consultation", "Konsultasi untuk product planning, architecture, estimation, migration, performance, atau security direction.", false],
    ["Technical Documentation", "technical-documentation", "Dokumentasi instalasi, deployment, user, admin, API, database, atau maintenance.", false],
    ["Training & Handover", "training-handover", "Training penggunaan, admin workflow, backup, deployment, atau project handover.", false],
  ].map(([title, slug, summary, hasLevels]) => draftService({ typeSlug: "additional-technical-services", category: "Additional Technical Services", title: title as string, slug: slug as string, summary: summary as string, hasLevels: hasLevels as boolean | undefined })),

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

export const defaultCatalogServiceSlugs = catalogServices.map((service) => service.slug);

export type CatalogImportResult = {
  runId: string | null;
  createdTypes: number;
  createdServices: number;
  createdLevels: number;
  skippedServices: number;
};

export async function importDefaultServiceCatalog(tx: Prisma.TransactionClient): Promise<CatalogImportResult> {
  const run = await tx.catalogImportRun.create({ data: { source: "DEFAULT_CATALOG" }, select: { id: true } });
  const result: CatalogImportResult = { runId: run.id, createdTypes: 0, createdServices: 0, createdLevels: 0, skippedServices: 0 };
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
    else {
      result.createdServices += 1;
      await tx.catalogImportEntry.create({ data: { runId: run.id, serviceId, operation: "CREATED" } });
    }

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

  if (result.createdServices === 0) {
    await tx.catalogImportRun.delete({ where: { id: run.id } });
    result.runId = null;
  }

  return result;
}
