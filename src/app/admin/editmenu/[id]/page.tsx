import { EditMenuPage } from "@/features/menu";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditMenuPage menuId={id} />;
}
