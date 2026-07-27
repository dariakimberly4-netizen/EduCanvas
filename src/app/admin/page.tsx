import { redirect } from "next/navigation";

import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import {
  getAuthenticatedAdminUser,
  isAuthorizedAdmin,
} from "@/features/auth/server/admin-access";
import { generatePrivatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePrivatePageMetadata("Website management");

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
