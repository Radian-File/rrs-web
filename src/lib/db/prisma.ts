import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { getServerEnv } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const env = getServerEnv();
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

  return new PrismaClient({ adapter });
}

// Do not retain a development singleton across Fast Refresh: Prisma schema changes can
// add delegates (for example, `serviceType`) that an older cached instance does not expose.
export const prisma = process.env.NODE_ENV === "production"
  ? (globalForPrisma.prisma ?? createPrismaClient())
  : createPrismaClient();

if (process.env.NODE_ENV === "production") {
  globalForPrisma.prisma = prisma;
}
