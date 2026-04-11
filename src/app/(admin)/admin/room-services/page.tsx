import RoomServicePage from "@/components/admin/room-service/room-service";
import { AdminLayout } from "@/components/admin/admin-layout";
import { getRoomServices } from "@/actions/room-service";
import { QueryClient } from "@tanstack/react-query";

export default async function AdminOrdersPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["room-service"],
    queryFn: ({ pageParam }) =>
      getRoomServices({ limit: 5, offset: Number(pageParam) }),
  });
  return (
    <AdminLayout>
      <RoomServicePage />
    </AdminLayout>
  );
}
