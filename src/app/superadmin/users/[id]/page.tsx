import { UserDetailPage } from "@/features/superadmin/users";

export default async function SuperadminUserDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserDetailPage id={id} />;
}
