import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  const ownerEmail = process.env.OWNER_EMAIL ?? "owner@example.com";
  const ownerPassword = process.env.OWNER_PASSWORD;

  if (!ownerPassword || ownerPassword.length < 12) {
    throw new Error("OWNER_PASSWORD with at least 12 characters is required for seeding.");
  }

  const passwordHash = await hash(ownerPassword, 12);

  await prisma.user.upsert({
    where: { email: ownerEmail },
    update: { role: "OWNER", passwordHash },
    create: {
      name: "Radian",
      email: ownerEmail,
      passwordHash,
      whatsappNumber: process.env.OWNER_WHATSAPP_NUMBER ?? "6280000000000",
      role: "OWNER",
    },
  });

  const services = [
    {
      slug: "website-development",
      title: "Website Development",
      summary: "Website bisnis modern dengan fondasi performa, SEO, dan pengalaman pengguna yang jelas.",
      description: "Layanan pengembangan website yang disesuaikan dengan kebutuhan, scope, dan tujuan bisnis melalui proses konsultasi dan quotation.",
      category: "Web Development",
      startingPrice: "5000000",
      deliveryEstimate: "14–30 hari",
      revisionGuidance: "Sesuai quotation",
      deliverables: ["Responsive website", "SEO foundation", "Deployment handoff"],
      technologies: ["Next.js", "TypeScript", "PostgreSQL"],
      isFeatured: true,
      isPublished: true,
    },
    {
      slug: "ui-ux-design",
      title: "UI/UX Design",
      summary: "Desain produk digital yang terstruktur, mudah digunakan, dan selaras dengan identitas brand.",
      description: "Mulai dari discovery dan wireframe hingga high-fidelity interface dan developer-ready handoff.",
      category: "Design",
      startingPrice: "2500000",
      deliveryEstimate: "10–21 hari",
      revisionGuidance: "Sesuai quotation",
      deliverables: ["User flow", "High-fidelity UI", "Responsive states"],
      technologies: ["Figma", "Design System", "Prototyping"],
      isFeatured: true,
      isPublished: true,
    },
    {
      slug: "web-application",
      title: "Web Application",
      summary: "Aplikasi web custom untuk workflow internal, portal client, dan sistem operasional.",
      description: "Pengembangan aplikasi full-stack dengan authentication, role, database, dashboard, dan integrasi yang dibutuhkan.",
      category: "Web Development",
      startingPrice: "8000000",
      deliveryEstimate: "30–60 hari",
      revisionGuidance: "Sesuai milestone",
      deliverables: ["Full-stack application", "Role-based access", "Technical documentation"],
      technologies: ["Next.js", "Prisma", "PostgreSQL"],
      isFeatured: true,
      isPublished: true,
    },
    {
      slug: "company-profile-website",
      title: "Company Profile Website",
      summary: "Website perusahaan profesional untuk membangun kredibilitas, menjelaskan layanan, dan mengarahkan calon client ke kontak yang tepat.",
      description: "Referensi layanan untuk website company profile dengan struktur konten yang jelas, desain responsif, fondasi SEO, dan CTA yang mendukung kebutuhan bisnis.",
      category: "Website",
      startingPrice: "4500000",
      deliveryEstimate: "14–28 hari",
      revisionGuidance: "Sesuai quotation",
      deliverables: ["Halaman profil perusahaan", "Responsive layout", "Contact CTA", "SEO foundation"],
      technologies: ["Next.js", "Tailwind CSS", "SEO"],
      isFeatured: false,
      isPublished: false,
    },
    {
      slug: "landing-page-campaign",
      title: "Landing Page Campaign",
      summary: "Landing page fokus konversi untuk kampanye, validasi produk, atau peluncuran layanan baru.",
      description: "Referensi layanan untuk landing page yang memprioritaskan pesan utama, CTA, performa, analitik dasar, dan pengalaman mobile yang rapi.",
      category: "Website",
      startingPrice: "3000000",
      deliveryEstimate: "7–14 hari",
      revisionGuidance: "Satu putaran revisi visual",
      deliverables: ["Conversion-focused landing page", "Responsive implementation", "Analytics-ready CTA"],
      technologies: ["Next.js", "TypeScript", "Analytics"],
      isFeatured: false,
      isPublished: false,
    },
    {
      slug: "operations-dashboard",
      title: "Operations Dashboard",
      summary: "Dashboard internal untuk menyederhanakan monitoring data, proses kerja, dan pengambilan keputusan operasional.",
      description: "Referensi layanan untuk dashboard berbasis role dengan data model, alur kerja, tabel, filter, dan visualisasi yang disesuaikan dengan proses tim.",
      category: "Web Application",
      startingPrice: "10000000",
      deliveryEstimate: "30–75 hari",
      revisionGuidance: "Sesuai milestone dan scope",
      deliverables: ["Role-based dashboard", "Workflow operasional", "Data table dan filter", "Dokumentasi teknis"],
      technologies: ["Next.js", "PostgreSQL", "Prisma", "REST API"],
      isFeatured: false,
      isPublished: false,
    },
    {
      slug: "api-integration-automation",
      title: "API Integration & Automation",
      summary: "Integrasi sistem dan otomatisasi workflow untuk mengurangi pekerjaan manual yang berulang.",
      description: "Referensi layanan untuk kebutuhan API, sinkronisasi data, webhook, automation, dan integrasi layanan pihak ketiga dengan validasi serta observabilitas yang jelas.",
      category: "Integration",
      startingPrice: "5000000",
      deliveryEstimate: "14–30 hari",
      revisionGuidance: "Sesuai scope integrasi",
      deliverables: ["API integration", "Webhook workflow", "Error handling", "Technical handoff"],
      technologies: ["Node.js", "REST API", "PostgreSQL", "Docker"],
      isFeatured: false,
      isPublished: false,
    },
  ];

  for (const [index, service] of services.entries()) {
    const type = await prisma.serviceType.upsert({
      where: { name: service.category },
      update: {},
      create: { name: service.category, slug: service.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), icon: "globe", sortOrder: index },
    });
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: { ...service, serviceTypeId: type.id },
      create: { ...service, serviceTypeId: type.id },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
