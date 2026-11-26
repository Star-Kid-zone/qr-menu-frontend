export interface PromptDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (value: string) => void | Promise<void>;
    title: string;
    label?: string;
    placeholder?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    error?: string;
    /** Pre-filled value each time the dialog opens (defaults to empty). */
    initialValue?: string;
}
