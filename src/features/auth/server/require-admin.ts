import {
  getAuthenticatedAdminUser,
  isAuthorizedAdmin,
} from "@/features/auth/server/admin-access";

export async function requireAdmin() {
  const user = await getAuthenticatedAdminUser();

  if (!user || !isAuthorizedAdmin(user.email)) {
    return null;
  }

  return user;
}
