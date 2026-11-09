"use client";

import React from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { ModalFooter } from "@/components/ui/ModalFooter";

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
  const footer = (
    <ModalFooter>
      <Button type="button" variant="secondary" onClick={onClose} disabled={disconnecting}>
        Cancel
      </Button>
      <Button type="button" variant="destructive" loading={disconnecting} onClick={onDisconnect}>
        Disconnect
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Disconnect Google account?"
      maxWidth="max-w-sm"
      footer={footer}
    >
      <p className="text-body text-muted-foreground">
        Disconnecting will pause automatic review syncing and AI auto-replies until you reconnect.
      </p>
    </Modal>
  );
}
