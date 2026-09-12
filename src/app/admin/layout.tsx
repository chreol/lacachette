import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration — La Cachette",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F0D0A] text-[#E8D8B8] font-[family-name:var(--font-jakarta)]">
      {children}
    </div>
  );
}
