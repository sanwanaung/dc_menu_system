import { AdminLayout } from "@/components/admin/admin-layout";
import { demoRooms } from "../../../../../demo";
import { RoomsPage } from "@/components/admin/rooms/rooms-page-client";

export default function AdminRoomsPage() {
  return (
    <AdminLayout>
      <RoomsPage initialRooms={demoRooms} />
    </AdminLayout>
  );
}
