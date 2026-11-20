import { getAddonCategories } from "@/features/addon-category/actions";
import AddonCategoryPage from "@/components/admin/addon-category/addon-category";
import { AdminLayout } from "@/components/admin/admin-layout";
import { QueryClient } from "@tanstack/react-query";

export default async function AdminAddonCategoriesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["addon-category"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getAddonCategories({ limit: 9, offset: Number(pageParam) }),
  });

  return (
    <AdminLayout>
      <AddonCategoryPage />
    </AdminLayout>
  );
}
