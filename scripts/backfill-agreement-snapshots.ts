import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { buildAgreementSnapshot } from "../src/features/agreements/content";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
const apply = process.argv.includes("--apply");

type JsonObject = Record<string, unknown>;
function asObject(value: unknown): JsonObject { return value && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {}; }

async function main() {
  const agreements = await prisma.agreement.findMany({
    include: {
      project: { include: { client: true } },
      quotation: { include: { items: { orderBy: { sequence: "asc" } }, paymentTerms: { orderBy: { sequence: "asc" } } } },
    },
  });
  let enriched = 0;
  let skipped = 0;

  for (const agreement of agreements) {
    const existing = asObject(agreement.contentSnapshot);
    const complete = existing.schemaVersion === 2 && Array.isArray(existing.paymentTerms) && Array.isArray(existing.standardClauses) && Boolean(existing.client) && Boolean(existing.commercial);
    if (complete) { skipped += 1; continue; }

    const fresh = buildAgreementSnapshot({ quotation: agreement.quotation, client: agreement.project.client });
    const client = { ...fresh.client, ...asObject(existing.client) };
    const project = { ...fresh.project, ...asObject(existing.project) };
    const commercial = { ...fresh.commercial, ...asObject(existing.commercial) };
    const snapshot = {
      ...fresh,
      ...existing,
      schemaVersion: 2,
      client,
      project,
      commercial,
      items: Array.isArray(existing.items) ? existing.items : fresh.items,
      paymentTerms: Array.isArray(existing.paymentTerms) ? existing.paymentTerms : fresh.paymentTerms,
      standardClauses: Array.isArray(existing.standardClauses) ? existing.standardClauses : fresh.standardClauses,
      scopeIncluded: existing.scopeIncluded ?? fresh.scopeIncluded,
      scopeExcluded: existing.scopeExcluded ?? fresh.scopeExcluded,
      revisionLimit: existing.revisionLimit ?? fresh.revisionLimit,
      maintenanceDays: existing.maintenanceDays ?? fresh.maintenanceDays,
      ownerTerms: existing.ownerTerms ?? existing.terms ?? fresh.ownerTerms,
    };

    enriched += 1;
    if (apply) await prisma.agreement.update({ where: { id: agreement.id }, data: { contentSnapshot: snapshot } });
    console.log(`${apply ? "ENRICHED" : "WOULD ENRICH"} ${agreement.agreementNumber}`);
  }

  console.log(`\n${apply ? "Applied" : "Dry run"}: ${enriched} enriched, ${skipped} already complete.`);
}

main().then(() => prisma.$disconnect()).catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });
