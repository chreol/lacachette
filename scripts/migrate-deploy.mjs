import { spawn } from "node:child_process";

const POOLER_HOST = process.env.SUPABASE_POOLER_HOST ?? "aws-1-eu-west-1.pooler.supabase.com";

function resolveDirectUrl() {
  if (process.env.DIRECT_URL) return process.env.DIRECT_URL;
  const pooled = process.env.DATABASE_URL;
  if (!pooled) return undefined;
  try {
    const u = new URL(pooled);
    const isSupabaseDbHost =
      u.hostname.startsWith("db.") && u.hostname.endsWith(".supabase.co");
    if (isSupabaseDbHost) {
      const ref = u.hostname.slice("db.".length, -".supabase.co".length);
      const user = u.username.includes(".") ? u.username : `${u.username}.${ref}`;
      const rewritten = new URL(`postgresql://${POOLER_HOST}:5432/postgres`);
      rewritten.username = user;
      rewritten.password = decodeURIComponent(u.password);
      return rewritten.toString();
    }
  } catch {
    return pooled;
  }
  return pooled;
}

const direct = resolveDirectUrl();
if (direct && !process.env.DIRECT_URL) {
  process.env.DIRECT_URL = direct;
}

if (!process.env.DATABASE_URL && process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
}

const child = spawn(
  process.execPath,
  ["./node_modules/prisma/build/index.js", "migrate", "deploy"],
  { stdio: "inherit", env: process.env, windowsHide: true },
);

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
