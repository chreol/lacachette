import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminNav from "@/components/admin/AdminNav";
import MediaAdmin from "@/components/admin/MediaAdmin";

export default async function AdminMediaPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <>
      <AdminNav name={session.name} role={session.role} />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#E8D8B8] mb-2">
          Images du site
        </h1>
        <p className="text-[#E8D8B8]/50 text-sm mb-8 leading-relaxed">
          Choisis une photo : elle est enregistrée tout de suite (WebP/JPG/PNG, max 1,5 Mo)
          et remplace l’image correspondante sur le site, sans redéploiement.
        </p>
        <MediaAdmin />
      </main>
    </>
  );
}
