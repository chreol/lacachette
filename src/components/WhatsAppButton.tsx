"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Send } from "lucide-react";
import { buildRestaurantWhatsAppLink } from "@/lib/whatsapp";

const DEFAULT_MESSAGE =
  "Bonjour *La Cachette* 🙂, je souhaite avoir des informations sur : ";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const handleSend = () => {
    const link = buildRestaurantWhatsAppLink(message);
    window.open(link, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessage(DEFAULT_MESSAGE);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[58] bg-black/20 backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {/* Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[59] w-80 bg-[#1a1614] border border-[#4A2C20] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#25D366]">
            <div className="flex items-center gap-2">
              <Image
                src="/images/whatsapp-official.webp"
                alt="WhatsApp"
                width={22}
                height={22}
              />
              <div>
                <p className="text-white font-bold text-sm leading-tight">La Cachette</p>
                <p className="text-white/70 text-[10px]">Répond rapidement 🟢</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            {/* Preview bubble */}
            <div className="bg-[#241c18] rounded-xl rounded-tl-sm p-3 mb-3 border border-[#4A2C20]/40">
              <p className="text-[#E8D8B8]/50 text-xs mb-2">Votre message :</p>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent text-[#E8D8B8] text-sm resize-none outline-none placeholder:text-[#E8D8B8]/30 leading-relaxed"
                placeholder="Personnalisez votre message…"
              />
            </div>
            <p className="text-[#E8D8B8]/40 text-[10px] mb-3 text-center italic">
              Vous pouvez personnaliser le message avant l&apos;envoi
            </p>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl transition-colors duration-200"
            >
              <Send size={16} />
              Envoyer sur WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contactez-nous sur WhatsApp"
        className="fixed bottom-6 right-6 z-[60] flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 hover:scale-110 transition-transform duration-300"
      >
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none" />
        )}
        <Image
          src="/images/whatsapp-official.webp"
          alt="WhatsApp"
          width={32}
          height={32}
          className="relative"
        />
      </button>
    </>
  );
}
