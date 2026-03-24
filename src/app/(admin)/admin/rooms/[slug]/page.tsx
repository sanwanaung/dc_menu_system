import RoomQrPageView from "@/components/admin/rooms/room-qr-page";

export default async function RoomQrPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  return <RoomQrPageView roomId={slug} backHref="/admin/rooms" />;
}
