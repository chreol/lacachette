import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminNav from "@/components/admin/AdminNav";
import StaffUsersAdmin from "@/components/admin/StaffUsersAdmin";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "ADMIN") redirect("/admin");

  return (
    <>
      <AdminNav name={session.name} role={session.role} />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#E8D8B8] mb-8">
          Personnel
        </h1>
        <StaffUsersAdmin />
      </main>
    </>
  );
}
