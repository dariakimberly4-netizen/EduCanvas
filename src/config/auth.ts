import "server-only";

const configuredBaseURL =
  process.env.SITE_URL?.trim() ||
  process.env.BETTER_AUTH_URL?.trim();

export const authOrigin = configuredBaseURL
  ? new URL(configuredBaseURL).origin
  : undefined;
export const authBaseURL = authOrigin;
export const authErrorURL = authOrigin
  ? new URL("/admin/login", authOrigin).toString()
  : "/admin/login";
