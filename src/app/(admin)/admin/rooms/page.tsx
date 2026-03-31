import { AdminLayout } from "@/components/admin/admin-layout";
import { RoomsPage } from "@/components/admin/rooms/room";
import { getRooms } from "@/actions/room";

export default async function AdminRoomsPage() {
  const rooms = await getRooms();
  if (rooms.error) return <div>Filed to fetch datas!</div>;

  return (
    <AdminLayout>
      <RoomsPage initialRooms={rooms.data || []} />
    </AdminLayout>
  );
}
