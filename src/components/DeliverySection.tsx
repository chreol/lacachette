import { Bike } from "lucide-react";
import { buildRestaurantWhatsAppLink } from "@/lib/whatsapp";
import {
  DELIVERY_WHATSAPP_MESSAGE,
  DELIVERY_ZONES,
  type DeliveryZoneKey,
} from "@/lib/restaurant-location";

const ZONE_KEYS = Object.keys(DELIVERY_ZONES) as DeliveryZoneKey[];

function formatFcfa(amount: number) {
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} F`;
}

export default function DeliverySection() {
  const wa = buildRestaurantWhatsAppLink(DELIVERY_WHATSAPP_MESSAGE);

  return (
    <section id="livraison" className="py-20 px-6 md:px-12 bg-[#0F0D0A]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#C59A4A] font-semibold mb-4">
            Chez vous
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] text-[#E8D8B8] mb-4">
            Livraison
          </h2>
          <div className="h-px w-20 bg-[#C59A4A] mx-auto mb-6" />
          <p className="text-[#E8D8B8]/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Ékié et alentours. Indiquez votre quartier sur WhatsApp : on confirme la zone, les frais
            et le délai avant de partir. Hors zone, on vous le dit tout de suite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {ZONE_KEYS.map((key) => {
            const zone = DELIVERY_ZONES[key];
            return (
              <article
                key={key}
                className="rounded-2xl border border-[#4A2C20] bg-[#171310] p-6 flex flex-col"
              >
                <p className="text-[#C59A4A] text-xs font-bold tracking-wider uppercase mb-2">
                  {zone.label}
                </p>
                <p className="text-3xl font-[family-name:var(--font-playfair)] text-[#E8D8B8] mb-1">
                  {formatFcfa(zone.fee)}
                </p>
                <p className="text-sm text-[#E8D8B8]/50 mb-4">{zone.delay}</p>
                <p className="text-xs text-[#E8D8B8]/40 mb-3">
                  Minimum indicatif {formatFcfa(zone.minOrder)}
                </p>
                <ul className="text-sm text-[#E8D8B8]/80 space-y-1 mt-auto">
                  {zone.quartiers.map((q) => (
                    <li key={q}>· {q}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <p className="text-center text-xs text-[#E8D8B8]/40 mb-8 max-w-xl mx-auto">
          Tarifs et délais indicatifs, à confirmer selon l’heure et la circulation. La commande se
          passe sur WhatsApp — pas de paiement en ligne pour la livraison.
        </p>

        <div className="flex justify-center">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-[#171310] font-bold text-sm uppercase tracking-wider rounded-md hover:bg-[#20bd5a] transition-colors"
          >
            <Bike className="w-5 h-5" />
            Commander sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
