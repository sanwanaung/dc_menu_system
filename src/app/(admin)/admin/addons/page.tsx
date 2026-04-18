import { AdminLayout } from "@/components/admin/admin-layout";
import AddonPage from "@/components/admin/addon/addons-page";
import { getAddons } from "@/actions/addon";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

export default async function AdminAddonsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["addon"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getAddons({ limit: 10, offset: Number(pageParam) }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminLayout>
        <AddonPage />
      </AdminLayout>
    </HydrationBoundary>
  );
}
