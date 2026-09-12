import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminNav from "@/components/admin/AdminNav";
import ReservationsAdmin from "@/components/admin/ReservationsAdmin";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <>
      <AdminNav name={session.name} role={session.role} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#E8D8B8] mb-1">
            Réservations
          </h1>
          <p className="text-[#E8D8B8]/40 text-sm">
            Gérez les demandes de réservation en temps réel
          </p>
        </div>
        <ReservationsAdmin />
      </main>
    </>
  );
}
