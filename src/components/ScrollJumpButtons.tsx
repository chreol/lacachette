"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const btnClass =
  "flex items-center justify-center w-11 h-11 rounded-full bg-[#171310]/90 border border-[#C59A4A]/50 text-[#C59A4A] shadow-lg shadow-black/40 hover:bg-[#C59A4A] hover:text-[#171310] transition-colors";

export default function ScrollJumpButtons() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[55] flex flex-col gap-2">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={btnClass}
        aria-label="Retour en haut du site"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() =>
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
        }
        className={btnClass}
        aria-label="Aller en bas du site"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
}
