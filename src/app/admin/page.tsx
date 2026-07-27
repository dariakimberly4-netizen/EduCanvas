import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import {
  getAuthenticatedAdminUser,
  isAuthorizedAdmin,
} from "@/features/auth/server/admin-access";

export const metadata: Metadata = {
  title: "Website management",
  description: "Manage Shapla Grove School website content, faculty, notices, and results.",
};

export default async function AdminPage() {
  const user = await getAuthenticatedAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAuthorizedAdmin(user.email)) {
    redirect("/admin/login?error=not-authorized");
  }

  return <AdminDashboard user={user} />;
}
