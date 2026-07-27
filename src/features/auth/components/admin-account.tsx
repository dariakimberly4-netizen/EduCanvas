"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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

      <Dialog
        open={confirmationOpen}
        onOpenChange={(open) => {
          if (!isPending) setConfirmationOpen(open);
        }}
      >
        <DialogContent
          className="admin-dialog confirm-dialog !max-w-[440px] !gap-0 !rounded-[7px] !p-0"
          showCloseButton={false}
        >
          <div className="confirm-dialog-inner">
            <span className="warning-icon" aria-hidden="true">
              <LogOut size={18} />
            </span>
            <DialogTitle>Sign out of EduCanvas?</DialogTitle>
            <DialogDescription>
              You will need to sign in with Google again to manage the website.
            </DialogDescription>
            <div className="dialog-actions">
              <DialogClose asChild>
                <Button
                  className="button button-secondary"
                  disabled={isPending}
                  type="button"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="button button-danger"
                disabled={isPending}
                onClick={() => void signOut()}
                type="button"
              >
                {isPending ? "Signing out…" : "Sign out"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
