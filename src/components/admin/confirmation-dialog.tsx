"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
  cancelLabel?: string;
  icon?: ReactNode;
  isPending?: boolean;
  pendingLabel?: string;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  cancelLabel = "Cancel",
  icon = "!",
  isPending = false,
  pendingLabel,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="admin-dialog confirm-dialog !max-w-[440px] !gap-0 !rounded-[7px] !p-0"
        showCloseButton={false}
      >
        <div className="confirm-dialog-inner">
          <span className="warning-icon" aria-hidden="true">{icon}</span>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div className="dialog-actions">
            <DialogClose asChild>
              <Button
                className="button button-secondary"
                disabled={isPending}
                type="button"
              >
                {cancelLabel}
              </Button>
            </DialogClose>
            <Button
              className="button button-danger"
              disabled={isPending}
              onClick={() => void onConfirm()}
              type="button"
            >
              {isPending && pendingLabel ? pendingLabel : confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
