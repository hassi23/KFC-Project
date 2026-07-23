import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Uses the pg driver adapter (pure JS/TCP) instead of Prisma's Rust query engine binary,
// since the Rust engine binaries can't reach the DB on this machine (blocked by local
// firewall/antivirus) even though plain Node.js networking works fine.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
