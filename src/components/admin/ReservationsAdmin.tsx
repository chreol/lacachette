"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { RefreshCw, Search, Calendar, Clock, Users, MessageSquare, Phone, Mail, ChevronDown, Trash2, Copy } from "lucide-react";
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

const statusConfig: Record<string, { color: string; bg: string; border: string; dot: string; emoji: string }> = {
  PENDING:      { color: "text-amber-300",   bg: "bg-amber-500/10",   border: "border-amber-500/30",  dot: "bg-amber-400",   emoji: "⏳" },
  CONFIRMED:    { color: "text-green-300",   bg: "bg-green-500/10",   border: "border-green-500/30",  dot: "bg-green-400",   emoji: "✅" },
  CANCELLED:    { color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30",    dot: "bg-red-400",     emoji: "❌" },
  RESCHEDULED:  { color: "text-blue-300",    bg: "bg-blue-500/10",    border: "border-blue-500/30",   dot: "bg-blue-400",    emoji: "📅" },
  OTHER:        { color: "text-purple-300",  bg: "bg-purple-500/10",  border: "border-purple-500/30", dot: "bg-purple-400",  emoji: "💳" },
};

const spaceConfig: Record<string, { color: string; bg: string; border: string }> = {
  terrasse:           { color: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  salle:              { color: "text-amber-300",   bg: "bg-amber-500/10",   border: "border-amber-500/30"   },
  vip:                { color: "text-purple-300",  bg: "bg-purple-500/10",  border: "border-purple-500/30"  },
  "privatisation-vip":{ color: "text-pink-300",    bg: "bg-pink-500/10",    border: "border-pink-500/30"    },
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-[#1a1614] border border-[#4A2C20]/40 rounded-2xl p-4 flex flex-col gap-1">
      <p className="text-[#E8D8B8]/40 text-xs uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-bold text-[#E8D8B8]">{value}</p>
      {sub && <p className="text-xs text-[#C59A4A]">{sub}</p>}
    </div>
  );
}

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [whatsappLinks, setWhatsappLinks] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);

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
    setLoading(true);
    load();
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    const statusNote = notes[id]?.trim() || undefined;
    setUpdating(id + status);
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
    } finally {
      setUpdating(null);
    }
  };

  const deleteReservation = async (id: string, name: string) => {
    if (!confirm(`Supprimer définitivement la réservation de ${name} ?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      if (expanded === id) setExpanded(null);
      await load();
    } catch {
      setError("Échec de la suppression.");
    } finally {
      setDeleting(null);
    }
  };

  const duplicateReservation = async (r: Reservation) => {
    setDuplicating(r.id);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: r.name + " (copie)",
          phone: r.phone,
          email: r.email ?? "",
          date: r.date,
          time: r.time,
          guests: r.guests,
          space: r.space,
          message: r.message ?? "",
        }),
      });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      setError("Échec de la duplication.");
    } finally {
      setDuplicating(null);
    }
  };

  const filtered = reservations.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.phone.includes(q) || (r.email ?? "").toLowerCase().includes(q);
  });

  const pending   = reservations.filter((r) => r.status === "PENDING").length;
  const confirmed = reservations.filter((r) => r.status === "CONFIRMED").length;
  const today = new Date().toISOString().split("T")[0];
  const todayCount = reservations.filter((r) => r.date === today).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total" value={reservations.length} />
        <StatCard label="En attente" value={pending} sub={pending > 0 ? "À traiter" : "Aucune"} />
        <StatCard label="Confirmées" value={confirmed} />
        <StatCard label="Aujourd'hui" value={todayCount} sub={today} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E8D8B8]/30" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1614] border border-[#4A2C20]/50 rounded-xl pl-11 pr-4 py-2.5 text-sm text-[#E8D8B8] placeholder:text-[#E8D8B8]/25 outline-none focus:border-[#C59A4A]/60 transition-colors"
          />
        </div>
        {/* Filter */}
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => { setLoading(true); setFilter(e.target.value); }}
            className="appearance-none bg-[#1a1614] border border-[#4A2C20]/50 rounded-xl px-4 py-2.5 pr-8 text-sm text-[#E8D8B8] outline-none focus:border-[#C59A4A]/60 transition-colors cursor-pointer"
          >
            <option value="">Tous les statuts</option>
            {reservationStatusValues.map((s) => (
              <option key={s} value={s}>{statusConfig[s]?.emoji} {statusLabels[s]}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E8D8B8]/40 pointer-events-none" />
        </div>
        {/* Refresh */}
        <button
          onClick={() => { setLoading(true); load(); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#4A2C20]/50 bg-[#1a1614] text-sm text-[#C59A4A] hover:bg-[#4A2C20]/20 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Actualiser</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-950/30 border border-red-800/50 text-red-400 text-sm rounded-xl px-4 py-3">
          ⚠ {error}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#E8D8B8]/40">
          <div className="w-8 h-8 border-2 border-[#4A2C20] border-t-[#C59A4A] rounded-full animate-spin" />
          <p className="text-sm">Chargement des réservations…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2 text-[#E8D8B8]/30">
          <Calendar className="w-10 h-10 opacity-30" />
          <p className="text-sm">Aucune réservation trouvée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const sc = statusConfig[r.status] ?? statusConfig.OTHER;
            const sp = spaceConfig[r.space] ?? { color: "text-gray-300", bg: "bg-gray-500/10", border: "border-gray-500/30" };
            const isExpanded = expanded === r.id;

            return (
              <div
                key={r.id}
                className={`bg-[#1a1614] border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isExpanded ? "border-[#C59A4A]/30" : "border-[#4A2C20]/40 hover:border-[#4A2C20]/70"
                }`}
              >
                {/* Card header — always visible */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : r.id)}
                  className="w-full text-left px-5 py-4 flex flex-wrap md:flex-nowrap items-center gap-4"
                >
                  {/* Status dot */}
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`} />

                  {/* Name + badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-[#E8D8B8] truncate">{r.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${sc.bg} ${sc.color} ${sc.border}`}>
                        {sc.emoji} {statusLabels[r.status]}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${sp.bg} ${sp.color} ${sp.border}`}>
                        {spaceLabels[r.space] ?? r.space}
                      </span>
                    </div>
                    {/* Date / time / guests inline */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#E8D8B8]/50">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{r.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.time}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{r.guests} pers.</span>
                    </div>
                  </div>

                  {/* Expand chevron */}
                  <ChevronDown className={`w-4 h-4 text-[#E8D8B8]/30 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {/* Expanded panel */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-[#4A2C20]/30 pt-4 grid md:grid-cols-2 gap-5">
                    {/* Contact info */}
                    <div className="space-y-3">
                      <p className="text-[#C59A4A] text-xs uppercase tracking-widest font-semibold mb-2">Contact</p>
                      <div className="flex items-center gap-2 text-sm text-[#E8D8B8]/80">
                        <Phone className="w-4 h-4 text-[#C59A4A]/60 flex-shrink-0" />
                        <a href={`tel:${r.phone}`} className="hover:text-[#C59A4A] transition-colors">{r.phone}</a>
                      </div>
                      {r.email && (
                        <div className="flex items-center gap-2 text-sm text-[#E8D8B8]/80">
                          <Mail className="w-4 h-4 text-[#C59A4A]/60 flex-shrink-0" />
                          <a href={`mailto:${r.email}`} className="hover:text-[#C59A4A] transition-colors truncate">{r.email}</a>
                        </div>
                      )}
                      {r.message && (
                        <div className="flex items-start gap-2 text-sm text-[#E8D8B8]/60 italic">
                          <MessageSquare className="w-4 h-4 text-[#C59A4A]/60 flex-shrink-0 mt-0.5" />
                          <span>« {r.message} »</span>
                        </div>
                      )}
                      {whatsappLinks[r.id] && (
                        <a
                          href={whatsappLinks[r.id]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm bg-[#25D366] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#20bd5a] transition-colors mt-1"
                        >
                          <Image src="/images/whatsapp-official.webp" alt="WA" width={16} height={16} />
                          Contacter sur WhatsApp
                        </a>
                      )}
                    </div>

                    {/* Status update */}
                    <div className="space-y-3">
                      <p className="text-[#C59A4A] text-xs uppercase tracking-widest font-semibold mb-2">Mettre à jour le statut</p>
                      <input
                        type="text"
                        placeholder="Note interne (optionnel)…"
                        value={notes[r.id] ?? ""}
                        onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                        className="w-full bg-[#0F0D0A] border border-[#4A2C20]/60 rounded-xl px-3 py-2 text-sm text-[#E8D8B8] placeholder:text-[#E8D8B8]/25 outline-none focus:border-[#C59A4A]/60 transition-colors"
                      />
                      <div className="flex flex-wrap gap-2">
                        {reservationStatusValues.map((s) => {
                          const ssc = statusConfig[s];
                          const isActive = s === r.status;
                          const isLoading = updating === r.id + s;
                          return (
                            <button
                              key={s}
                              onClick={() => updateStatus(r.id, s)}
                              disabled={isActive || isLoading}
                              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
                                isActive
                                  ? `${ssc.bg} ${ssc.color} ${ssc.border} opacity-100 ring-1 ring-current`
                                  : `${ssc.bg} ${ssc.color} ${ssc.border} hover:brightness-125 disabled:opacity-30`
                              }`}
                            >
                              {isLoading && <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />}
                              {ssc.emoji} {statusLabels[s]}
                            </button>
                          );
                        })}
                      </div>

                      {/* Actions — Dupliquer / Supprimer */}
                      <div className="pt-3 border-t border-[#4A2C20]/20 flex items-center gap-2">
                        <button
                          onClick={() => duplicateReservation(r)}
                          disabled={duplicating === r.id}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:brightness-125 transition-all disabled:opacity-50"
                        >
                          {duplicating === r.id
                            ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                            : <Copy className="w-3 h-3" />}
                          Dupliquer
                        </button>
                        <button
                          onClick={() => deleteReservation(r.id, r.name)}
                          disabled={deleting === r.id}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:brightness-125 transition-all disabled:opacity-50"
                        >
                          {deleting === r.id
                            ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                            : <Trash2 className="w-3 h-3" />}
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
