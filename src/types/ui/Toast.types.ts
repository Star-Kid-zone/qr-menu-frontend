export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: number;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration: number;
}
