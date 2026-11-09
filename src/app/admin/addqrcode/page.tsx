import { redirect } from "next/navigation";

// Moved to the QR menu page. Kept so existing links and bookmarks still work.
export default function MovedRoute() {
  redirect("/admin/qr-menu");
}
