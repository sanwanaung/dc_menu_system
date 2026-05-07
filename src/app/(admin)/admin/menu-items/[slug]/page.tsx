import { getAddonCategoriesForMenu } from "@/actions/addon-category";
import { getMenuCategoriesForMenu } from "@/actions/menu-category";
import { getMenuItemDetails } from "@/actions/menu-item";
import { getVariantOptionsForMenu } from "@/actions/variant-option";
import { AdminLayout } from "@/components/admin/admin-layout";
import MenuItemEditForm from "../../../../../form-sheets/menu-item-edit-form";

export default async function MenuItemDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ variantId?: string }>;
}) {
  const menuItemId = (await params).slug;
  const variantId = (await searchParams)?.variantId?.trim() || undefined;

  const [detailsRes, menuCategoriesRes, addonCategoriesRes, variantOptionsRes] =
    await Promise.all([
      getMenuItemDetails({ menuItemId, variantId }),
      getMenuCategoriesForMenu(),
      getAddonCategoriesForMenu(),
      getVariantOptionsForMenu(),
    ]);

  if (detailsRes.error || !detailsRes.data) {
    return (
      <AdminLayout>
        <div className="py-8 text-sm text-destructive">
          {detailsRes.error ?? "Failed to load menu-item details."}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <MenuItemEditForm
        menuItemId={menuItemId}
        initialMenuItem={detailsRes.data}
        menuCategories={menuCategoriesRes.data ?? []}
        addonCategories={addonCategoriesRes.data ?? []}
        variantOptions={variantOptionsRes.data ?? []}
      />
    </AdminLayout>
  );
}
