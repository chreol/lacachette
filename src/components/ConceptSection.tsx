"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Hammer, Leaf, Palette } from "lucide-react";

export default function ConceptSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  const textVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: "easeOut" as const, staggerChildren: 0.2 } 
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const features = [
    {
      icon: <Hammer className="w-6 h-6" />,
      title: "Matériaux Locaux"
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Éco-Responsable"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Artisanat Camerounais"
    }
  ];

  return (
    <section id="concept" className="w-full bg-[#171310] py-24 lg:py-32 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Image Side - Left */}
          <motion.div 
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-[#C59A4A]/30 shadow-[0_0_40px_rgba(197,154,74,0.15)] group">
              <Image
                src="/images/terrasse.webp"
                alt="La Cachette Terrasse"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171310]/80 via-transparent to-transparent pointer-events-none" />
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-[#9A4F32] rounded-br-3xl pointer-events-none opacity-50" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-[#C59A4A] rounded-tl-3xl pointer-events-none opacity-50" />
          </motion.div>

          {/* Content Side - Right */}
          <motion.div 
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="w-full lg:w-1/2 flex flex-col"
          >
            <motion.span 
              variants={itemVariants}
              className="text-[#C59A4A] font-[family-name:var(--font-jakarta)] text-sm uppercase tracking-[0.3em] font-semibold mb-4"
            >
              NOTRE HISTOIRE
            </motion.span>
            
            <motion.h2 
              variants={itemVariants}
              className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#E8D8B8] font-bold mb-8 leading-tight"
            >
              Le Sanctuaire Caché d&apos;Ékié
            </motion.h2>
            
            <motion.div variants={itemVariants} className="space-y-6 text-[#E8D8B8]/80 font-[family-name:var(--font-jakarta)] text-lg leading-relaxed mb-12">
              <p>
                Niché discrètement au cœur du quartier d&apos;Ékié, La Cachette est bien plus qu&apos;un simple restaurant-bar. C&apos;est un refuge intime conçu pour éveiller les sens et célébrer l&apos;authenticité camerounaise.
              </p>
              <p>
                L&apos;âme du lieu réside dans sa conception. Chaque élément célèbre l&apos;artisanat local : des meubles sculptés dans des palettes recyclées, du bambou de nos forêts intégré à la décoration, et des murs en briques de terre cuite qui conservent la chaleur de notre accueil.
              </p>
              <p>
                Baigné dans une lumière chaude et ambrée de 2700K, notre sanctuaire vous invite à la détente, au partage et à la découverte d&apos;une gastronomie qui honore nos racines tout en explorant de nouveaux horizons.
              </p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-[#4A2C20] rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 border border-[#C59A4A]/10 hover:border-[#C59A4A]/40 transition-colors duration-300"
                >
                  <div className="text-[#C59A4A]">
                    {feature.icon}
                  </div>
                  <h3 className="text-[#E8D8B8] font-[family-name:var(--font-jakarta)] text-sm font-semibold leading-snug">
                    {feature.title}
                  </h3>
                </div>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
