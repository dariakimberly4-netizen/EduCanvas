"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { AdminUser } from "@/features/auth/domain/admin-user";
import { authClient } from "@/lib/auth-client";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AdminAccount({ user }: { user: AdminUser }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function signOut() {
    setIsPending(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess() {
          router.replace("/admin/login");
          router.refresh();
        },
        onError() {
          setIsPending(false);
        },
      },
    });
  }

  return (
    <div className="admin-account">
      <div className="admin-user" title={user.email}>
        <span aria-hidden="true">{getInitials(user.name)}</span>
        <p><strong>{user.name}</strong><small>{user.email}</small></p>
      </div>
      <button
        aria-label="Sign out"
        className="admin-signout"
        disabled={isPending}
        onClick={signOut}
        title="Sign out"
        type="button"
      >
        <LogOut aria-hidden="true" size={15} />
      </button>
    </div>
  );
}
