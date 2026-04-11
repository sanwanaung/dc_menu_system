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
    queryKey: ["addons"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getAddons({ limit: 2, offset: Number(pageParam) }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminLayout>
        <AddonPage />
      </AdminLayout>
    </HydrationBoundary>
  );
}
