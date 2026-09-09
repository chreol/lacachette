import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "lc_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 jours

export type StaffRole = "ADMIN" | "STAFF";

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: StaffRole;
}

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET manquant ou trop court (32 caractères minimum). Définissez-le dans .env.local"
    );
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.sub === "string" &&
      typeof payload.email === "string" &&
      typeof payload.name === "string" &&
      (payload.role === "ADMIN" || payload.role === "STAFF")
    ) {
      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_MAX_AGE = SESSION_DURATION_SECONDS;
