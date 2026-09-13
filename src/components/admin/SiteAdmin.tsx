"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/lib/site-content";

const inputClass =
  "w-full bg-[#171310] border border-[#4A2C20] rounded-lg px-3 py-2 text-sm text-[#E8D8B8] outline-none focus:border-[#C59A4A]";

export default function SiteAdmin() {
  const [site, setSite] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/site")
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (data.site) setSite({ ...DEFAULT_SITE_CONTENT, ...data.site });
        if (!res.ok) setError(data.error ?? "Chargement impossible");
      })
      .catch(() => setError("Impossible de joindre le serveur"))
      .finally(() => setLoading(false));
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      const res = await fetch("/api/admin/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.detail ? `${data.error} — ${data.detail}` : data.error ?? "Échec");
        return;
      }
      setSite(data.site);
      setOk("Enregistré. Le site public se met à jour en quelques secondes.");
    } catch {
      setError("Réseau indisponible");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-[#C59A4A]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {error && <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">{error}</p>}
      {ok && <p className="text-sm text-green-300 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">{ok}</p>}

      <section className="space-y-3">
        <h2 className="text-[#C59A4A] font-semibold">Accueil</h2>
        <input className={inputClass} value={site.heroTitle} onChange={(e) => setSite({ ...site, heroTitle: e.target.value })} placeholder="Titre hero" />
        <input className={inputClass} value={site.heroSubtitle} onChange={(e) => setSite({ ...site, heroSubtitle: e.target.value })} placeholder="Sous-titre" />
        <input className={inputClass} value={site.tagline} onChange={(e) => setSite({ ...site, tagline: e.target.value })} placeholder="Accroche" />
        <textarea className={`${inputClass} min-h-20`} value={site.blurb} onChange={(e) => setSite({ ...site, blurb: e.target.value })} placeholder="Texte footer" />
      </section>

      <section className="space-y-3">
        <h2 className="text-[#C59A4A] font-semibold">Contact (NAP)</h2>
        <input className={inputClass} value={site.addressStreet} onChange={(e) => setSite({ ...site, addressStreet: e.target.value })} placeholder="Adresse" />
        <input className={inputClass} value={site.phone} onChange={(e) => setSite({ ...site, phone: e.target.value })} placeholder="Téléphone" />
        <input className={inputClass} value={site.email} onChange={(e) => setSite({ ...site, email: e.target.value })} placeholder="Email principal" />
        <input className={inputClass} value={site.emailAlt} onChange={(e) => setSite({ ...site, emailAlt: e.target.value })} placeholder="Email secondaire" />
      </section>

      <section className="space-y-3">
        <h2 className="text-[#C59A4A] font-semibold">Réseaux</h2>
        <input className={inputClass} value={site.instagramUrl} onChange={(e) => setSite({ ...site, instagramUrl: e.target.value })} placeholder="URL Instagram" />
        <input className={inputClass} value={site.facebookUrl} onChange={(e) => setSite({ ...site, facebookUrl: e.target.value })} placeholder="URL Facebook" />
        <input className={inputClass} value={site.tiktokUrl} onChange={(e) => setSite({ ...site, tiktokUrl: e.target.value })} placeholder="URL TikTok" />
      </section>

      <section className="space-y-3">
        <h2 className="text-[#C59A4A] font-semibold">Localisation</h2>
        <p className="text-xs text-[#E8D8B8]/40">
          Lien Google Maps officiel. Les coordonnées GPS sont déjà renseignées (Ékié).
        </p>
        <input className={inputClass} value={site.googleMapsUrl} onChange={(e) => setSite({ ...site, googleMapsUrl: e.target.value })} placeholder="Lien Google Maps" />
        <input className={inputClass} value={site.googleReviewUrl} onChange={(e) => setSite({ ...site, googleReviewUrl: e.target.value })} placeholder="Lien avis Google (fiche Business)" />
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} value={site.geoLat} onChange={(e) => setSite({ ...site, geoLat: e.target.value })} placeholder="Latitude" />
          <input className={inputClass} value={site.geoLng} onChange={(e) => setSite({ ...site, geoLng: e.target.value })} placeholder="Longitude" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-[#C59A4A] font-semibold">Horaires affichés</h2>
        {site.hoursLabels.map((row, i) => (
          <div key={row.days} className="grid grid-cols-2 gap-3">
            <input
              className={inputClass}
              value={row.days}
              onChange={(e) => {
                const hoursLabels = [...site.hoursLabels];
                hoursLabels[i] = { ...row, days: e.target.value };
                setSite({ ...site, hoursLabels });
              }}
            />
            <input
              className={inputClass}
              value={row.hours}
              onChange={(e) => {
                const hoursLabels = [...site.hoursLabels];
                hoursLabels[i] = { ...row, hours: e.target.value };
                setSite({ ...site, hoursLabels });
              }}
            />
          </div>
        ))}
      </section>

      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2.5 rounded-lg bg-[#C59A4A] text-[#171310] text-sm font-semibold disabled:opacity-60"
      >
        {saving ? "Enregistrement…" : "Enregistrer le site"}
      </button>
    </form>
  );
}
