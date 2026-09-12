import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Vercel (AWS us-east-1) cannot reach Supabase's pgbouncer port 6543 on
 * db.*.supabase.co. Use the direct connection (5432) instead.
 */
function resolveDatabaseUrl(): string | undefined {
  const pooled = process.env.DATABASE_URL;
  const direct = process.env.DIRECT_URL;

  if (pooled) {
    try {
      const u = new URL(pooled);
      const isSupabaseDbHost =
        u.hostname.startsWith("db.") && u.hostname.endsWith(".supabase.co");
      if (isSupabaseDbHost && u.port === "6543") {
        if (direct) return direct;
        u.port = "5432";
        u.searchParams.delete("pgbouncer");
        return u.toString();
      }
    } catch {
      return pooled;
    }
    return pooled;
  }

  return direct;
}

const databaseUrl = resolveDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    databaseUrl ? { datasources: { db: { url: databaseUrl } } } : undefined,
  );

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
