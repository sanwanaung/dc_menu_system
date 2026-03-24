import { AdminLayout } from "@/components/admin/admin-layout";
import { RoomsPage } from "@/components/admin/rooms/room";
import { getRooms } from "@/actions/room";
import { toast } from "sonner";

export default async function AdminRoomsPage() {
  const rooms = await getRooms();
  if (rooms.error) return toast.error(rooms.error);

  return (
    <AdminLayout>
      <RoomsPage initialRooms={rooms.data || []} />
    </AdminLayout>
  );
}
