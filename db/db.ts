import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

export const runtime = "edge";

// Check if there's already a PrismaClient instance in the global scope
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const db = globalForPrisma.prisma || new PrismaClient({ adapter });

// If we just created a new PrismaClient instance, save it to the global scope
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = db;
}
