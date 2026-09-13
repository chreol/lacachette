import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminNav from "@/components/admin/AdminNav";
import SiteAdmin from "@/components/admin/SiteAdmin";

export default async function AdminSitePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <>
      <AdminNav name={session.name} role={session.role} />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#E8D8B8] mb-1">
            Contenu du site
          </h1>
          <p className="text-[#E8D8B8]/40 text-sm">
            Textes d’accueil, contact, réseaux, horaires et Maps — sans passer par le code.
          </p>
        </div>
        <SiteAdmin />
      </main>
    </>
  );
}
