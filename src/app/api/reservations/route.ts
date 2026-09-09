import { NextRequest, NextResponse } from "next/server";
import { ReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { reservationInputSchema, reservationStatusValues } from "@/lib/validation";
import { toPrismaSpaceChoice, fromPrismaSpaceChoice, spaceLabels } from "@/lib/reservation-mapping";
import { sendEmail, escapeHtml } from "@/lib/email";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const parsed = reservationInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const reservation = await prisma.reservation.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      date: data.date,
      time: data.time,
      guests: data.guests,
      space: toPrismaSpaceChoice(data.space),
      message: data.message,
    },
  });

  const notifyTo = process.env.RESERVATION_NOTIFICATION_EMAIL;
  if (notifyTo) {
    await sendEmail({
      to: [{ email: notifyTo }],
      subject: `Nouvelle réservation — ${escapeHtml(data.name)} (${data.date} ${data.time})`,
      html: `
        <h2>Nouvelle demande de réservation</h2>
        <ul>
          <li><strong>Nom :</strong> ${escapeHtml(data.name)}</li>
          <li><strong>Téléphone (WhatsApp) :</strong> ${escapeHtml(data.phone)}</li>
          <li><strong>Email :</strong> ${data.email ? escapeHtml(data.email) : "—"}</li>
          <li><strong>Date :</strong> ${escapeHtml(data.date)} à ${escapeHtml(data.time)}</li>
          <li><strong>Convives :</strong> ${data.guests}</li>
          <li><strong>Espace :</strong> ${escapeHtml(spaceLabels[data.space] ?? data.space)}</li>
          ${data.message ? `<li><strong>Message :</strong> ${escapeHtml(data.message)}</li>` : ""}
        </ul>
        <p>Gérez cette réservation dans la page admin.</p>
      `,
    }).catch((err) => console.error("[reservations] notification email échouée", err));
  }

  await sendTelegramMessage(
    `🍽️ Nouvelle réservation — ${data.name}\n` +
      `📞 ${data.phone}${data.email ? ` · ${data.email}` : ""}\n` +
      `📅 ${data.date} à ${data.time} · ${data.guests} pers. · ${spaceLabels[data.space] ?? data.space}` +
      (data.message ? `\n💬 ${data.message}` : "")
  ).catch((err) => console.error("[reservations] notification telegram échouée", err));

  return NextResponse.json({ id: reservation.id }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const statusParam = request.nextUrl.searchParams.get("status");
  const status = reservationStatusValues.includes(statusParam as ReservationStatus)
    ? (statusParam as ReservationStatus)
    : undefined;

  const reservations = await prisma.reservation.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    reservations: reservations.map((r) => ({ ...r, space: fromPrismaSpaceChoice(r.space) })),
  });
}
