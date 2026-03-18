import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (process.env.NODE_ENV !== "production") {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ["query"],
    });
  }
}

// Export the Prisma client
export const db = globalForPrisma.prisma!;

// Export types for convenience
export type { PrismaClient } from "@prisma/client";
