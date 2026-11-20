import { getUsers } from "@/features/user/actions";
import { AdminLayout } from "@/components/admin/admin-layout";
import UsersPage from "@/components/admin/user/users-page";
import { QueryClient } from "@tanstack/react-query";

export default async function AdminUsersPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: ({ pageParam }) =>
      getUsers({ limit: 10, offset: Number(pageParam) }),
  });

  return (
    <AdminLayout>
      <UsersPage />
    </AdminLayout>
  );
}
