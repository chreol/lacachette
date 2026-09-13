"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

const btnClass =
  "flex items-center justify-center w-11 h-11 rounded-full bg-[#171310]/95 border border-[#C59A4A]/60 text-[#C59A4A] shadow-lg shadow-black/40 hover:bg-[#C59A4A] hover:text-[#171310] transition-colors";

function scrollRoot() {
  return document.scrollingElement ?? document.documentElement;
}

export default function ScrollJumpButtons() {
  const pathname = usePathname();
  const [visible, setVisible] = useState({ top: false, bottom: false });

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const update = () => {
      const el = scrollRoot();
      const y = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      setVisible({
        top: y > 240,
        bottom: max > 320 && y < max - 240,
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;
  if (!visible.top && !visible.bottom) return null;

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[45] flex flex-col gap-2 pointer-events-none">
      {visible.top && (
        <button
          type="button"
          onClick={() => scrollRoot().scrollTo({ top: 0, behavior: "smooth" })}
          className={`${btnClass} pointer-events-auto`}
          aria-label="Retour en haut du site"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
      {visible.bottom && (
        <button
          type="button"
          onClick={() => {
            const el = scrollRoot();
            el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
          }}
          className={`${btnClass} pointer-events-auto`}
          aria-label="Aller en bas du site"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
