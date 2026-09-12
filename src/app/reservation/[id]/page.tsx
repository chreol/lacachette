import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { fromPrismaSpaceChoice, spaceLabels, statusLabels } from "@/lib/reservation-mapping";
import Image from "next/image";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { emoji: string; color: string; bg: string; border: string; message: string }> = {
  PENDING: {
    emoji: "⏳",
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    message: "Votre réservation est en cours de traitement. Notre équipe vous contactera très prochainement.",
  },
  CONFIRMED: {
    emoji: "✅",
    color: "text-green-300",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    message: "Votre réservation est confirmée ! Nous vous attendons avec impatience.",
  },
  CANCELLED: {
    emoji: "❌",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    message: "Cette réservation a été annulée. Contactez-nous pour en savoir plus ou faire une nouvelle réservation.",
  },
  RESCHEDULED: {
    emoji: "📅",
    color: "text-blue-300",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    message: "Votre réservation a été reportée. Notre équipe vous contactera pour confirmer les nouveaux détails.",
  },
  OTHER: {
    emoji: "💳",
    color: "text-purple-300",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    message: "Un paiement ou une action est en attente. Notre équipe vous contactera prochainement.",
  },
};

export default async function ReservationStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const reservation = await prisma.reservation
    .findUnique({ where: { id } })
    .catch(() => null);

  if (!reservation) notFound();

  const space = fromPrismaSpaceChoice(reservation.space);
  const sc = STATUS_CONFIG[reservation.status] ?? STATUS_CONFIG.PENDING;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lacachette-nu.vercel.app";
  const pageUrl = `${siteUrl}/reservation/${id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&format=png&color=C59A4A&bgcolor=171310&data=${encodeURIComponent(pageUrl)}`;

  return (
    <div className="min-h-screen bg-[#0F0D0A] text-[#E8D8B8] font-[family-name:var(--font-jakarta)] flex flex-col items-center justify-center px-4 py-12">
      {/* Background radial */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#4A2C20_0%,_transparent_60%)] opacity-15 pointer-events-none" />

      <div className="relative w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/">
            <Image
              src="/images/logo.webp"
              alt="La Cachette"
              width={64}
              height={64}
              className="rounded-full border border-[#C59A4A]/30 mx-auto mb-4"
            />
          </Link>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#C59A4A] tracking-widest">
            LA CACHETTE
          </h1>
          <p className="text-[#E8D8B8]/40 text-xs uppercase tracking-[0.3em] mt-1">
            Suivi de réservation
          </p>
        </div>

        {/* Status card */}
        <div className="bg-[#1a1614] border border-[#4A2C20]/40 rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
          {/* Status banner */}
          <div className={`${sc.bg} ${sc.border} border-b px-6 py-4 flex items-center gap-3`}>
            <span className="text-2xl">{sc.emoji}</span>
            <div>
              <p className="text-xs text-[#E8D8B8]/40 uppercase tracking-wider">Statut</p>
              <p className={`font-bold text-lg ${sc.color}`}>
                {statusLabels[reservation.status as keyof typeof statusLabels] ?? reservation.status}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="px-6 py-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#E8D8B8]/40 uppercase tracking-wider mb-1">Client</p>
                <p className="font-semibold text-[#E8D8B8] text-lg">{reservation.name}</p>
              </div>
              <span className="text-3xl opacity-20 font-[family-name:var(--font-playfair)]">&ldquo;</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#4A2C20]/30">
              <div>
                <p className="text-xs text-[#E8D8B8]/40 uppercase tracking-wider mb-1">Date</p>
                <p className="text-[#E8D8B8] font-medium">{reservation.date}</p>
              </div>
              <div>
                <p className="text-xs text-[#E8D8B8]/40 uppercase tracking-wider mb-1">Heure</p>
                <p className="text-[#E8D8B8] font-medium">{reservation.time}</p>
              </div>
              <div>
                <p className="text-xs text-[#E8D8B8]/40 uppercase tracking-wider mb-1">Convives</p>
                <p className="text-[#E8D8B8] font-medium">{reservation.guests} personne{reservation.guests > 1 ? "s" : ""}</p>
              </div>
              <div>
                <p className="text-xs text-[#E8D8B8]/40 uppercase tracking-wider mb-1">Espace</p>
                <p className="text-[#E8D8B8] font-medium">{spaceLabels[space] ?? space}</p>
              </div>
            </div>

            {reservation.message && (
              <div className="pt-2 border-t border-[#4A2C20]/30">
                <p className="text-xs text-[#E8D8B8]/40 uppercase tracking-wider mb-1">Message</p>
                <p className="text-[#E8D8B8]/70 italic text-sm">« {reservation.message} »</p>
              </div>
            )}

            {reservation.statusNote && (
              <div className="pt-2 border-t border-[#4A2C20]/30">
                <p className="text-xs text-[#E8D8B8]/40 uppercase tracking-wider mb-1">Note du restaurant</p>
                <p className="text-[#E8D8B8]/70 text-sm">{reservation.statusNote}</p>
              </div>
            )}

            {/* Status message */}
            <div className={`${sc.bg} ${sc.border} border rounded-xl px-4 py-3 text-sm ${sc.color}`}>
              {sc.message}
            </div>
          </div>

          {/* QR + actions */}
          <div className="px-6 pb-6 flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-[#4A2C20]/30">
            <div className="flex flex-col items-center gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="QR Code réservation" width={80} height={80} className="rounded-lg opacity-70" />
              <p className="text-[10px] text-[#E8D8B8]/30">Partager</p>
            </div>
            <div className="flex-1 space-y-2 w-full">
              <Link
                href="/#reservation"
                className="block text-center text-sm bg-gradient-to-r from-[#C59A4A] to-[#B86B32] text-[#171310] font-bold rounded-xl py-2.5 hover:opacity-90 transition-opacity"
              >
                Nouvelle réservation
              </Link>
              <a
                href={`https://wa.me/237693547268?text=${encodeURIComponent(`Bonjour La Cachette, je souhaite des informations sur ma réservation du ${reservation.date} à ${reservation.time}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] rounded-xl py-2.5 hover:bg-[#25D366]/20 transition-colors"
              >
                <Image src="/images/whatsapp-official.webp" alt="WA" width={16} height={16} />
                Contacter via WhatsApp
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-[#E8D8B8]/20 text-xs">
          Réservation #{id.slice(-8).toUpperCase()} · La Cachette Resto
        </p>
      </div>
    </div>
  );
}
