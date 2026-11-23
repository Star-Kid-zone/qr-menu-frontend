import type { ReactNode } from "react";

export interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    /** What will happen, in plain words. Say if it can't be undone. */
    description: ReactNode;
    /** Name the action and the object: "Delete dish", "Post now". */
    confirmLabel: string;
    cancelLabel?: string;
    loading?: boolean;
    /** Shown inline above the buttons when the action fails. */
    error?: string;
    /**
     * `destructive` (default) for deleting or removing; `default` for actions
     * that publish or send something, where red would be the wrong signal.
     */
    tone?: "destructive" | "default";
    /**
     * For the highest-risk actions: the person must type this exact text
     * (e.g. the restaurant name) before the confirm button unlocks.
     */
    typeToConfirm?: string;
    /** Optional detail block, e.g. a before/after preview or affected count. */
    children?: ReactNode;
    /** @deprecated The dialog no longer shows a decorative icon. */
    icon?: ReactNode;
    maxWidth?: string;
}
