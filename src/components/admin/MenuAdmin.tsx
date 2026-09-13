"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { MenuCategory, MenuItem } from "@/types/restaurant";
import ImagePicker from "@/components/admin/ImagePicker";

type Dish = MenuItem & { isAvailable?: boolean; sortOrder?: number };

const CATEGORIES: { key: MenuCategory; label: string }[] = [
  { key: "grillades", label: "Grillades" },
  { key: "specialites", label: "Spécialités" },
  { key: "cocktails", label: "Cocktails" },
  { key: "boissons", label: "Boissons" },
];

const emptyForm = {
  name: "",
  description: "",
  price: 2500,
  category: "grillades" as MenuCategory,
  badge: "",
  spices: "",
  isVegetarian: false,
  isAvailable: true,
  sortOrder: 0,
  image: "",
};

const inputClass =
  "w-full bg-[#171310] border border-[#4A2C20] rounded-lg px-3 py-2 text-sm text-[#E8D8B8] outline-none focus:border-[#C59A4A]";

export default function MenuAdmin() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [assetId, setAssetId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/menu");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.detail ? `${data.error} — ${data.detail}` : data.error ?? "Chargement impossible");
        setDishes([]);
      } else {
        setDishes(data.dishes ?? []);
        setError(null);
      }
    } catch {
      setError("Impossible de joindre le serveur");
      setDishes([]);
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

  const startEdit = (dish: Dish) => {
    setEditingId(dish.id);
    setAssetId(dish.id);
    setForm({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      badge: dish.badge ?? "",
      spices: dish.spices?.join(", ") ?? "",
      isVegetarian: !!dish.isVegetarian,
      isAvailable: dish.isAvailable !== false,
      sortOrder: dish.sortOrder ?? 0,
      image: dish.image ?? "",
    });
    setError(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const url = editingId === "new" ? "/api/admin/menu" : `/api/admin/menu/${editingId}`;
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

  const toggleAvailable = async (dish: Dish) => {
    await fetch(`/api/admin/menu/${dish.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !dish.isAvailable }),
    });
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce plat de la carte ?")) return;
    await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
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
          {dishes.length} plat{dishes.length > 1 ? "s" : ""} · <strong>Modifier</strong> pour le nom, le tarif, le texte et la photo.
        </p>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C59A4A] text-[#171310] text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Ajouter un plat
        </button>
      </div>

      {editingId && (
        <form
          onSubmit={submit}
          className="bg-[#1a1614] border border-[#C59A4A]/30 rounded-2xl p-5 grid gap-3 md:grid-cols-2"
        >
          <p className="md:col-span-2 text-[#C59A4A] text-sm font-semibold">
            {editingId === "new" ? "Nouveau plat" : "Modifier les détails"}
          </p>
          <input
            className={`${inputClass} md:col-span-2`}
            placeholder="Nom du plat"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            className={`${inputClass} md:col-span-2 min-h-20`}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <input
            type="number"
            className={inputClass}
            placeholder="Prix FCFA"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            min={0}
            required
          />
          <select
            className={inputClass}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as MenuCategory })}
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            className={inputClass}
            value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
          >
            <option value="">Sans badge</option>
            <option>Incontournable</option>
            <option>Chef</option>
            <option>Signature</option>
            <option>Nouveau</option>
          </select>
          <input
            className={inputClass}
            placeholder="Épices (séparées par des virgules)"
            value={form.spices}
            onChange={(e) => setForm({ ...form, spices: e.target.value })}
          />
          <input
            type="number"
            className={inputClass}
            placeholder="Ordre d'affichage"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            min={0}
          />
          <label className="flex items-center gap-2 text-sm text-[#E8D8B8]/70">
            <input
              type="checkbox"
              checked={form.isVegetarian}
              onChange={(e) => setForm({ ...form, isVegetarian: e.target.checked })}
            />
            Végétarien
          </label>
          <label className="flex items-center gap-2 text-sm text-[#E8D8B8]/70">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
            />
            Disponible à la carte
          </label>
          <ImagePicker
            folder="menu"
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
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className={`flex flex-wrap items-center gap-3 bg-[#1a1614] border rounded-xl px-4 py-3 ${
              editingId === dish.id ? "border-[#C59A4A]/50" : "border-[#4A2C20]/40"
            }`}
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#4A2C20] shrink-0">
              {dish.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={dish.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#4A2C20]" />
              )}
            </div>
            <div className="flex-1 min-w-40">
              <p className="text-[#E8D8B8] font-medium">{dish.name}</p>
              <p className="text-xs text-[#E8D8B8]/40">
                {CATEGORIES.find((c) => c.key === dish.category)?.label} · {dish.price} FCFA
              </p>
            </div>
            <label className="text-xs text-[#E8D8B8]/60 flex items-center gap-2">
              <input
                type="checkbox"
                checked={dish.isAvailable !== false}
                onChange={() => toggleAvailable(dish)}
              />
              Dispo
            </label>
            <button
              type="button"
              onClick={() => startEdit(dish)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C59A4A]/40 text-[#C59A4A] text-xs font-semibold hover:bg-[#C59A4A] hover:text-[#171310]"
            >
              <Pencil className="w-3.5 h-3.5" />
              Modifier
            </button>
            <button
              type="button"
              onClick={() => remove(dish.id)}
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
