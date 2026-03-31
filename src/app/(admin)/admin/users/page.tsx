import { getUsers } from "@/actions/user";
import { AdminLayout } from "@/components/admin/admin-layout";
import UsersPage from "@/components/admin/user/users-page";
import { toast } from "sonner";

export default async function AdminUsersPage() {
  const users = await getUsers();
  if (users.error) return <div>{users.error}</div>;

  return (
    <AdminLayout>
      <UsersPage initialUsers={users.data || []} />
    </AdminLayout>
  );
}
