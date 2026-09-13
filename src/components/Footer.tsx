import { Globe, Share2, Music2, MessageCircle, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import FlagCounter from '@/components/FlagCounter';
import { SITE_URL } from '@/lib/site';
import { buildRestaurantWhatsAppLink } from '@/lib/whatsapp';
import { DELIVERY_WHATSAPP_MESSAGE } from '@/lib/restaurant-location';
import { getSiteContent, mapsUrlFromContent } from '@/lib/site-content';

const socialBtn =
  "w-10 h-10 rounded-full bg-[#171310] border border-[#4A2C20] flex items-center justify-center text-[#C59A4A] hover:bg-[#C59A4A] hover:text-[#171310] transition-colors duration-300";

export default async function Footer() {
  const site = await getSiteContent();
  const mapsUrl = mapsUrlFromContent(site);
  const wa = `https://wa.me/${site.phone.replace(/[^\d]/g, "")}`;
  const waDelivery = buildRestaurantWhatsAppLink(DELIVERY_WHATSAPP_MESSAGE);
  const tel = site.phone.startsWith("+") ? site.phone : `+${site.phone.replace(/[^\d]/g, "")}`;

  return (
    <footer id="contact" className="bg-[#0F0D0A] text-[#E8D8B8] font-[family-name:var(--font-jakarta)] relative">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C59A4A] to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-12">

          {/* Column 1: Brand & Socials */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo.webp"
                alt="LA CACHETTE"
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              <div>
                <h2 className="text-3xl font-[family-name:var(--font-playfair)] text-[#C59A4A] tracking-wide">
                  LA CACHETTE
                </h2>
                <p className="text-[#E8D8B8]/80 text-sm font-medium italic">
                  {site.tagline}
                </p>
              </div>
            </div>
            <p className="text-[#E8D8B8]/70 leading-relaxed max-w-sm">
              {site.blurb}
            </p>
            <div className="flex items-center space-x-4 pt-4">
              {site.instagramUrl ? (
                <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className={socialBtn} aria-label="Instagram">
                  <Globe className="w-5 h-5" />
                </a>
              ) : null}
              {site.facebookUrl ? (
                <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" className={socialBtn} aria-label="Facebook">
                  <Share2 className="w-5 h-5" />
                </a>
              ) : null}
              {site.tiktokUrl ? (
                <a href={site.tiktokUrl} target="_blank" rel="noopener noreferrer" className={socialBtn} aria-label="TikTok">
                  <Music2 className="w-5 h-5" />
                </a>
              ) : null}
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={socialBtn} aria-label="Google Maps">
                <MapPin className="w-5 h-5" />
              </a>
              {site.googleReviewUrl ? (
                <a href={site.googleReviewUrl} target="_blank" rel="noopener noreferrer" className={socialBtn} aria-label="Avis Google">
                  <Star className="w-5 h-5" />
                </a>
              ) : null}
            </div>
          </div>

          {/* Column 2: Horaires */}
          <div>
            <h3 className="text-xl font-[family-name:var(--font-playfair)] text-[#E8D8B8] mb-6 border-b border-[#4A2C20] pb-4 inline-block">
              Horaires
            </h3>
            <ul className="space-y-4 text-[#E8D8B8]/80">
              {site.hoursLabels.map((row) => (
                <li key={row.days} className="flex justify-between max-w-xs gap-4">
                  <span>{row.days}</span>
                  <span className={row.hours.toLowerCase().includes("fermé") ? "text-[#9A4F32] font-medium" : "text-[#C59A4A]"}>
                    {row.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Accès */}
          <div>
            <h3 className="text-xl font-[family-name:var(--font-playfair)] text-[#E8D8B8] mb-6 border-b border-[#4A2C20] pb-4 inline-block">
              Contact &amp; Accès
            </h3>
            <div className="space-y-3 text-[#E8D8B8]/80">
              {/* Adresse */}
              <div className="flex items-start gap-3">
                <span className="text-[#C59A4A] mt-0.5 flex-shrink-0">📍</span>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-[#C59A4A] transition-colors">
                  Sis à {site.addressStreet} – Yaoundé IV, Cameroun
                </a>
              </div>

              {/* Livraison */}
              <div className="flex items-start gap-3">
                <span className="text-[#C59A4A] mt-0.5 flex-shrink-0">🛵</span>
                <div className="text-sm">
                  <a href="/#livraison" className="hover:text-[#C59A4A] transition-colors">
                    Livraison Ékié &amp; alentours
                  </a>
                  <span className="text-[#E8D8B8]/40"> — </span>
                  <a
                    href={waDelivery}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:underline"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#C59A4A] mt-0.5 flex-shrink-0">🔐</span>
                <span className="text-xs text-[#E8D8B8]/60">Mobile Money · Virement · PayPal · Crypto</span>
              </div>

              {/* Téléphone */}
              <div className="flex items-center gap-3">
                <span className="text-[#C59A4A] flex-shrink-0">📞</span>
                <a href={`tel:${tel}`} className="hover:text-[#C59A4A] transition-colors text-sm">
                  {tel.replace("+237", "(237)")}
                </a>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-2">
                <Image
                  src="/images/whatsapp-official.webp"
                  alt="WhatsApp"
                  width={18}
                  height={18}
                  className="flex-shrink-0"
                />
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E8D8B8] hover:text-[#25D366] transition-colors text-sm"
                >
                  {tel} (WhatsApp)
                </a>
              </div>

              {/* Telegram Bot */}
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-[#229ED9] flex-shrink-0" />
                <a
                  href="https://t.me/LacachetteResto_Bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E8D8B8] hover:text-[#229ED9] transition-colors text-sm"
                >
                  @LacachetteResto_Bot
                </a>
              </div>

              {/* Website */}
              <div className="flex items-center gap-3">
                <span className="text-[#C59A4A] flex-shrink-0">🌐</span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E8D8B8] hover:text-[#C59A4A] transition-colors text-sm"
                >
                  {SITE_URL.replace(/^https?:\/\//, "")}
                </a>
              </div>

              {/* Emails */}
              <div className="flex items-start gap-3 pt-1">
                <span className="text-[#C59A4A] flex-shrink-0 mt-0.5">📧</span>
                <div className="flex flex-col gap-1">
                  <a href={`mailto:${site.email}`} className="text-xs text-[#E8D8B8]/70 hover:text-[#C59A4A] transition-colors">
                    {site.email}
                  </a>
                  <a href={`mailto:${site.emailAlt}`} className="text-xs text-[#E8D8B8]/70 hover:text-[#C59A4A] transition-colors">
                    {site.emailAlt}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Chreol Empire Brand */}
      <div className="border-t border-[#4A2C20]/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <span className="text-[#E8D8B8]/30 text-xs uppercase tracking-widest">Une marque déposée de</span>
          <a
            href="https://chreolempire.com"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity duration-300"
          >
            <Image
              src="/images/chreol-empire.png"
              alt="Chreol Empire"
              width={110}
              height={36}
              className="object-contain"
            />
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#4A2C20]/50 bg-[#0A0807]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[#E8D8B8]/60 text-sm text-center md:text-left">
            © 2026 La Cachette. Tous droits réservés. <span className="hidden md:inline">|</span> Fait avec ♥ à Yaoundé
          </p>
          <FlagCounter />
          <p className="text-[#E8D8B8]/30 text-xs">
            Powered by <a href="https://chreolempire.com" target="_blank" rel="noopener noreferrer" className="text-[#C59A4A]/50 hover:text-[#C59A4A] transition-colors">Chreol Empire</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
