'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Flame, BookOpen, Star, Heart } from 'lucide-react';

const milestones = [
  {
    icon: Flame,
    year: '2024',
    title: "L'Étincelle",
    text: "Tout a commencé avec une idée simple : créer un lieu où Yaoundé pourrait s'évader, loin du bruit de la ville. Un endroit secret, chaleureux, porteur de l'âme africaine.",
  },
  {
    icon: BookOpen,
    year: '2025',
    title: 'Le Projet Prend Forme',
    text: "Des mois de réflexion, de voyages et d'inspirations. L'équipe fondatrice imagine chaque détail : les matériaux locaux, les saveurs revisitées, l'ambiance tamisée des grandes cachettes.",
  },
  {
    icon: Star,
    year: '2026',
    title: 'La Cachette Naît',
    text: "Ékié, Dernier Poteau. Une adresse discrète pour un restaurant d'exception. La Cachette ouvre ses portes et accueille ses premiers convives dans un décor vintage africain soigneusement pensé.",
  },
  {
    icon: Heart,
    year: "Aujourd'hui",
    title: "L'Ambiance Se Cache Ici",
    text: "Chaque soir, La Cachette vit et respire. Des tables partagées, des rires, de la musique live. Un lieu vivant, en perpétuelle évolution, qui grandit avec vous.",
  },
];

export default function StorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="histoire"
      className="py-24 bg-[#0F0D0A] text-[#E8D8B8] font-[family-name:var(--font-jakarta)] overflow-hidden relative"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#4A2C20_0%,_transparent_70%)] opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C59A4A] to-transparent opacity-30" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C59A4A] to-transparent opacity-30" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-[#C59A4A] text-sm font-bold tracking-widest uppercase mb-4 block">
            Notre Histoire
          </span>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-playfair)] text-[#E8D8B8] mb-6">
            La Naissance d&apos;un Secret
          </h2>
          <p className="text-[#E8D8B8]/60 max-w-2xl mx-auto text-lg leading-relaxed">
            De l&apos;idée folle à l&apos;adresse incontournable — l&apos;histoire vraie de La Cachette.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical center line (desktop) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#4A2C20] to-transparent hidden lg:block" />

          <div className="space-y-8 lg:space-y-0">
            {milestones.map((item, i) => {
              const Icon = item.icon;
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  className={`relative flex flex-col lg:flex-row lg:items-center gap-6 lg:mb-14 ${
                    isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Card */}
                  <div className={`lg:w-[45%] ${isLeft ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="group bg-[#1a1614] border border-[#4A2C20]/50 rounded-2xl p-6 hover:border-[#C59A4A]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#C59A4A]/5">
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'lg:flex-row-reverse' : ''}`}>
                        <span className="text-xs font-bold tracking-widest text-[#C59A4A] uppercase bg-[#C59A4A]/10 px-3 py-1 rounded-full border border-[#C59A4A]/20 flex-shrink-0">
                          {item.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-[family-name:var(--font-playfair)] text-[#E8D8B8] mb-3">
                        {item.title}
                      </h3>
                      <p className="text-[#E8D8B8]/60 leading-relaxed text-sm">
                        {item.text}
                      </p>
                    </div>
                  </div>

                  {/* Center Icon (desktop) */}
                  <div className="hidden lg:flex lg:w-[10%] items-center justify-center z-10">
                    <div className="w-12 h-12 rounded-full bg-[#4A2C20] border-2 border-[#C59A4A]/50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#C59A4A]" />
                    </div>
                  </div>

                  {/* Mobile: icon inline */}
                  <div className="flex items-center gap-3 lg:hidden">
                    <div className="w-8 h-8 rounded-full bg-[#4A2C20] border border-[#C59A4A]/50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#C59A4A]" />
                    </div>
                    <div className="h-px flex-1 bg-[#4A2C20]/50" />
                  </div>

                  {/* Spacer (desktop) */}
                  <div className="lg:w-[45%] hidden lg:block" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center mt-16"
        >
          <p className="text-[#E8D8B8]/40 text-sm italic mb-6">
            Et l&apos;histoire continue, à chaque réservation, à chaque soirée partagée.
          </p>
          <a
            href="#reservation"
            className="inline-block px-8 py-3.5 bg-transparent border-2 border-[#C59A4A] text-[#C59A4A] font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-[#C59A4A] hover:text-[#171310] transition-all duration-300"
          >
            Écrire votre chapitre
          </a>
        </motion.div>
      </div>
    </section>
  );
}
