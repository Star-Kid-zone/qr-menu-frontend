import type { ReactNode } from "react";

export interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: ReactNode;
    confirmLabel: string;
    cancelLabel?: string;
    loading?: boolean;
    error?: string;
    icon?: ReactNode;
    maxWidth?: string;
}
