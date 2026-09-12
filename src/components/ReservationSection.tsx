'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import { User, Mail, Calendar, Clock, Users, MapPin, MessageSquare, Send, Loader2, Check, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { ReservationForm } from '@/types/restaurant';

interface SlotAvailability {
  time: string;
  status: 'available' | 'limited' | 'full';
  remainingCapacity: number;
  totalCapacity: number;
}

const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

const SPACE_LABELS: Record<string, string> = {
  terrasse: 'Terrasse',
  salle: 'Salle Principale',
  vip: 'VIP Lounge',
  'privatisation-vip': 'Privatisation VIP',
};

// Capacités max par espace (doivent correspondre à availability.ts ZONE_CONFIG)
const SPACE_MAX_GUESTS: Record<string, number> = {
  terrasse: 15,
  salle: 20,
  vip: 4,
  'privatisation-vip': 2,
};

const inputClassName = "w-full bg-[#171310] border border-[#4A2C20] rounded-lg px-4 py-3 pl-11 text-[#E8D8B8] focus:border-[#C59A4A] focus:ring-1 focus:ring-[#C59A4A] transition-all duration-300 placeholder:text-[#E8D8B8]/30 outline-none";
const iconClassName = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C59A4A]";

function generateNext14Days(): Date[] {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatDateValue(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function ReservationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formState, setFormState] = useState<ReservationForm>({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: 2,
    space: 'salle',
    message: ''
  });

  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Clé de rafraîchissement : s'incrémente après chaque réservation pour forcer le re-fetch des créneaux
  const [slotRefreshKey, setSlotRefreshKey] = useState(0);

  const dates = useRef(generateNext14Days()).current;

  // Fetch availability when date, space or slotRefreshKey changes
  useEffect(() => {
    if (!formState.date || !formState.space) {
      setSlots([]);
      setSlotsError(null);
      return;
    }

    let cancelled = false;
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setSlotsError(null);
      try {
        const res = await fetch(`/api/availability?date=${formState.date}&space=${formState.space}`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok) {
          setSlots(data.slots || []);
        } else {
          setSlots([]);
          setSlotsError(
            "Impossible de charger les créneaux. Réessayez dans un instant.",
          );
        }
      } catch {
        if (!cancelled) {
          setSlots([]);
          setSlotsError("Impossible de charger les créneaux. Vérifiez votre connexion.");
        }
      } finally {
        if (!cancelled) setIsLoadingSlots(false);
      }
    };

    fetchSlots();
    return () => { cancelled = true; };
  }, [formState.date, formState.space, slotRefreshKey]);

  const handleDateSelect = (dateValue: string) => {
    setFormState(prev => ({ ...prev, date: dateValue, time: '' }));
  };

  const handleSpaceChange = (space: ReservationForm['space']) => {
    setFormState(prev => ({ ...prev, space, time: '' }));
  };

  const handleTimeSelect = (time: string) => {
    setFormState(prev => ({ ...prev, time }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Une erreur est survenue, veuillez réessayer.");
        return;
      }

      setIsSuccess(true);
      // Force le re-fetch des créneaux pour refléter la nouvelle réservation
      setSlotRefreshKey(prev => prev + 1);
    } catch {
      setError("Impossible d'envoyer la demande. Vérifiez votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormComplete = formState.name && formState.phone && formState.guests && formState.space && formState.date && formState.time;


  return (
    <section id="reservation" className="py-24 bg-[#171310] text-[#E8D8B8] font-[family-name:var(--font-jakarta)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-[#4A2C20]/20 rounded-3xl overflow-hidden border border-[#4A2C20]/50"
        >
          {/* Left: Form */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <span className="text-[#C59A4A] text-sm font-bold tracking-widest uppercase mb-4 block">
              VOTRE TABLE VOUS ATTEND
            </span>
            <h2 className="text-4xl md:text-5xl text-[#E8D8B8] font-[family-name:var(--font-playfair)] mb-8">
              Réservation
            </h2>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#596044]/20 border border-[#596044] rounded-xl p-8 text-center text-[#E8D8B8]"
              >
                <div className="w-16 h-16 bg-[#596044]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-[#596044]" />
                </div>
                <h3 className="text-2xl font-[family-name:var(--font-playfair)] text-[#E8D8B8] mb-2">Demande envoyée</h3>
                <p className="text-[#E8D8B8]/80 mb-6">
                  Votre demande de réservation a été envoyée avec succès. Notre équipe vous contactera très prochainement pour confirmation.
                </p>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setFormState({ name: '', phone: '', email: '', date: '', time: '', guests: 2, space: 'salle', message: '' });
                  }}
                  className="px-6 py-2 bg-[#4A2C20] text-[#E8D8B8] rounded-lg hover:bg-[#C59A4A] hover:text-[#171310] transition-colors duration-300 text-sm font-medium"
                >
                  Nouvelle réservation
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Nom complet — pleine largeur */}
                <div className="relative">
                  <User className={iconClassName} />
                  <input
                    type="text"
                    required
                    placeholder="Nom complet"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className={inputClassName}
                  />
                </div>

                {/* Row 2: WhatsApp — pleine largeur avec logo + message info */}
                <div className="flex flex-col gap-1.5">
                  <div className="relative">
                    <Image
                      src="/images/whatsapp-official.webp"
                      alt="WhatsApp"
                      width={20}
                      height={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="+237 6XX XXX XXX"
                      maxLength={15}
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className={inputClassName}
                    />
                  </div>
                  <span className="block w-full text-xs text-[#E8D8B8]/40 pl-1">
                    Ce numéro doit être actif sur WhatsApp — nous vous contacterons via ce canal.
                  </span>
                </div>

                {/* Row 3: Email — pleine largeur */}
                <div className="relative">
                  <Mail className={iconClassName} />
                  <input
                    type="email"
                    placeholder="Email (optionnel — pour recevoir les notifications)"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className={inputClassName}
                  />
                </div>

                {/* Row 3: Convives + Espace */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Users className={iconClassName} />
                    <input
                      type="number"
                      min="1"
                      max={SPACE_MAX_GUESTS[formState.space] ?? 20}
                      required
                      placeholder="Nombre de convives"
                      value={formState.guests}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        const max = SPACE_MAX_GUESTS[formState.space] ?? 20;
                        setFormState({ ...formState, guests: Math.min(val, max) });
                      }}
                      className={inputClassName}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#E8D8B8]/30 pointer-events-none">
                      max {SPACE_MAX_GUESTS[formState.space] ?? 20}
                    </span>
                  </div>
                  <div className="relative">
                    <MapPin className={iconClassName} />
                    <select
                      required
                      value={formState.space}
                      onChange={(e) => {
                        const newSpace = e.target.value as ReservationForm['space'];
                        const newMax = SPACE_MAX_GUESTS[newSpace] ?? 20;
                        setFormState(prev => ({
                          ...prev,
                          space: newSpace,
                          time: '',
                          guests: Math.min(prev.guests, newMax),
                        }));
                      }}
                      className={`${inputClassName} appearance-none cursor-pointer`}
                    >
                      <option value="terrasse">Terrasse (max 15 pers.)</option>
                      <option value="salle">Salle Principale (max 20 pers.)</option>
                      <option value="vip">VIP Lounge (max 4 pers.)</option>
                      <option value="privatisation-vip">Privatisation VIP (max 2 pers.)</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Date Pills */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm text-[#E8D8B8]/70 font-medium">
                    <Calendar className="w-4 h-4 text-[#C59A4A]" />
                    Choisissez votre date
                  </label>
                  <div
                    className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none' }}
                  >
                    {dates.map((d, i) => {
                      const dateValue = formatDateValue(d);
                      const isSelected = formState.date === dateValue;

                      return (
                        <button
                          key={dateValue}
                          type="button"
                          onClick={() => handleDateSelect(dateValue)}
                          className={`flex flex-col items-center min-w-[64px] px-3 py-2.5 rounded-xl border transition-all duration-300 flex-shrink-0 ${
                            isSelected
                              ? 'bg-[#C59A4A] border-[#C59A4A] text-[#171310] shadow-lg shadow-[#C59A4A]/20'
                              : 'bg-[#171310] border-[#4A2C20] text-[#E8D8B8] hover:border-[#C59A4A]/50'
                          }`}
                        >
                          <span className={`text-[10px] uppercase font-bold tracking-wider mb-0.5 ${isSelected ? 'text-[#171310]/70' : 'text-[#E8D8B8]/50'}`}>
                            {i === 0 ? 'Auj.' : DAYS_FR[d.getDay()]}
                          </span>
                          <span className="text-xl font-[family-name:var(--font-playfair)] font-bold leading-none">
                            {d.getDate()}
                          </span>
                          <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#171310]/70' : 'text-[#E8D8B8]/50'}`}>
                            {MONTHS_FR[d.getMonth()]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 5: Time Slots */}
                {formState.date && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <label className="flex items-center gap-2 text-sm text-[#E8D8B8]/70 font-medium">
                      <Clock className="w-4 h-4 text-[#C59A4A]" />
                      Créneaux disponibles
                    </label>

                    {isLoadingSlots ? (
                      <div className="flex items-center gap-3 text-[#E8D8B8]/60 py-6 justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-[#C59A4A]" />
                        <span className="text-sm">Recherche des disponibilités...</span>
                      </div>
                    ) : slotsError ? (
                      <p className="text-sm text-red-400 py-4 text-center">{slotsError}</p>
                    ) : slots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {slots.map((slot) => {
                          const canAcceptGuests = formState.guests <= slot.remainingCapacity;
                          const isFull = slot.status === 'full' || !canAcceptGuests;
                          const isLimited = !isFull && slot.status === 'limited';
                          const isSelected = formState.time === slot.time;

                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={isFull}
                              onClick={() => handleTimeSelect(slot.time)}
                              title={isLimited ? `${slot.remainingCapacity} places restantes` : isFull ? 'Complet' : `${slot.remainingCapacity} places`}
                              className={`flex flex-col items-center py-2 px-1 rounded-lg border text-center transition-all duration-200 ${
                                isSelected
                                  ? 'bg-[#C59A4A] border-[#C59A4A] text-[#171310] shadow-md shadow-[#C59A4A]/20'
                                  : isFull
                                    ? 'bg-[#171310]/30 border-[#4A2C20]/30 text-[#E8D8B8]/30 cursor-not-allowed opacity-50'
                                    : isLimited
                                      ? 'bg-[#171310] border-[#B86B32]/60 text-[#E8D8B8] hover:border-[#B86B32] hover:bg-[#B86B32]/10 cursor-pointer'
                                      : 'bg-[#171310] border-[#596044]/60 text-[#E8D8B8] hover:border-[#596044] hover:bg-[#596044]/10 cursor-pointer'
                              }`}
                            >
                              <span className="text-sm font-semibold">{slot.time}</span>
                              {isLimited && !isSelected && (
                                <span className="text-[10px] text-[#B86B32] mt-0.5">{slot.remainingCapacity} pl.</span>
                              )}
                              {isFull && (
                                <span className="text-[10px] mt-0.5">Complet</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-[#E8D8B8]/50 py-4 text-center">
                        Aucun créneau disponible pour cette date et cet espace.
                      </p>
                    )}

                    {/* Legend */}
                    {slots.length > 0 && (
                      <div className="flex flex-wrap gap-4 text-[10px] text-[#E8D8B8]/50 pt-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded border border-[#596044]/60 bg-[#171310]" /> Disponible
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded border border-[#B86B32]/60 bg-[#171310]" /> Limité
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded border border-[#4A2C20]/30 bg-[#171310]/30 opacity-50" /> Complet
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Row 6: Message */}
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#C59A4A]" />
                  <textarea
                    rows={3}
                    placeholder="Message ou demande spéciale (optionnel)"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className={`${inputClassName} pl-11 resize-none`}
                  />
                </div>

                {/* Recap Card */}
                {isFormComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#171310] border-l-4 border-l-[#C59A4A] rounded-r-xl p-5 border-y border-r border-[#4A2C20]/50"
                  >
                    <h4 className="text-sm font-semibold text-[#C59A4A] mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Récapitulatif
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-[#E8D8B8]/40 text-xs">Date</span>
                        <p className="text-[#E8D8B8]">{formState.date}</p>
                      </div>
                      <div>
                        <span className="text-[#E8D8B8]/40 text-xs">Heure</span>
                        <p className="text-[#E8D8B8]">{formState.time}</p>
                      </div>
                      <div>
                        <span className="text-[#E8D8B8]/40 text-xs">Convives</span>
                        <p className="text-[#E8D8B8]">{formState.guests} personne{formState.guests > 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <span className="text-[#E8D8B8]/40 text-xs">Espace</span>
                        <p className="text-[#E8D8B8]">{SPACE_LABELS[formState.space] ?? formState.space}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error */}
                {error && (
                  <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-4 py-2">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C59A4A] text-[#171310] font-bold text-lg hover:bg-[#B86B32] rounded-lg py-4 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Réserver une table
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right: Ambient Image */}
          <div className="relative h-full min-h-[400px] lg:min-h-full">
            <Image
              src="/images/vip.webp"
              alt="VIP Lounge La Cachette"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171310] via-transparent to-transparent opacity-80" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
