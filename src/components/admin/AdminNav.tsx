"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

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

  const linkClass = (href: string) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      pathname === href
        ? "bg-[#C59A4A] text-[#171310]"
        : "text-[#E8D8B8]/70 hover:text-[#C59A4A]"
    }`;

  return (
    <nav className="border-b border-[#4A2C20]/50 bg-[#0F0D0A]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin" className={linkClass("/admin")}>
            Réservations
          </Link>
          {role === "ADMIN" && (
            <Link href="/admin/users" className={linkClass("/admin/users")}>
              Personnel
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#E8D8B8]/60">
            {name} · <span className="text-[#C59A4A]">{role === "ADMIN" ? "Admin" : "Staff"}</span>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-[#E8D8B8]/70 hover:text-[#C59A4A] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
