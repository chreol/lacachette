"use client";

import { useEffect, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { publicImagePath, SITE_SLOTS } from "@/lib/site-images";

export default function MediaAdmin() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bust, setBust] = useState(0);

  useEffect(() => {
    fetch("/api/admin/media")
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        setConfigured(Boolean(data.configured));
      })
      .catch(() => setConfigured(false));
  }, []);

  const upload = async (slot: string, file: File) => {
    setBusy(slot);
    setError(null);
    setMessage(null);
    const body = new FormData();
    body.set("slot", slot);
    body.set("file", file);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.detail ? `${data.error} — ${data.detail}` : data.error ?? "Upload impossible");
        return;
      }
      setMessage(`${slot} envoyé. ${data.hint ?? ""}`);
      setBust(Date.now());
    } catch {
      setError("Réseau indisponible");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      {configured === false && (
        <p className="text-sm text-amber-300/90 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
          Pour publier depuis l’admin : ajoute <code className="text-[#C59A4A]">SUPABASE_URL</code> +{" "}
          <code className="text-[#C59A4A]">SUPABASE_SERVICE_ROLE_KEY</code> (recommandé, photos immédiates)
          ou un <code className="text-[#C59A4A]">GITHUB_TOKEN</code> (commit dans le repo) dans Vercel, puis
          redéploie.
        </p>
      )}
      {message && (
        <p className="text-sm text-green-300/90 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <ul className="space-y-3">
        {SITE_SLOTS.map((img) => (
          <li
            key={img.file}
            className="flex flex-wrap items-center gap-4 bg-[#1a1614] border border-[#4A2C20]/40 rounded-xl p-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${publicImagePath(img.file)}?v=${bust}`}
              alt=""
              className="w-16 h-16 rounded-lg object-cover border border-[#4A2C20]"
            />
            <div className="flex-1 min-w-40">
              <p className="text-sm text-[#C59A4A] font-mono">{img.file}</p>
              <p className="text-xs text-[#E8D8B8]/50">{img.usage}</p>
            </div>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#C59A4A]/40 text-[#C59A4A] text-xs font-semibold cursor-pointer hover:bg-[#C59A4A] hover:text-[#171310] transition-colors">
              {busy === img.file ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Remplacer
              <input
                type="file"
                accept="image/webp,image/png,image/jpeg"
                className="hidden"
                disabled={busy !== null}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) void upload(img.file, file);
                }}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
