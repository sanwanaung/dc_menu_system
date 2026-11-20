import { AdminLayout } from "@/components/admin/admin-layout";
import { RoomsPage } from "@/components/admin/rooms/room";
import { getRooms } from "@/features/room/actions";
import { QueryClient } from "@tanstack/react-query";

export default async function AdminRoomsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["room"],
    queryFn: ({ pageParam }) =>
      getRooms({ limit: 10, offset: Number(pageParam) }),
  });

  return (
    <AdminLayout>
      <RoomsPage />
    </AdminLayout>
  );
}
