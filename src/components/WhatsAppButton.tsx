"use client";

import Image from "next/image";
import { buildRestaurantWhatsAppLink } from "@/lib/whatsapp";

const DEFAULT_MESSAGE = "Bonjour *La Cachette*, je souhaite avoir des informations 🙂";

export default function WhatsAppButton() {
  const href = buildRestaurantWhatsAppLink(DEFAULT_MESSAGE);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactez-nous sur WhatsApp"
      className="fixed bottom-6 right-6 z-[60] flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 hover:scale-110 transition-transform duration-300"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none" />
      <Image
        src="/images/whatsapp-official.webp"
        alt="WhatsApp"
        width={32}
        height={32}
        className="relative"
      />
    </a>
  );
}
