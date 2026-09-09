import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, verifyPassword } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";
import { loginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email ou mot de passe invalide" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await prisma.staffUser.findUnique({ where: { email } });
  // Message générique volontaire (ne pas indiquer si l'email existe ou non).
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  await setSessionCookie(token);

  return NextResponse.json({ name: user.name, role: user.role });
}
