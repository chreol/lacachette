import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fromPrismaSpaceChoice, spaceLabels } from "@/lib/reservation-mapping";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET(request: NextRequest) {
  // Protect with CRON_SECRET
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Calculate tomorrow's date in YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  // Fetch all CONFIRMED reservations for tomorrow
  const reservations = await prisma.reservation.findMany({
    where: { date: tomorrowStr, status: "CONFIRMED" },
    orderBy: { time: "asc" },
  });

  if (reservations.length === 0) {
    return NextResponse.json({ sent: 0, message: "Aucune réservation confirmée demain." });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lacachette-nu.vercel.app";

  let sent = 0;
  const errors: string[] = [];

  for (const r of reservations) {
    const space = fromPrismaSpaceChoice(r.space);
    const spaceLabel = spaceLabels[space] ?? space;
    const confirmUrl = `${siteUrl}/reservation/${r.id}`;
    const waLink = `https://wa.me/${r.phone.replace(/\D/g, "")}`;

    const msg =
      `🔔 <b>Rappel J-1 — Réservation de demain</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 <b>Client :</b> ${r.name}\n` +
      `📞 <b>Tél :</b> ${r.phone}\n` +
      `📅 <b>Date :</b> ${r.date}\n` +
      `⏰ <b>Heure :</b> ${r.time}\n` +
      `👥 <b>Convives :</b> ${r.guests}\n` +
      `📍 <b>Espace :</b> ${spaceLabel}\n` +
      (r.message ? `💬 <b>Message :</b> ${r.message}\n` : "") +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📲 <a href="${waLink}">Contacter sur WhatsApp</a>\n` +
      `🔗 <a href="${confirmUrl}">Voir la réservation</a>`;

    try {
      await sendTelegramMessage(msg, "HTML");
      sent++;
    } catch (e) {
      errors.push(`${r.id}: ${e}`);
    }
  }

  return NextResponse.json({
    date: tomorrowStr,
    total: reservations.length,
    sent,
    errors: errors.length ? errors : undefined,
  });
}
