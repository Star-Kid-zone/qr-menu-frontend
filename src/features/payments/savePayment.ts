import { workspaceService } from "@/services/workspace.service";
import type { PaymentFormPayload } from "./components/PaymentForm";

/**
 * Saves the bill payment method: uploads a new QR image if one was chosen,
 * then stores the link or image on the workspace. Shared by the inline editor
 * on the Bill payment page and the older add/edit routes.
 */
export async function savePaymentMethod(payload: PaymentFormPayload): Promise<void> {
  let qrImageUrl: string | null = payload.existingQrImage ?? null;
  if (payload.type === "image" && payload.file) {
    const formData = new FormData();
    formData.append("image", payload.file);
    const res = await workspaceService.uploadPaymentQr(formData);
    qrImageUrl = res.data.url;
  }

  await workspaceService.updateWorkspace({
    payment: {
      type: payload.type,
      link: payload.type === "url" ? payload.link : null,
      qrImage: payload.type === "image" ? qrImageUrl : null,
    },
  });
}
