import { getMenuItemsForCustomers } from "@/actions/client/menu";
import ClientLayout from "@/components/client/client-layout";
import MenuTabs from "./menu-tabs";

export const dynamic = "force-dynamic";

const MenuItem = async ({
  searchParams,
}: {
  searchParams: Promise<{ room: string; roomQR: string; category?: string }>;
}) => {
  const params = await searchParams;
  if (!params.room || !params.roomQR) {
    return (
      <ClientLayout>
        <div className="rounded-lg border bg-background p-4 text-sm">
          <div className="font-medium">Invalid URL parameters</div>
          <div className="mt-1 text-muted-foreground">
            Expected <span className="font-mono">room</span> and{" "}
            <span className="font-mono">roomQR</span>.
          </div>
        </div>
      </ClientLayout>
    );
  }

  const menuItems = await getMenuItemsForCustomers({
    room: params.room,
    roomQR: params.roomQR,
    category: params.category || "all",
  });

  if (menuItems.error) {
    return (
      <ClientLayout>
        <div className="rounded-lg border bg-background p-4 text-sm">
          <div className="font-medium">Failed to load menu</div>
          <div className="mt-1 text-muted-foreground">{menuItems.error}</div>
        </div>
      </ClientLayout>
    );
  }

  console.log("Menu Items: ", menuItems.data);

  const requestedCategory =
    params.category?.trim().toLowerCase() === "all"
      ? "all"
      : (params.category?.trim() ?? "all");

  const availableCategoryNames = new Set(
    menuItems.data?.categories.map((c) => c.name),
  );
  const activeCategory =
    requestedCategory !== "all" &&
    !availableCategoryNames.has(requestedCategory)
      ? "all"
      : requestedCategory;

  return (
    <ClientLayout>
      <div className="w-full ">
        <MenuTabs
          categories={menuItems.data?.categories ?? []}
          activeCategory={activeCategory}
        />
      </div>
    </ClientLayout>
  );
};

export default MenuItem;
