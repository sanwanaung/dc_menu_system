import ClientLayout from "@/components/client/client-layout";
import RoomServiceInfos from "@/components/client/room-service/infos";
import RoomServiceCard from "@/components/client/room-service/room-service-card";

export default async function RoomServicePage({
  searchParams,
}: {
  searchParams: Promise<{ room: string; roomQR: string }>;
}) {
  const params = await searchParams;

  return (
    <ClientLayout>
      <RoomServiceInfos room={params.room ?? ""} roomQR={params.roomQR ?? ""} />
      <RoomServiceCard room={params.room ?? ""} roomQR={params.roomQR ?? ""} />
    </ClientLayout>
  );
}
