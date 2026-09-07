import { Globe, Share2, Music2, MessageCircle, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0F0D0A] text-[#E8D8B8] font-[family-name:var(--font-jakarta)] relative">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C59A4A] to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-12">

          {/* Column 1: Brand & Socials */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-[family-name:var(--font-playfair)] text-[#C59A4A] mb-2 tracking-wide">
                LA CACHETTE
              </h2>
              <p className="text-[#E8D8B8]/80 text-sm font-medium tracking-widest uppercase">
                Restaurant-Bar · Vintage Africain
              </p>
            </div>
            <p className="text-[#E8D8B8]/70 leading-relaxed max-w-sm">
              Une évasion intimiste au cœur de Yaoundé. L'élégance du vintage africain rencontre la gastronomie moderne.
            </p>
            <div className="flex items-center space-x-4 pt-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-[#171310] border border-[#4A2C20] flex items-center justify-center text-[#C59A4A] hover:bg-[#C59A4A] hover:text-[#171310] transition-colors duration-300">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-[#171310] border border-[#4A2C20] flex items-center justify-center text-[#C59A4A] hover:bg-[#C59A4A] hover:text-[#171310] transition-colors duration-300">
                <Share2 className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-[#171310] border border-[#4A2C20] flex items-center justify-center text-[#C59A4A] hover:bg-[#C59A4A] hover:text-[#171310] transition-colors duration-300">
                <Music2 className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Horaires */}
          <div>
            <h3 className="text-xl font-[family-name:var(--font-playfair)] text-[#E8D8B8] mb-6 border-b border-[#4A2C20] pb-4 inline-block">
              Horaires
            </h3>
            <ul className="space-y-4 text-[#E8D8B8]/80">
              <li className="flex justify-between max-w-xs">
                <span>Mardi - Jeudi</span>
                <span className="text-[#C59A4A]">17h - 00h</span>
              </li>
              <li className="flex justify-between max-w-xs">
                <span>Vendredi - Samedi</span>
                <span className="text-[#C59A4A]">17h - 02h</span>
              </li>
              <li className="flex justify-between max-w-xs">
                <span className="flex-1">Dimanche <br/><span className="text-xs text-[#E8D8B8]/50">(Brunch & Chill)</span></span>
                <span className="text-[#C59A4A]">12h - 22h</span>
              </li>
              <li className="flex justify-between max-w-xs pt-2">
                <span>Lundi</span>
                <span className="text-[#9A4F32] font-medium">Fermé</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Accès */}
          <div>
            <h3 className="text-xl font-[family-name:var(--font-playfair)] text-[#E8D8B8] mb-6 border-b border-[#4A2C20] pb-4 inline-block">
              Contact & Accès
            </h3>
            <div className="space-y-4 text-[#E8D8B8]/80">
              <p>
                Ékié, Yaoundé, Cameroun
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <MessageCircle className="w-5 h-5 text-[#C59A4A]" />
                <span className="text-[#E8D8B8] hover:text-[#C59A4A] transition-colors cursor-pointer">
                  +237 6XX XXX XXX (WhatsApp)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[#E8D8B8] hover:text-[#C59A4A] transition-colors cursor-pointer">
                  contact@lacachette-yd.com
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#4A2C20]/50 bg-[#0A0807]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#E8D8B8]/60 text-sm">
            © 2026 La Cachette. Tous droits réservés. <span className="hidden md:inline">|</span> Fait avec ♥ à Yaoundé
          </p>
          <div className="flex items-center space-x-2 text-[#596044] bg-[#596044]/10 px-4 py-2 rounded-full text-xs font-medium border border-[#596044]/20">
            <Leaf className="w-4 h-4" />
            <span>Éco-responsable · Matériaux locaux</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
