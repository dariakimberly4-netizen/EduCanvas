import { cookies, headers } from "next/headers";

import type { AdminUser } from "@/features/auth/domain/admin-user";
import { auth } from "@/lib/auth";

const E2E_SESSION_COOKIE = "e2e-admin-session";

function configuredAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAuthorizedAdmin(email: string) {
  const e2eBypassToken = process.env.E2E_AUTH_BYPASS_TOKEN;
  if (
    email === "admin@shaplagrove.test" &&
    typeof e2eBypassToken === "string" &&
    e2eBypassToken.length >= 32
  ) {
    return true;
  }

  const allowlist = configuredAdminEmails();
  return allowlist.size === 0 || allowlist.has(email.toLowerCase());
}

export async function getAuthenticatedAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const e2eBypassToken = process.env.E2E_AUTH_BYPASS_TOKEN;
  const isE2EFixture =
    typeof e2eBypassToken === "string" &&
    e2eBypassToken.length >= 32 &&
    cookieStore.get(E2E_SESSION_COOKIE)?.value === e2eBypassToken;

  if (isE2EFixture) {
    return {
      name: "Playwright Admin",
      email: "admin@shaplagrove.test",
      image: "/assets/school-campus-hero.png",
    };
  }

  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}
