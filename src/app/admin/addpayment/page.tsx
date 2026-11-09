import { redirect } from "next/navigation";

// Moved (UX audit, Sprint 3). Kept so existing links and bookmarks still work.
export default function MovedRoute() {
  redirect("/admin/settings?tab=payment&edit=1");
}
