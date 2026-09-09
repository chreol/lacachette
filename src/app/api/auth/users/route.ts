import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { hashPassword } from "@/lib/auth";
import { createStaffSchema } from "@/lib/validation";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const users = await prisma.staffUser.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const parsed = createStaffSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, password, name, role } = parsed.data;

  const existing = await prisma.staffUser.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.staffUser.create({
    data: { email, passwordHash, name, role },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
