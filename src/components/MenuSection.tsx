"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, UtensilsCrossed, Wine, GlassWater, Leaf, Star, BadgeCheck, ChefHat, Sparkles } from "lucide-react";
import { menuItems, type MenuCategory, type MenuItem } from "@/types/restaurant";

const categories: { key: MenuCategory; label: string; icon: React.ElementType }[] = [
  { key: "grillades", label: "Grillades & Braisés", icon: Flame },
  { key: "specialites", label: "Spécialités Camerounaises", icon: UtensilsCrossed },
  { key: "cocktails", label: "Cocktails Signature", icon: Wine },
  { key: "boissons", label: "Boissons Locales", icon: GlassWater },
];

function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getBadgeStyle(badge: MenuItem["badge"]) {
  switch (badge) {
    case "Incontournable":
      return "bg-[#C59A4A]/20 text-[#C59A4A] border-[#C59A4A]/30";
    case "Chef":
      return "bg-[#9A4F32]/20 text-[#9A4F32] border-[#9A4F32]/30";
    case "Signature":
      return "bg-[#B86B32]/20 text-[#B86B32] border-[#B86B32]/30";
    case "Nouveau":
      return "bg-[#596044]/20 text-[#596044] border-[#596044]/30";
    default:
      return "";
  }
}

function getBadgeIcon(badge: MenuItem["badge"]) {
  switch (badge) {
    case "Incontournable":
      return Star;
    case "Chef":
      return ChefHat;
    case "Signature":
      return BadgeCheck;
    case "Nouveau":
      return Sparkles;
    default:
      return Star;
  }
}

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("grillades");

  const filteredItems = menuItems.filter((item) => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block text-xs tracking-[0.3em] uppercase text-[#C59A4A] font-semibold mb-4"
        >
          Saveurs du Pays
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] text-[#E8D8B8] mb-4"
        >
          Notre Carte
        </motion.h2>
        <div className="h-px w-20 bg-[#C59A4A] mx-auto" />
      </div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3 mb-14"
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-300 border ${
                isActive
                  ? "bg-[#C59A4A] text-[#171310] border-[#C59A4A] shadow-lg shadow-[#C59A4A]/15"
                  : "bg-[#4A2C20]/50 text-[#E8D8B8]/60 border-[#4A2C20] hover:bg-[#4A2C20] hover:text-[#E8D8B8] hover:border-[#C59A4A]/30"
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Menu Items Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredItems.map((item, index) => {
            const BadgeIcon = item.badge ? getBadgeIcon(item.badge) : null;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="group bg-[#4A2C20]/60 backdrop-blur-sm rounded-xl p-6 border border-[#4A2C20] hover:border-[#C59A4A]/30 hover:bg-[#5D3A2C]/60 transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    {/* Name + Badges */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold font-[family-name:var(--font-playfair)] text-[#E8D8B8] group-hover:text-[#C59A4A] transition-colors duration-300">
                        {item.name}
                      </h3>
                      {item.badge && BadgeIcon && (
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getBadgeStyle(item.badge)}`}
                        >
                          <BadgeIcon size={10} />
                          {item.badge}
                        </span>
                      )}
                      {item.isVegetarian && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-[#596044]/20 text-[#596044] border border-[#596044]/30">
                          <Leaf size={10} />
                          Végé
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#E8D8B8]/50 mb-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Spices */}
                    {item.spices && item.spices.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.spices.map((spice) => (
                          <span
                            key={spice}
                            className="text-[10px] italic text-[#9A4F32] bg-[#9A4F32]/10 px-2 py-0.5 rounded"
                          >
                            🌶 {spice}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <span className="text-xl font-bold text-[#C59A4A] font-[family-name:var(--font-playfair)]">
                      {formatPrice(item.price)}
                    </span>
                    <span className="block text-[10px] text-[#E8D8B8]/30 uppercase tracking-wider mt-0.5">
                      FCFA
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
