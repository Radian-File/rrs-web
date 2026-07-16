import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
async function main() { for (const { category } of await prisma.service.findMany({ distinct: ["category"], select: { category: true } })) { const type = await prisma.serviceType.upsert({ where: { name: category }, update: {}, create: { name: category, slug: slug(category), icon: "globe" } }); await prisma.service.updateMany({ where: { category, serviceTypeId: null }, data: { serviceTypeId: type.id } }); } }
main().finally(() => prisma.$disconnect());
