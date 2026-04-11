import { AdminLayout } from "@/components/admin/admin-layout";
import { RoomsPage } from "@/components/admin/rooms/room";
import { getRooms } from "@/actions/room";
import { QueryClient } from "@tanstack/react-query";

export default async function AdminRoomsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["room"],
    queryFn: ({ pageParam }) =>
      getRooms({ limit: 5, offset: Number(pageParam) }),
  });

  return (
    <AdminLayout>
      <RoomsPage />
    </AdminLayout>
  );
}
