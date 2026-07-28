import "server-only";

const configuredBaseURL = process.env.BETTER_AUTH_URL?.trim();

export const authBaseURL = configuredBaseURL || undefined;
export const authOrigin = authBaseURL
  ? new URL(authBaseURL).origin
  : undefined;
export const authErrorURL = authOrigin
  ? new URL("/admin/login", authOrigin).toString()
  : "/admin/login";
