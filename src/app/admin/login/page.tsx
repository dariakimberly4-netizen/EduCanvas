import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Brand } from "@/components/site/brand";
import { GoogleLoginButton } from "@/features/auth/components/google-login-button";
import {
  getAuthenticatedAdminUser,
  isAuthorizedAdmin,
} from "@/features/auth/server/admin-access";

export const metadata: Metadata = {
  title: "Staff login",
  description: "Sign in to the Shapla Grove website management workspace.",
};

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const [user, params] = await Promise.all([
    getAuthenticatedAdminUser(),
    searchParams,
  ]);

  if (user && isAuthorizedAdmin(user.email)) {
    redirect("/admin");
  }

  return (
    <main className="auth-page">
      <section className="auth-school-panel" aria-label="Shapla Grove School">
        <Brand light admin />
        <div className="auth-school-copy">
          <p className="auth-overline">Website management</p>
          <h1>A trusted space for the people who keep our school informed.</h1>
          <p>Publish notices, maintain faculty profiles, and keep families connected to Shapla Grove.</p>
        </div>
        <p className="auth-school-note">Staff access · Protected by Google</p>
      </section>

      <section className="auth-login-panel">
        <div className="auth-login-card">
          <Link className="auth-back-link" href="/">← Back to the school website</Link>
          <p className="overline">Administrator access</p>
          <h2>Sign in to continue</h2>
          <p className="auth-intro">Use the Google account approved for school administration.</p>
          <GoogleLoginButton unauthorized={params.error === "not-authorized"} />
          {params.error === "google" ? (
            <p className="auth-error" role="alert">
              Google could not complete sign-in. Try again or contact the site administrator.
            </p>
          ) : null}
          <div className="auth-security-note">
            <span aria-hidden="true">✓</span>
            <p><strong>No separate password to remember</strong><small>Authentication is handled securely by Google.</small></p>
          </div>
        </div>
      </section>
    </main>
  );
}
