import { getMenuCategories } from "@/actions/menu-category";
import { AdminLayout } from "@/components/admin/admin-layout";
import MenuCategoriesPage from "@/components/admin/menu-category/menu-categories";

export default async function AdminMenuCategoriesPage() {
  const result = await getMenuCategories();
  if (result.error) return <div>{result.error}</div>;
  if (!result.data) return <div>No Data</div>;
  return (
    <AdminLayout>
      <MenuCategoriesPage menuCategories={result.data!} />
    </AdminLayout>
  );
}
