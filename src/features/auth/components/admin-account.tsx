"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import type { AdminUser } from "@/features/auth/domain/admin-user";
import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/lib/format";

export function AdminAccount({ user }: { user: AdminUser }) {
  const router = useRouter();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function signOut() {
    setIsPending(true);
    await fetch("/api/admin/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "sign-out" }),
    }).catch(() => undefined);
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
    <>
      <div className="admin-account">
        <div className="admin-user" title={user.email}>
          <span className="admin-avatar">
            {user.image ? (
              <Image
                alt={`${user.name}'s profile photo`}
                height={38}
                referrerPolicy="no-referrer"
                src={user.image}
                unoptimized
                width={38}
              />
            ) : (
              <span aria-hidden="true">{getInitials(user.name)}</span>
            )}
          </span>
          <p><strong>{user.name}</strong><small>{user.email}</small></p>
        </div>
        <button
          aria-label="Sign out"
          className="admin-signout"
          disabled={isPending}
          onClick={() => setConfirmationOpen(true)}
          title="Sign out"
          type="button"
        >
          <LogOut aria-hidden="true" size={15} />
        </button>
      </div>

      <ConfirmationDialog
        open={confirmationOpen}
        onOpenChange={(open) => {
          if (!isPending) setConfirmationOpen(open);
        }}
        title="Sign out of EduCanvas?"
        description="You will need to sign in with Google again to manage the website."
        confirmLabel="Sign out"
        pendingLabel="Signing out…"
        isPending={isPending}
        icon={<LogOut size={18} />}
        onConfirm={signOut}
      />
    </>
  );
}
