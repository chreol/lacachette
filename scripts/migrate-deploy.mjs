import { spawn } from "node:child_process";

const POOLER_HOST = process.env.SUPABASE_POOLER_HOST ?? "aws-1-eu-west-1.pooler.supabase.com";

function isSupabaseDbHost(hostname) {
  return hostname.startsWith("db.") && hostname.endsWith(".supabase.co");
}

/** Vercel cannot open IPv6 `db.*.supabase.co`. Use the IPv4 Supavisor pooler. */
function rewriteToPooler(raw, { port, pgbouncer }) {
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    if (!isSupabaseDbHost(u.hostname)) return raw;
    const ref = u.hostname.slice("db.".length, -".supabase.co".length);
    const user = u.username.includes(".") ? u.username : `${u.username}.${ref}`;
    const rewritten = new URL(`postgresql://${POOLER_HOST}:${port}/postgres`);
    rewritten.username = user;
    rewritten.password = decodeURIComponent(u.password);
    if (pgbouncer) {
      rewritten.searchParams.set("pgbouncer", "true");
      rewritten.searchParams.set("connection_limit", "1");
    }
    return rewritten.toString();
  } catch {
    return raw;
  }
}

const source = process.env.DIRECT_URL || process.env.DATABASE_URL;
const migrateUrl = rewriteToPooler(source, { port: 5432, pgbouncer: false });
if (migrateUrl) {
  process.env.DIRECT_URL = migrateUrl;
}

if (process.env.DATABASE_URL) {
  const pooled = rewriteToPooler(process.env.DATABASE_URL, { port: 6543, pgbouncer: true });
  if (pooled) process.env.DATABASE_URL = pooled;
} else if (process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
}

try {
  const used = new URL(process.env.DIRECT_URL ?? "");
  console.log(`[migrate] ${used.hostname}:${used.port}`);
} catch {
  console.log("[migrate] DIRECT_URL manquant");
}

const child = spawn(
  process.execPath,
  ["./node_modules/prisma/build/index.js", "migrate", "deploy"],
  { stdio: "inherit", env: process.env, windowsHide: true },
);

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
