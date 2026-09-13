import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminNav from "@/components/admin/AdminNav";
import MenuAdmin from "@/components/admin/MenuAdmin";

export default async function AdminMenuPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <>
      <AdminNav name={session.name} role={session.role} />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#E8D8B8] mb-1">
            La carte
          </h1>
          <p className="text-[#E8D8B8]/40 text-sm">
            Noms, tarifs, descriptions et disponibilité des plats. Les changements sont visibles tout de suite sur le site.
          </p>
        </div>
        <MenuAdmin />
      </main>
    </>
  );
}
