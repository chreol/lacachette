"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lamp, TreePalm, Music, ChevronDown } from "lucide-react";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/entree.webp"
          alt="La Cachette Entrée"
          fill
          priority
          className="object-cover object-center"
          quality={90}
        />
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#171310_75%)] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171310] via-[#171310]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.h1 
            variants={itemVariants}
            className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl lg:text-8xl text-[#E8D8B8] font-bold leading-tight mb-6 drop-shadow-2xl"
          >
            Un écrin secret <br className="hidden md:block" /> au cœur de Yaoundé
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="font-[family-name:var(--font-jakarta)] text-lg md:text-xl text-[#C59A4A] tracking-widest uppercase mb-12"
          >
            Gastronomie camerounaise revisitée · Cocktails signature · Live Sessions
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
          >
            <Link
              href="#reservation"
              className="w-full sm:w-auto px-8 py-4 bg-[#C59A4A] text-[#171310] font-bold font-[family-name:var(--font-jakarta)] text-sm uppercase tracking-wider rounded-md hover:bg-[#B86B32] transition-all duration-300 shadow-[0_0_20px_rgba(197,154,74,0.4)] hover:shadow-[0_0_30px_rgba(184,107,50,0.6)]"
            >
              Réserver une Table
            </Link>
            <Link
              href="#menu"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#C59A4A] text-[#C59A4A] font-bold font-[family-name:var(--font-jakarta)] text-sm uppercase tracking-wider rounded-md hover:bg-[#C59A4A] hover:text-[#171310] transition-all duration-300"
            >
              Découvrir le Menu
            </Link>
          </motion.div>

          {/* Badges */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-6 md:gap-12"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-[#4A2C20] bg-[#171310]/50 backdrop-blur-sm flex items-center justify-center text-[#C59A4A]">
                <Lamp size={24} />
              </div>
              <span className="text-[#E8D8B8] font-[family-name:var(--font-jakarta)] text-xs uppercase tracking-wider">2700K Ambiance</span>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-[#4A2C20] bg-[#171310]/50 backdrop-blur-sm flex items-center justify-center text-[#C59A4A]">
                <TreePalm size={24} />
              </div>
              <span className="text-[#E8D8B8] font-[family-name:var(--font-jakarta)] text-xs uppercase tracking-wider">Bois & Bambou</span>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-[#4A2C20] bg-[#171310]/50 backdrop-blur-sm flex items-center justify-center text-[#C59A4A]">
                <Music size={24} />
              </div>
              <span className="text-[#E8D8B8] font-[family-name:var(--font-jakarta)] text-xs uppercase tracking-wider">Live Sessions</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" as const }}
        >
          <ChevronDown className="text-[#C59A4A] w-8 h-8 opacity-70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
