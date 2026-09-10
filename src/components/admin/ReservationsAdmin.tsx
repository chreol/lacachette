"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { statusLabels, spaceLabels } from "@/lib/reservation-mapping";
import { reservationStatusValues } from "@/lib/validation";

interface Reservation {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  date: string;
  time: string;
  guests: number;
  space: string;
  message?: string | null;
  status: (typeof reservationStatusValues)[number];
  statusNote?: string | null;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  CONFIRMED: "bg-green-500/20 text-green-300 border-green-500/40",
  CANCELLED: "bg-red-500/20 text-red-300 border-red-500/40",
  RESCHEDULED: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  OTHER: "bg-gray-500/20 text-gray-300 border-gray-500/40",
};

const spaceColors: Record<string, string> = {
  terrasse: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  salle: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  vip: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  "privatisation-vip": "bg-pink-500/20 text-pink-300 border-pink-500/40",
};

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [whatsappLinks, setWhatsappLinks] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/reservations${filter ? `?status=${filter}` : ""}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReservations(data.reservations);
      setError(null);
    } catch {
      setError("Impossible de charger les réservations.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await fetch(`/api/reservations${filter ? `?status=${filter}` : ""}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!ignore) {
          setReservations(data.reservations);
          setError(null);
        }
      } catch {
        if (!ignore) setError("Impossible de charger les réservations.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    const statusNote = notes[id]?.trim() || undefined;
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, statusNote }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.whatsappLink) {
        setWhatsappLinks((prev) => ({ ...prev, [id]: data.whatsappLink }));
      }
      await load();
    } catch {
      setError("Échec de la mise à jour du statut.");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <select
          value={filter}
          onChange={(e) => {
            setLoading(true);
            setFilter(e.target.value);
          }}
          className="bg-[#171310] border border-[#4A2C20] rounded-lg px-3 py-2 text-sm text-[#E8D8B8] outline-none"
        >
          <option value="">Tous les statuts</option>
          {reservationStatusValues.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setLoading(true);
            load();
          }}
          className="flex items-center gap-2 text-sm text-[#C59A4A] hover:text-[#B86B32]"
        >
          <RefreshCw className="w-4 h-4" /> Actualiser
        </button>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}
      {loading ? (
        <p className="text-[#E8D8B8]/60">Chargement...</p>
      ) : reservations.length === 0 ? (
        <p className="text-[#E8D8B8]/60">Aucune réservation.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => (
            <div
              key={r.id}
              className="bg-[#4A2C20]/10 border border-[#4A2C20]/40 rounded-xl p-5 flex flex-col md:flex-row md:items-start gap-4"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[#E8D8B8]">{r.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[r.status]}`}
                  >
                    {statusLabels[r.status]}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${spaceColors[r.space] ?? "bg-gray-500/20 text-gray-300 border-gray-500/40"}`}
                  >
                    {spaceLabels[r.space] ?? r.space}
                  </span>
                </div>
                <p className="text-sm text-[#E8D8B8]/70">
                  {r.date} à {r.time} · {r.guests} pers. · {spaceLabels[r.space] ?? r.space}
                </p>
                <p className="text-sm text-[#E8D8B8]/70">
                  {r.phone}
                  {r.email ? ` · ${r.email}` : ""}
                </p>
                {r.message && <p className="text-sm text-[#E8D8B8]/50 italic">« {r.message} »</p>}
                {whatsappLinks[r.id] && (
                  <a
                    href={whatsappLinks[r.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#25D366] hover:underline mt-1"
                  >
                    <Image
                      src="/images/whatsapp-official.webp"
                      alt="WhatsApp"
                      width={16}
                      height={16}
                    /> Contacter sur WhatsApp
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full md:w-64">
                <input
                  type="text"
                  placeholder="Note (optionnel)"
                  value={notes[r.id] ?? ""}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                  className="bg-[#171310] border border-[#4A2C20] rounded-lg px-3 py-1.5 text-sm text-[#E8D8B8] outline-none"
                />
                <div className="flex flex-wrap gap-2">
                  {reservationStatusValues.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(r.id, s)}
                      disabled={s === r.status}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${statusColors[s]} hover:brightness-125`}
                    >
                      {statusLabels[s]}
                    </button>
                  ))}
                  {whatsappLinks[r.id] && (
                    <a
                      href={whatsappLinks[r.id]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors font-medium"
                    >
                      <Image
                        src="/images/whatsapp-official.webp"
                        alt="WhatsApp"
                        width={14}
                        height={14}
                      />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
