import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** Shared IPv4 Supavisor host for this project (eu-west-1). */
const DEFAULT_SUPABASE_POOLER_HOST = "aws-1-eu-west-1.pooler.supabase.com";

/**
 * Vercel cannot reach `db.*.supabase.co` (IPv6-only). Rewrite those URLs to
 * the shared Supavisor pooler (IPv4, port 6543, transaction mode).
 */
function resolveDatabaseUrl(): string | undefined {
  const pooled = process.env.DATABASE_URL;
  const direct = process.env.DIRECT_URL;
  const poolerHost =
    process.env.SUPABASE_POOLER_HOST ?? DEFAULT_SUPABASE_POOLER_HOST;

  if (pooled) {
    try {
      const u = new URL(pooled);
      const isSupabaseDbHost =
        u.hostname.startsWith("db.") && u.hostname.endsWith(".supabase.co");
      if (isSupabaseDbHost) {
        const ref = u.hostname.slice("db.".length, -".supabase.co".length);
        const user = u.username.includes(".")
          ? u.username
          : `${u.username}.${ref}`;
        const rewritten = new URL(`postgresql://${poolerHost}:6543/postgres`);
        rewritten.username = user;
        rewritten.password = decodeURIComponent(u.password);
        rewritten.searchParams.set("pgbouncer", "true");
        rewritten.searchParams.set("connection_limit", "1");
        return rewritten.toString();
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
