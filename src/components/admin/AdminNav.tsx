"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Users, LogOut, ExternalLink } from "lucide-react";

interface AdminNavProps {
  name: string;
  role: "ADMIN" | "STAFF";
}

export default function AdminNav({ name, role }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { href: "/admin", label: "Réservations", icon: CalendarDays },
    ...(role === "ADMIN" ? [{ href: "/admin/users", label: "Personnel", icon: Users }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#4A2C20]/40 bg-[#0F0D0A]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C59A4A]/30">
            <Image src="/images/logo.webp" alt="La Cachette" width={32} height={32} className="object-cover" />
          </div>
          <div className="hidden sm:block">
            <p className="font-[family-name:var(--font-playfair)] text-[#C59A4A] text-sm tracking-widest leading-none">LA CACHETTE</p>
            <p className="text-[#E8D8B8]/30 text-[9px] uppercase tracking-widest leading-tight">Administration</p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 bg-[#1a1614] border border-[#4A2C20]/40 rounded-xl p-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#C59A4A] text-[#171310] shadow-sm"
                    : "text-[#E8D8B8]/60 hover:text-[#E8D8B8] hover:bg-[#4A2C20]/30"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info + actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="hidden md:flex items-center gap-1.5 text-xs text-[#E8D8B8]/40 hover:text-[#C59A4A] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Site
          </Link>
          <div className="hidden sm:flex items-center gap-2 bg-[#1a1614] border border-[#4A2C20]/40 rounded-xl px-3 py-2">
            <div className="w-6 h-6 rounded-full bg-[#C59A4A]/20 border border-[#C59A4A]/30 flex items-center justify-center">
              <span className="text-[#C59A4A] text-xs font-bold">{name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-xs font-medium text-[#E8D8B8] leading-none">{name}</p>
              <p className="text-[9px] text-[#C59A4A] uppercase tracking-wider leading-tight mt-0.5">
                {role === "ADMIN" ? "Admin" : "Staff"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-[#E8D8B8]/50 hover:text-red-400 transition-colors px-3 py-2 rounded-xl hover:bg-red-950/20 border border-transparent hover:border-red-900/30"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
}
