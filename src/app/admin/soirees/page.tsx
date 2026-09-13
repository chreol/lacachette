import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminNav from "@/components/admin/AdminNav";
import EventsAdmin from "@/components/admin/EventsAdmin";

export default async function AdminEventsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <>
      <AdminNav name={session.name} role={session.role} />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#E8D8B8] mb-1">
            Soirées
          </h1>
          <p className="text-[#E8D8B8]/40 text-sm">
            Ajoutez ou modifiez les événements. Le bouton Pré-réserver envoie le visiteur vers le formulaire.
          </p>
        </div>
        <EventsAdmin />
      </main>
    </>
  );
}
