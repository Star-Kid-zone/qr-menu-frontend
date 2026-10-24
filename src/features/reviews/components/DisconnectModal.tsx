"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PiWarningCircleBold } from "react-icons/pi";

interface DisconnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  disconnecting: boolean;
  onDisconnect: () => void;
}

export function DisconnectModal({
  isOpen,
  onClose,
  disconnecting,
  onDisconnect,
}: DisconnectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl animate-fade-in-up">
        <div className="flex items-center gap-3 text-red-500">
          <PiWarningCircleBold size={24} />
          <h3 className="text-sm font-bold text-foreground">Disconnect Google Account?</h3>
        </div>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Disconnecting will pause automatic review syncing and AI auto-replies until you
          reconnect.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={disconnecting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            loading={disconnecting}
            onClick={onDisconnect}
          >
            Confirm Disconnect
          </Button>
        </div>
      </div>
    </div>
  );
}
