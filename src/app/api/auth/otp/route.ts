import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, verifyPassword } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";
import { z } from "zod";

const otpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const parsed = otpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Code invalide" }, { status: 400 });
  }

  const { email, code } = parsed.data;

  const user = await prisma.staffUser.findUnique({ where: { email } });
  if (!user || !user.otpCode || !user.otpExpiresAt) {
    return NextResponse.json({ error: "Code expiré ou invalide" }, { status: 401 });
  }

  // Check expiry
  if (new Date() > user.otpExpiresAt) {
    await prisma.staffUser.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpiresAt: null },
    });
    return NextResponse.json({ error: "Code expiré. Veuillez recommencer la connexion." }, { status: 401 });
  }

  // Verify OTP hash
  const isValid = await verifyPassword(code, user.otpCode);
  if (!isValid) {
    return NextResponse.json({ error: "Code incorrect" }, { status: 401 });
  }

  // Clear OTP after successful use (one-time)
  await prisma.staffUser.update({
    where: { id: user.id },
    data: { otpCode: null, otpExpiresAt: null },
  });

  // Create session
  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  await setSessionCookie(token);

  return NextResponse.json({ name: user.name, role: user.role });
}
