"use client";

import { useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

export default function ImagePicker({
  folder,
  entityId,
  value,
  onChange,
}: {
  folder: "menu" | "events";
  entityId: string;
  value: string;
  onChange: (path: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    const local = URL.createObjectURL(file);
    setPreview(local);
    const body = new FormData();
    body.set("folder", folder);
    body.set("id", entityId);
    body.set("file", file);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.detail ? `${data.error} — ${data.detail}` : data.error ?? "Upload impossible");
        setPreview(null);
        return;
      }
      onChange(data.path ?? value);
    } catch {
      setError("Réseau indisponible");
      setPreview(null);
    } finally {
      setBusy(false);
    }
  };

  const shown = preview || value;

  return (
    <div className="md:col-span-2 rounded-xl border border-[#4A2C20] bg-[#171310] p-4 space-y-3">
      <p className="text-xs uppercase tracking-wider text-[#C59A4A]">Photo</p>
      <div className="flex flex-wrap items-center gap-4">
        <div className="w-28 h-20 rounded-lg overflow-hidden border border-[#4A2C20] bg-[#4A2C20]/40 flex items-center justify-center">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImagePlus className="w-6 h-6 text-[#E8D8B8]/30" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#C59A4A]/40 text-[#C59A4A] text-xs font-semibold cursor-pointer hover:bg-[#C59A4A] hover:text-[#171310] w-fit">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
            {value ? "Changer la photo" : "Ajouter une photo"}
            <input
              type="file"
              accept="image/webp,image/png,image/jpeg"
              className="hidden"
              disabled={busy}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) void upload(file);
              }}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                onChange("");
              }}
              className="inline-flex items-center gap-1 text-xs text-red-400/80 hover:text-red-400"
            >
              <Trash2 className="w-3 h-3" />
              Retirer
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <p className="text-[11px] text-[#E8D8B8]/40">
        WebP / JPG / PNG · max 1,5 Mo. La photo est visible tout de suite, sans redéploiement.
      </p>
    </div>
  );
}
