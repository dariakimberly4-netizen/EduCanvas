import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";

import { recordAuthenticationActivity } from "@/features/school/server/activity-repository";

export const auth = betterAuth({
  appName: "EduCanvas",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
      strategy: "jwe",
      refreshCache: true,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (context) => {
      const session = context.context.newSession;

      if (!context.path?.startsWith("/callback/") || !session?.user) return;

      try {
        await recordAuthenticationActivity({
          action: "Administrator signed in",
          email: session.user.email,
          name: session.user.name,
        });
      } catch (error) {
        context.context.logger.error(
          "Sign-in activity could not be recorded",
          error,
        );
      }
    }),
  },
});
