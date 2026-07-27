import { redirect } from "next/navigation";

import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import {
  getAuthenticatedAdminUser,
  isAuthorizedAdmin,
} from "@/features/auth/server/admin-access";
import { SchoolContentProvider } from "@/features/school/lib/content-store";
import { getSchoolContent } from "@/features/school/server/site-content-repository";
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

  const content = await getSchoolContent();

  return (
    <SchoolContentProvider initialContent={content}>
      <AdminDashboard user={user} />
    </SchoolContentProvider>
  );
}
