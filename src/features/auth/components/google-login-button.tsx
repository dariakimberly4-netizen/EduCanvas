"use client";

import { useState } from "react";

import { GoogleMark } from "@/features/auth/components/google-mark";
import { authClient } from "@/lib/auth-client";

interface GoogleLoginButtonProps {
  authOrigin?: string;
  unauthorized?: boolean;
}

export function GoogleLoginButton({
  authOrigin,
  unauthorized = false,
}: GoogleLoginButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setIsPending(true);
    setError(null);

    if (authOrigin && window.location.origin !== authOrigin) {
      const canonicalLoginURL = new URL("/admin/login", authOrigin);
      canonicalLoginURL.searchParams.set("error", "origin-mismatch");
      window.location.assign(canonicalLoginURL);
      return;
    }

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/admin",
        errorCallbackURL: "/admin/login?error=google",
      });

      if (result?.error) {
        setError("Google sign-in could not start. Check the authentication settings and try again.");
        setIsPending(false);
      }
    } catch {
      setError("Google sign-in could not start. Check your connection and try again.");
      setIsPending(false);
    }
  }

  return (
    <>
      {unauthorized ? (
        <p className="auth-error" role="alert">
          This Google account is not on the administrator allowlist.
        </p>
      ) : null}
      {error ? <p className="auth-error" role="alert">{error}</p> : null}
      <button className="google-login-button" disabled={isPending} onClick={signIn} type="button">
        <GoogleMark />
        <span>{isPending ? "Opening Google…" : "Continue with Google"}</span>
      </button>
    </>
  );
}
