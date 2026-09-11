import { NextRequest, NextResponse } from "next/server";
import { ReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { reservationInputSchema, reservationStatusValues } from "@/lib/validation";
import { toPrismaSpaceChoice, fromPrismaSpaceChoice, spaceLabels, statusLabels } from "@/lib/reservation-mapping";
import { sendEmail } from "@/lib/email";
import { sendTelegramMessage } from "@/lib/telegram";
import { isSlotAvailable } from "@/lib/availability";
import { buildNewReservationStaffEmail, buildReservationConfirmationClientEmail } from "@/lib/email-templates";
import { buildWhatsAppLink } from "@/lib/whatsapp";

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

  // 1. Check availability
  const available = await isSlotAvailable(data.date, data.time, data.space, data.guests);
  if (!available) {
    return NextResponse.json(
      { error: "Ce créneau n'est plus disponible pour le nombre de convives demandé." },
      { status: 409 }
    );
  }

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

  const whatsappMsg = `Bonjour ${data.name}, votre réservation à La Cachette du ${data.date} à ${data.time} a bien été enregistrée. Notre équipe vous contactera très prochainement. À bientôt !`;
  const whatsappLink = buildWhatsAppLink(data.phone, whatsappMsg);

  const notifyTo = process.env.RESERVATION_NOTIFICATION_EMAIL;
  if (notifyTo) {
    const staffEmailHtml = buildNewReservationStaffEmail({
      name: data.name,
      phone: data.phone,
      email: data.email,
      date: data.date,
      time: data.time,
      guests: data.guests,
      space: spaceLabels[data.space] ?? data.space,
      message: data.message,
      whatsappLink,
      adminUrl: process.env.ADMIN_URL ?? 'https://lacachette-nu.vercel.app/admin',
    });

    await sendEmail({
      to: [{ email: notifyTo }],
      subject: `Nouvelle réservation — ${data.name} (${data.date} ${data.time})`,
      html: staffEmailHtml,
    }).catch((err) => console.error("[reservations] notification email échouée", err));
  }

  if (data.email) {
    const clientEmailHtml = buildReservationConfirmationClientEmail({
      name: data.name,
      date: data.date,
      time: data.time,
      guests: data.guests,
      space: spaceLabels[data.space] ?? data.space,
      message: data.message,
      status: statusLabels['PENDING'],
    });

    await sendEmail({
      to: [{ email: data.email, name: data.name }],
      subject: `Confirmation de votre demande de réservation — La Cachette`,
      html: clientEmailHtml,
    }).catch((err) => console.error("[reservations] email client échoué", err));
  }

  const telegramMsg = [
    `🍽️ <b>Nouvelle Réservation — La Cachette</b>`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 <b>Client :</b> ${data.name}`,
    `📞 <b>Tél :</b> ${data.phone}`,
    `📲 <b>WhatsApp :</b> <a href="https://wa.me/${data.phone.replace(/[^\d]/g, '')}">+${data.phone.replace(/[^\d]/g, '')}</a>`,
    data.email ? `📧 <b>Email :</b> ${data.email}` : null,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📅 <b>Date :</b> ${data.date}`,
    `⏰ <b>Heure :</b> ${data.time}`,
    `👥 <b>Convives :</b> ${data.guests}`,
    `📍 <b>Espace :</b> ${spaceLabels[data.space] ?? data.space}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    data.message ? `💬 <b>Message :</b> <i>${data.message}</i>` : null,
    data.message ? `━━━━━━━━━━━━━━━━━━━━` : null,
    `📲 <a href="${whatsappLink}">Contacter sur WhatsApp</a>`,
    `🔧 <a href="${process.env.ADMIN_URL ?? 'https://lacachette-nu.vercel.app/admin'}">Gérer dans l'Admin</a>`,
    `🌐 <a href="https://resto.chreolempire.com">resto.chreolempire.com</a>`,
  ].filter(Boolean).join('\n');

  await sendTelegramMessage(telegramMsg, 'HTML')
    .catch((err) => console.error("[reservations] notification telegram échouée", err));


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
