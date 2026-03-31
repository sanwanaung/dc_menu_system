import RoomServicePage from "@/components/admin/room-service/room-service";
import { AdminLayout } from "@/components/admin/admin-layout";
import { getRoomServices } from "@/actions/room-service";

export default async function AdminOrdersPage() {
  const roomservices = await getRoomServices();
  if (roomservices.error) return <div>{roomservices.error}</div>;
  return (
    <AdminLayout>
      <RoomServicePage rs={roomservices.data || []} />
    </AdminLayout>
  );
}
