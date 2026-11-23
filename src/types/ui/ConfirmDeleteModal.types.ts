import { type ReactNode } from "react";

export interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    onSuccess?: () => void;
    title?: string;
    description: ReactNode;
    confirmLabel?: string;
    entityName?: string;
    /** Toast on success. Defaults to "<entityName> deleted". */
    successMessage?: string;
}
