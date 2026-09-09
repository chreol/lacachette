"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Le Concept", href: "#concept" },
  { label: "Nos Espaces", href: "#spaces" },
  { label: "La Carte", href: "#menu" },
  { label: "Événements", href: "#events" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      setHidden(currentY > lastScrollY && currentY > 300);
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "bg-[#171310]/95 backdrop-blur-xl border-b border-[#C59A4A]/10 shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-2 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group shrink-0">
            <Image
              src="/images/logo.webp"
              alt="LA CACHETTE"
              width={50}
              height={50}
              loading="eager"   // ← force le chargement immédiat (pas de lazy loading)
              priority          // ← indique que c'est une image critique pour le LCP
              
            />
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold tracking-wider font-[family-name:var(--font-playfair)] text-[#C59A4A] group-hover:text-[#B86B32] transition-colors duration-300">
                LA CACHETTE
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#E8D8B8]/40 uppercase">
                Ékié · Yaoundé
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide text-[#E8D8B8]/70 hover:text-[#C59A4A] transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-[#C59A4A] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#reservation"
              className="ml-4 px-6 py-2.5 bg-[#C59A4A] text-[#171310] text-sm font-bold rounded-lg hover:bg-[#B86B32] transition-all duration-300 hover:shadow-lg hover:shadow-[#C59A4A]/20"
            >
              Réserver une table
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-[#E8D8B8] hover:text-[#C59A4A] transition-colors p-2"
            aria-label="Menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#171310]/98 backdrop-blur-2xl flex flex-col items-center justify-center transition-all duration-500 lg:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="text-2xl font-[family-name:var(--font-playfair)] text-[#E8D8B8] hover:text-[#C59A4A] transition-colors duration-300"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#reservation"
            onClick={handleLinkClick}
            className="mt-4 px-10 py-4 bg-[#C59A4A] text-[#171310] text-lg font-bold rounded-xl hover:bg-[#B86B32] transition-all duration-300"
          >
            Réserver une table
          </a>
        </div>
      </div>
    </>
  );
}
