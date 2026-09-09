import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { updateReservationSchema } from "@/lib/validation";
import { fromPrismaSpaceChoice, statusLabels } from "@/lib/reservation-mapping";
import { sendEmail, escapeHtml } from "@/lib/email";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const parsed = updateReservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.reservation.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
  }

  const { status, statusNote, date, time } = parsed.data;

  const updated = await prisma.reservation.update({
    where: { id },
    data: {
      status,
      statusNote,
      ...(date ? { date } : {}),
      ...(time ? { time } : {}),
    },
  });

  const statusLabel = statusLabels[status] ?? status;
  let whatsappLink: string | null = null;

  if (existing.phone) {
    const message = `Bonjour ${existing.name}, votre réservation à La Cachette du ${updated.date} à ${updated.time} est maintenant : ${statusLabel}.${statusNote ? ` (${statusNote})` : ""}`;
    whatsappLink = buildWhatsAppLink(existing.phone, message);
  }

  if (existing.email) {
    await sendEmail({
      to: [{ email: existing.email, name: existing.name }],
      subject: `Votre réservation La Cachette — ${statusLabel}`,
      html: `
        <p>Bonjour ${escapeHtml(existing.name)},</p>
        <p>Le statut de votre réservation du ${escapeHtml(updated.date)} à ${escapeHtml(updated.time)} est désormais : <strong>${escapeHtml(statusLabel)}</strong>.</p>
        ${statusNote ? `<p>${escapeHtml(statusNote)}</p>` : ""}
        <p>À très bientôt,<br/>L'équipe La Cachette</p>
      `,
    }).catch((err) => console.error("[reservations] email statut échoué", err));
  }

  return NextResponse.json({
    reservation: { ...updated, space: fromPrismaSpaceChoice(updated.space) },
    whatsappLink,
  });
}
