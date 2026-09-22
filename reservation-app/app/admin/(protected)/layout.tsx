import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminRequest } from "@/lib/adminGuard";
import LogoutButton from "./LogoutButton";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminRequest())) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <nav className="flex items-center justify-between bg-white rounded-2xl shadow-sm px-4 py-3">
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/admin" className="text-brand-700 hover:underline">
            予約一覧
          </Link>
          <Link href="/admin/questionnaires" className="text-brand-700 hover:underline">
            問診票一覧
          </Link>
        </div>
        <LogoutButton />
      </nav>
      {children}
    </div>
  );
}
