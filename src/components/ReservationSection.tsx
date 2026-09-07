'use client';

import { useState, useRef, FormEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import { User, Phone, Calendar, Clock, Users, MapPin, MessageSquare, Send } from 'lucide-react';
import Image from 'next/image';
import { ReservationForm } from '@/types/restaurant';

export default function ReservationSection() {
  const [formState, setFormState] = useState<ReservationForm>({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    space: 'salle',
    message: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 5000);
    setFormState({
      name: '',
      phone: '',
      date: '',
      time: '',
      guests: 2,
      space: 'salle',
      message: ''
    });
  };

  const inputClassName = "w-full bg-[#171310] border border-[#4A2C20] rounded-lg px-4 py-3 pl-11 text-[#E8D8B8] focus:border-[#C59A4A] focus:ring-1 focus:ring-[#C59A4A] transition-all duration-300 placeholder:text-[#E8D8B8]/30 outline-none";
  const iconClassName = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C59A4A]";

  return (
    <section id="reservation" className="py-24 bg-[#171310] text-[#E8D8B8] font-[family-name:var(--font-jakarta)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 bg-[#4A2C20]/20 rounded-3xl overflow-hidden border border-[#4A2C20]/50"
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
              <div className="bg-[#596044]/20 border border-[#596044] rounded-xl p-8 text-center text-[#E8D8B8]">
                <div className="w-16 h-16 bg-[#596044]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-[#596044]" />
                </div>
                <h3 className="text-2xl font-[family-name:var(--font-playfair)] text-[#E8D8B8] mb-2">Demande envoyée</h3>
                <p className="text-[#E8D8B8]/80">
                  Votre demande de réservation a été envoyée avec succès. Notre équipe vous contactera très prochainement pour confirmation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="relative">
                    <Phone className={iconClassName} />
                    <input
                      type="tel"
                      required
                      placeholder="+237 Téléphone"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Calendar className={iconClassName} />
                    <input
                      type="date"
                      required
                      value={formState.date}
                      onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                      className={inputClassName}
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                  <div className="relative">
                    <Clock className={iconClassName} />
                    <input
                      type="time"
                      required
                      value={formState.time}
                      onChange={(e) => setFormState({ ...formState, time: e.target.value })}
                      className={inputClassName}
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Users className={iconClassName} />
                    <input
                      type="number"
                      min="1"
                      max="20"
                      required
                      placeholder="Nombre de convives"
                      value={formState.guests}
                      onChange={(e) => setFormState({ ...formState, guests: parseInt(e.target.value) })}
                      className={inputClassName}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className={iconClassName} />
                    <select
                      required
                      value={formState.space}
                      onChange={(e) => setFormState({ ...formState, space: e.target.value as ReservationForm['space'] })}
                      className={`${inputClassName} appearance-none`}
                    >
                      <option value="terrasse">Terrasse</option>
                      <option value="salle">Salle Principale</option>
                      <option value="vip">VIP Lounge</option>
                      <option value="privatisation-vip">Privatisation VIP</option>
                    </select>
                  </div>
                </div>

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

                <button
                  type="submit"
                  className="w-full bg-[#C59A4A] text-[#171310] font-bold text-lg hover:bg-[#B86B32] rounded-lg py-4 transition-colors duration-300 flex items-center justify-center"
                >
                  Réserver une table
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
