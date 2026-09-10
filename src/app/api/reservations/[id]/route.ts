import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { updateReservationSchema } from "@/lib/validation";
import { fromPrismaSpaceChoice, statusLabels, spaceLabels } from "@/lib/reservation-mapping";
import { sendEmail } from "@/lib/email";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { buildStatusUpdateClientEmail } from "@/lib/email-templates";
import { sendTelegramMessage } from "@/lib/telegram";

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
    const emailHtml = buildStatusUpdateClientEmail({
      name: existing.name,
      date: updated.date,
      time: updated.time,
      guests: existing.guests,
      space: spaceLabels[fromPrismaSpaceChoice(existing.space)] ?? fromPrismaSpaceChoice(existing.space),
      status: statusLabel,
      statusKey: status,
      statusNote,
    });

    await sendEmail({
      to: [{ email: existing.email, name: existing.name }],
      subject: `Votre réservation La Cachette — ${statusLabel}`,
      html: emailHtml,
    }).catch((err) => console.error("[reservations] email statut échoué", err));
  }

  const previousStatusLabel = statusLabels[existing.status] ?? existing.status;
  await sendTelegramMessage(
    `🔔 Statut mis à jour — ${existing.name}\n` +
      `📋 ${previousStatusLabel} → ${statusLabel}\n` +
      `📅 ${updated.date} à ${updated.time} · ${existing.guests} pers.\n` +
      (statusNote ? `📝 ${statusNote}\n` : "") +
      `📲 WhatsApp: ${whatsappLink}`
  ).catch((err) => console.error("[reservations] notification telegram échouée", err));

  return NextResponse.json({
    reservation: { ...updated, space: fromPrismaSpaceChoice(updated.space) },
    whatsappLink,
  });
}
