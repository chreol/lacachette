'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Music, Clock } from 'lucide-react';
import { liveEvents as fallbackEvents, type LiveEvent } from '@/types/restaurant';
import { mediaSrc } from '@/lib/site-images';

function eventDay(date: string) {
  const d = new Date(`${date}T12:00:00`);
  return {
    day: d.getDate(),
    month: d.toLocaleString('fr-FR', { month: 'short' }),
  };
}

export default function EventsSection({ events = fallbackEvents }: { events?: LiveEvent[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <section id="events" className="py-24 bg-[#1E1A15] text-[#E8D8B8] font-[family-name:var(--font-jakarta)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#C59A4A] text-sm font-bold tracking-widest uppercase mb-4 block">
            LIVE LOUNGE
          </span>
          <h2 className="text-4xl md:text-5xl text-[#E8D8B8] font-[family-name:var(--font-playfair)]">
            Soirées & Événements
          </h2>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {events.map((event) => (
            <motion.div
              key={event.id}
              variants={itemVariants}
              className="bg-[#4A2C20] rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 flex flex-col group relative"
            >
              {/* Top section: Gradient placeholder */}
              <div className="h-48 bg-gradient-to-br from-[#171310] to-[#9A4F32] flex flex-col items-center justify-center relative p-6 overflow-hidden">
                {event.image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mediaSrc(event.image)} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#171310]/45" />
                    <span className="relative z-10 text-[#E8D8B8] font-medium tracking-wide uppercase drop-shadow-lg">
                      {event.genre}
                    </span>
                  </>
                ) : (
                  <>
                    <Music className="w-12 h-12 text-[#C59A4A] mb-2 opacity-80" />
                    <span className="text-[#E8D8B8] font-medium tracking-wide uppercase">{event.genre}</span>
                  </>
                )}
                {/* Date badge */}
                <div className="absolute top-4 right-4 z-20 bg-[#C59A4A] text-[#171310] rounded-lg px-3 py-2 text-center shadow-lg">
                  <span className="block font-bold text-lg leading-none">{eventDay(event.date).day}</span>
                  <span className="block text-xs uppercase font-medium mt-1">
                    {eventDay(event.date).month}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-[family-name:var(--font-playfair)] text-[#E8D8B8] mb-1">
                  {event.title}
                </h3>
                <p className="text-[#C59A4A] font-medium mb-4">{event.artist}</p>

                <div className="flex items-center text-[#E8D8B8]/70 mb-4 text-sm">
                  <Clock className="w-4 h-4 mr-2 text-[#C59A4A]" />
                  <span>{event.time}</span>
                </div>

                <p className="text-[#E8D8B8]/80 text-sm mb-6 flex-1 line-clamp-3">
                  {event.description}
                </p>

                {/* Bottom */}
                <Link
                  href={`/reserver?event=${event.id}`}
                  className="w-full py-3 border border-[#C59A4A] text-[#C59A4A] rounded-lg font-medium hover:bg-[#C59A4A] hover:text-[#171310] transition-colors duration-300 text-center"
                >
                  Pré-réserver
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
