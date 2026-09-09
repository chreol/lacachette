"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Échec de connexion");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erreur réseau, réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#4A2C20]/20 border border-[#4A2C20]/50 rounded-2xl p-8 space-y-6"
      >
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#C59A4A]">LA CACHETTE</h1>
          <p className="text-sm text-[#E8D8B8]/60 mt-1">Espace administration</p>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C59A4A]" />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#171310] border border-[#4A2C20] rounded-lg px-4 py-3 pl-11 text-[#E8D8B8] focus:border-[#C59A4A] focus:ring-1 focus:ring-[#C59A4A] outline-none"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C59A4A]" />
          <input
            type="password"
            required
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#171310] border border-[#4A2C20] rounded-lg px-4 py-3 pl-11 text-[#E8D8B8] focus:border-[#C59A4A] focus:ring-1 focus:ring-[#C59A4A] outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#C59A4A] text-[#171310] font-bold rounded-lg py-3 hover:bg-[#B86B32] transition-colors disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
