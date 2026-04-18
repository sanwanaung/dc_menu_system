import { getMenuCategories } from "@/actions/menu-category";
import { AdminLayout } from "@/components/admin/admin-layout";
import VariantOption from "@/components/admin/variant-option/variant-option";
import { QueryClient } from "@tanstack/react-query";

export default async function VariantOptionPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["variant-option"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getMenuCategories({ limit: 9, offset: Number(pageParam) }),
  });

  return (
    <AdminLayout>
      <VariantOption />
    </AdminLayout>
  );
}
