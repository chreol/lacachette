"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
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
        setError(data.error ?? "Identifiants incorrects");
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
    <div className="flex min-h-screen items-center justify-center px-6 relative overflow-hidden">
      {/* Background décor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#4A2C20_0%,_transparent_60%)] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/images/logo.webp')] bg-center bg-no-repeat opacity-[0.03] bg-[length:600px] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-[#1a1614]/95 border border-[#4A2C20]/60 rounded-3xl p-8 shadow-2xl shadow-black/60 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#C59A4A]/10 border border-[#C59A4A]/30 flex items-center justify-center">
                <Image src="/images/logo.webp" alt="La Cachette" width={44} height={44} className="rounded-full object-cover" />
              </div>
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#C59A4A] tracking-widest">
              LA CACHETTE
            </h1>
            <p className="text-[#E8D8B8]/40 text-xs uppercase tracking-[0.3em] mt-1">
              Espace Administration
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-800/50 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
              <span className="text-red-500">⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C59A4A]/60" />
              <input
                type="email"
                required
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0F0D0A] border border-[#4A2C20]/70 rounded-xl px-4 py-3.5 pl-11 text-[#E8D8B8] text-sm placeholder:text-[#E8D8B8]/25 focus:border-[#C59A4A] focus:ring-1 focus:ring-[#C59A4A]/30 outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C59A4A]/60" />
              <input
                type={showPw ? "text" : "password"}
                required
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0F0D0A] border border-[#4A2C20]/70 rounded-xl px-4 py-3.5 pl-11 pr-11 text-[#E8D8B8] text-sm placeholder:text-[#E8D8B8]/25 focus:border-[#C59A4A] focus:ring-1 focus:ring-[#C59A4A]/30 outline-none transition-all"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E8D8B8]/30 hover:text-[#C59A4A] transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-[#C59A4A] to-[#B86B32] text-[#171310] font-bold rounded-xl py-3.5 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-sm tracking-wide"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#171310]/30 border-t-[#171310] rounded-full animate-spin" />
                  Connexion en cours…
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-[#E8D8B8]/20 text-xs mt-6">
            Accès réservé au personnel autorisé
          </p>
        </div>
      </div>
    </div>
  );
}
