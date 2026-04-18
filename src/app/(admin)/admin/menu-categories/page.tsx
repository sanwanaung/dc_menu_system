import { getMenuCategories } from "@/actions/menu-category";
import { AdminLayout } from "@/components/admin/admin-layout";
import MenuCategoriesPage from "@/components/admin/menu-category/menu-categories";
import { QueryClient } from "@tanstack/react-query";

export default async function AdminMenuCategoriesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["menu-category"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getMenuCategories({ limit: 6, offset: Number(pageParam) }),
  });

  return (
    <AdminLayout>
      <MenuCategoriesPage />
    </AdminLayout>
  );
}
