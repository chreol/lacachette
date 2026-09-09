"use client";

import { useEffect, useState, FormEvent } from "react";
import { UserPlus } from "lucide-react";

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

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await fetch("/api/auth/users");
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!ignore) {
          setUsers(data.users);
          setError(null);
        }
      } catch {
        if (!ignore) setError("Impossible de charger le personnel.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
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
      await load();
    } catch {
      setError("Erreur réseau, réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-[#171310] border border-[#4A2C20] rounded-lg px-3 py-2 text-sm text-[#E8D8B8] outline-none focus:border-[#C59A4A]";

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="bg-[#4A2C20]/10 border border-[#4A2C20]/40 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[#C59A4A] flex items-center gap-2">
          <UserPlus className="w-5 h-5" /> Ajouter un compte
        </h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nom"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Mot de passe (8+ caractères)"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={inputClass}
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as "ADMIN" | "STAFF" })}
            className={inputClass}
          >
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#C59A4A] text-[#171310] font-bold rounded-lg px-6 py-2 hover:bg-[#B86B32] transition-colors disabled:opacity-50"
        >
          {submitting ? "Création..." : "Créer le compte"}
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold text-[#E8D8B8] mb-4">Comptes existants</h2>
        {loading ? (
          <p className="text-[#E8D8B8]/60">Chargement...</p>
        ) : (
          <div className="space-y-2">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between bg-[#4A2C20]/10 border border-[#4A2C20]/30 rounded-lg px-4 py-3"
              >
                <div>
                  <p className="text-[#E8D8B8] font-medium">{u.name}</p>
                  <p className="text-sm text-[#E8D8B8]/60">{u.email}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#C59A4A]/20 text-[#C59A4A] border border-[#C59A4A]/30">
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
