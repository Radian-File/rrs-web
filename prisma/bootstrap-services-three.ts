import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { servicesThreeCatalog } from "../src/features/services/services-iii-catalog";
import { importServicesThreeCatalog } from "../src/features/services/services-iii-catalog-import";

const confirmation = process.env.RRS_CONFIRM_BOOTSTRAP;
const databaseUrl = process.env.DATABASE_URL;

if (confirmation !== "reset-production") {
  throw new Error("Set RRS_CONFIRM_BOOTSTRAP=reset-production sebelum bootstrap Services III.");
}

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  const historicalRecords = await prisma.$transaction([
    prisma.inquiry.count(),
    prisma.quotation.count(),
    prisma.project.count(),
    prisma.invoice.count(),
    prisma.review.count(),
  ]);

  if (historicalRecords.some((count) => count > 0)) {
    throw new Error("Bootstrap Services III hanya boleh dijalankan pada database tanpa data bisnis historis.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const imported = await importServicesThreeCatalog(tx);
    const serviceIds: string[] = [];

    for (const preset of servicesThreeCatalog) {
      const service = await tx.service.findUnique({
        where: { slug: preset.slug },
        select: { id: true },
      });

      if (!service) {
        throw new Error(`Services III tidak dapat menemukan layanan ${preset.slug} setelah import.`);
      }

      serviceIds.push(service.id);

      await tx.service.update({
        where: { id: service.id },
        data: { isPublished: true, showInPricingGuide: true },
      });

      for (const level of preset.levels) {
        await tx.serviceComplexityLevel.upsert({
          where: { serviceId_code: { serviceId: service.id, code: level.code } },
          create: { serviceId: service.id, ...level, currency: "IDR", isPublished: true },
          update: {
            title: level.title,
            summary: level.summary,
            indicators: level.indicators,
            escalationSignals: level.escalationSignals,
            startingPrice: level.startingPrice,
            currency: "IDR",
            sortOrder: level.sortOrder,
            isPublished: true,
          },
        });
      }
    }

    const publishedLevels = await tx.serviceComplexityLevel.count({
      where: { serviceId: { in: serviceIds }, isPublished: true },
    });

    return { imported, publishedServices: serviceIds.length, publishedLevels };
  });

  if (result.publishedServices !== 24 || result.publishedLevels !== 72) {
    throw new Error(`Bootstrap tidak lengkap: ${result.publishedServices} layanan dan ${result.publishedLevels} level.`);
  }

  console.log(JSON.stringify(result, null, 2));
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    await prisma.$disconnect();
    throw error;
  });
