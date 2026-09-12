"use client";

import { useEffect, useState, FormEvent } from "react";
import { UserPlus, Shield, User, Loader2 } from "lucide-react";

interface StaffUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF";
  createdAt: string;
}

export default function StaffUsersAdmin() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", name: "", password: "", role: "STAFF" as "ADMIN" | "STAFF" });

  const load = async () => {
    try {
      const res = await fetch("/api/auth/users");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data.users);
      setError(null);
    } catch {
      setError("Impossible de charger le personnel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { let ignore = false; (async () => { try { const res = await fetch("/api/auth/users"); if (!res.ok) throw new Error(); const data = await res.json(); if (!ignore) { setUsers(data.users); setError(null); } } catch { if (!ignore) setError("Impossible de charger le personnel."); } finally { if (!ignore) setLoading(false); } })(); return () => { ignore = true; }; }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Échec de la création");
        return;
      }
      setForm({ email: "", name: "", password: "", role: "STAFF" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await load();
    } catch {
      setError("Erreur réseau, réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-[#0F0D0A] border border-[#4A2C20]/60 rounded-xl px-4 py-2.5 text-sm text-[#E8D8B8] placeholder:text-[#E8D8B8]/25 outline-none focus:border-[#C59A4A]/60 transition-colors";

  return (
    <div className="space-y-8">
      {/* Form card */}
      <div className="bg-[#1a1614] border border-[#4A2C20]/40 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#4A2C20]/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#C59A4A]/10 border border-[#C59A4A]/20 flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-[#C59A4A]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#E8D8B8]">Ajouter un compte</h2>
            <p className="text-xs text-[#E8D8B8]/40">Créer un accès staff ou admin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-950/30 border border-red-800/50 text-red-400 text-sm rounded-xl px-4 py-3">⚠ {error}</div>
          )}
          {success && (
            <div className="bg-green-950/30 border border-green-800/50 text-green-400 text-sm rounded-xl px-4 py-3">✅ Compte créé avec succès</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" placeholder="Prénom & Nom" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            <input type="email" placeholder="Adresse email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
            <input type="password" placeholder="Mot de passe (8+ caractères)" required minLength={8}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "ADMIN" | "STAFF" })} className={inputClass}>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={submitting}
            className="flex items-center gap-2 bg-gradient-to-r from-[#C59A4A] to-[#B86B32] text-[#171310] font-bold rounded-xl px-6 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 text-sm">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {submitting ? "Création…" : "Créer le compte"}
          </button>
        </form>
      </div>

      {/* Users list */}
      <div className="bg-[#1a1614] border border-[#4A2C20]/40 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#4A2C20]/30">
          <h2 className="text-sm font-semibold text-[#E8D8B8]">Comptes existants</h2>
          <p className="text-xs text-[#E8D8B8]/40">{users.length} membre{users.length > 1 ? "s" : ""} au total</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-[#E8D8B8]/40">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Chargement…</span>
          </div>
        ) : (
          <div className="divide-y divide-[#4A2C20]/20">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#4A2C20]/10 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  u.role === "ADMIN"
                    ? "bg-[#C59A4A]/10 border-[#C59A4A]/30"
                    : "bg-[#4A2C20]/20 border-[#4A2C20]/40"
                }`}>
                  {u.role === "ADMIN"
                    ? <Shield className="w-4 h-4 text-[#C59A4A]" />
                    : <User className="w-4 h-4 text-[#E8D8B8]/50" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#E8D8B8] truncate">{u.name}</p>
                  <p className="text-xs text-[#E8D8B8]/40 truncate">{u.email}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border font-medium flex-shrink-0 ${
                  u.role === "ADMIN"
                    ? "bg-[#C59A4A]/10 text-[#C59A4A] border-[#C59A4A]/30"
                    : "bg-[#4A2C20]/20 text-[#E8D8B8]/50 border-[#4A2C20]/40"
                }`}>
                  {u.role === "ADMIN" ? "Admin" : "Staff"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
