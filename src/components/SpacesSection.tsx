"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DoorOpen, TreePalm, Wine, Crown, ChefHat, Sparkles, MapPin } from "lucide-react";
import { spaces } from "@/types/restaurant";

const getIcon = (name: string) => {
  switch (name) {
    case "DoorOpen": return <DoorOpen className="w-5 h-5" />;
    case "TreePalm": return <TreePalm className="w-5 h-5" />;
    case "Wine": return <Wine className="w-5 h-5" />;
    case "Crown": return <Crown className="w-5 h-5" />;
    case "ChefHat": return <ChefHat className="w-5 h-5" />;
    case "Sparkles": return <Sparkles className="w-5 h-5" />;
    default: return <Sparkles className="w-5 h-5" />;
  }
};

export default function SpacesSection() {
  const [activeTab, setActiveTab] = useState<string>(spaces[0].id);

  const currentSpace = spaces.find((s) => s.id === activeTab) || spaces[0];

  return (
    <section id="spaces" className="py-24 bg-[#171310] text-[#E8D8B8]">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Title Section */}
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[#C59A4A] tracking-[0.2em] text-xs font-bold uppercase mb-4">
            EXPLOREZ
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl text-[#E8D8B8] mb-6">
            Nos Espaces
          </h2>
          <div className="w-24 h-[2px] bg-[#C59A4A]"></div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-row overflow-x-auto md:flex-wrap md:justify-center gap-4 mb-16 pb-4 scrollbar-hide">
          {spaces.map((space) => {
            const isActive = activeTab === space.id;
            return (
              <button
                key={space.id}
                onClick={() => setActiveTab(space.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "bg-[#C59A4A] text-[#171310] font-bold shadow-[0_0_15px_rgba(197,154,74,0.4)]"
                    : "bg-[#4A2C20] text-[#E8D8B8] hover:bg-[#5D3A2C]"
                }`}
              >
                {getIcon(space.icon)}
                <span className="font-[family-name:var(--font-jakarta)] text-sm">{space.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSpace.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" as const }}
              className="flex flex-col lg:flex-row gap-12 items-center"
            >
              {/* Left side: Image */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(197,154,74,0.3)]">
                  <Image
                    src={currentSpace.image}
                    alt={currentSpace.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C59A4A]/50 rounded-2xl transition-all duration-500"></div>
                </div>
              </div>

              {/* Right side: Content */}
              <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                <span className="bg-[#171310] border border-[#9A4F32] text-[#9A4F32] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
                  {currentSpace.zone}
                </span>
                
                <h3 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#E8D8B8] mb-4">
                  {currentSpace.name}
                </h3>
                
                <p className="text-[#C59A4A] italic text-lg mb-6 font-[family-name:var(--font-playfair)]">
                  &ldquo;{currentSpace.tagline}&rdquo;
                </p>
                
                <p className="text-[#E8D8B8]/80 leading-relaxed font-[family-name:var(--font-jakarta)] mb-8 text-lg">
                  {currentSpace.description}
                </p>
                
                <div className="mb-8">
                  <h4 className="text-sm uppercase tracking-wider text-[#E8D8B8]/60 mb-4 font-bold">Matériaux mis en valeur</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentSpace.materials.map((material, idx) => (
                      <span 
                        key={idx} 
                        className="bg-[#171310] border border-[#4A2C20] text-[#9A4F32] text-sm px-4 py-2 rounded-lg font-[family-name:var(--font-jakarta)]"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>

                {currentSpace.craftLocation && (
                  <div className="flex items-center gap-3 text-[#E8D8B8]/70 bg-[#4A2C20]/50 px-5 py-3 rounded-xl">
                    <MapPin className="text-[#C59A4A] w-5 h-5" />
                    <span className="text-sm font-medium">Réalisé par : {currentSpace.craftLocation}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
