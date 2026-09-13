"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { LiveEvent } from "@/types/restaurant";
import ImagePicker from "@/components/admin/ImagePicker";
import { mediaSrc } from "@/lib/site-images";

type EventRow = LiveEvent & { isPublished?: boolean };

const emptyForm = {
  title: "",
  date: "",
  time: "20h00",
  artist: "",
  genre: "",
  description: "",
  isPublished: true,
  image: "",
};

const inputClass =
  "w-full bg-[#171310] border border-[#4A2C20] rounded-lg px-3 py-2 text-sm text-[#E8D8B8] outline-none focus:border-[#C59A4A]";

export default function EventsAdmin() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [assetId, setAssetId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.detail ? `${data.error} — ${data.detail}` : data.error ?? "Chargement impossible");
        setEvents([]);
      } else {
        setEvents(data.events ?? []);
        setError(null);
      }
    } catch {
      setError("Impossible de joindre le serveur");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setEditingId("new");
    setAssetId(crypto.randomUUID());
    setForm(emptyForm);
    setError(null);
  };

  const startEdit = (event: EventRow) => {
    setEditingId(event.id);
    setAssetId(event.id);
    setForm({
      title: event.title,
      date: event.date,
      time: event.time,
      artist: event.artist,
      genre: event.genre,
      description: event.description,
      isPublished: event.isPublished !== false,
      image: event.image ?? "",
    });
    setError(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const url = editingId === "new" ? "/api/admin/events" : `/api/admin/events/${editingId}`;
    const method = editingId === "new" ? "POST" : "PATCH";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.detail ? `${data.error} — ${data.detail}` : data.error ?? "Enregistrement impossible");
      setSaving(false);
      return;
    }
    setEditingId(null);
    setForm(emptyForm);
    setSaving(false);
    await load();
  };

  const togglePublished = async (event: EventRow) => {
    await fetch(`/api/admin/events/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !event.isPublished }),
    });
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cet événement ?")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    await load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-[#C59A4A]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && !editingId && (
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">{error}</p>
      )}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-[#E8D8B8]/50">
          <strong>Modifier</strong> pour changer titre, date, texte et photo. Décochez « En ligne » pour masquer.
        </p>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C59A4A] text-[#171310] text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Ajouter une soirée
        </button>
      </div>

      {editingId && (
        <form
          onSubmit={submit}
          className="bg-[#1a1614] border border-[#C59A4A]/30 rounded-2xl p-5 grid gap-3 md:grid-cols-2"
        >
          <p className="md:col-span-2 text-[#C59A4A] text-sm font-semibold">
            {editingId === "new" ? "Nouvelle soirée" : "Modifier les détails"}
          </p>
          <input
            className={`${inputClass} md:col-span-2`}
            placeholder="Titre de la soirée"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="date"
            className={inputClass}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <input
            className={inputClass}
            placeholder="Heure (ex. 20h00)"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            required
          />
          <input
            className={inputClass}
            placeholder="Artiste"
            value={form.artist}
            onChange={(e) => setForm({ ...form, artist: e.target.value })}
            required
          />
          <input
            className={inputClass}
            placeholder="Genre (Jazz, Afro-Soul…)"
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
            required
          />
          <textarea
            className={`${inputClass} md:col-span-2 min-h-20`}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <label className="flex items-center gap-2 text-sm text-[#E8D8B8]/70 md:col-span-2">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            />
            En ligne sur le site
          </label>
          <ImagePicker
            folder="events"
            entityId={assetId}
            value={form.image}
            onChange={(image) => setForm({ ...form, image })}
          />
          {error && <p className="md:col-span-2 text-sm text-red-400">{error}</p>}
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#C59A4A] text-[#171310] text-sm font-semibold disabled:opacity-60"
            >
              {saving ? "Enregistrement…" : "Enregistrer les détails"}
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-4 py-2 rounded-lg border border-[#4A2C20] text-sm"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {events.map((event) => (
          <div
            key={event.id}
            className={`flex flex-wrap items-center gap-3 bg-[#1a1614] border rounded-xl px-4 py-3 ${
              editingId === event.id ? "border-[#C59A4A]/50" : "border-[#4A2C20]/40"
            }`}
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#4A2C20] shrink-0">
              {event.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaSrc(event.image)} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#4A2C20]" />
              )}
            </div>
            <div className="flex-1 min-w-40">
              <p className="text-[#E8D8B8] font-medium">{event.title}</p>
              <p className="text-xs text-[#E8D8B8]/40">
                {event.date} · {event.time} · {event.artist}
              </p>
            </div>
            <label className="text-xs text-[#E8D8B8]/60 flex items-center gap-2">
              <input
                type="checkbox"
                checked={event.isPublished !== false}
                onChange={() => togglePublished(event)}
              />
              En ligne
            </label>
            <button
              type="button"
              onClick={() => startEdit(event)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C59A4A]/40 text-[#C59A4A] text-xs font-semibold hover:bg-[#C59A4A] hover:text-[#171310]"
            >
              <Pencil className="w-3.5 h-3.5" />
              Modifier
            </button>
            <button
              type="button"
              onClick={() => remove(event.id)}
              className="text-red-400/70 hover:text-red-400 p-2"
              aria-label="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
