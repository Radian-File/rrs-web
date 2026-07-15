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
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
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
