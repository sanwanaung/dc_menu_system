import { getMenuItems } from "@/actions/menu-item";
import { AdminLayout } from "@/components/admin/admin-layout";
import MenuItemPage from "@/components/admin/menu/menu-items";
import { QueryClient } from "@tanstack/react-query";

export default async function AdminMenuItemsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["menu-category"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getMenuItems({ limit: 6, offset: Number(pageParam) }),
  });

  return (
    <AdminLayout>
      <MenuItemPage />
    </AdminLayout>
  );
}
