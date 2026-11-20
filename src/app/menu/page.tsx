import { getMenuItemsForCustomers } from "@/features/client/menu/actions";
import ClientLayout from "@/components/client/client-layout";
import ClientShell from "@/components/client/client-shell";
import { SCAN_SESSION_TOKEN } from "@/lib";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MenuTabs from "@/components/client/menu/menu-tabs";
import { BiError } from "react-icons/bi";

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
          <div className="mt-1 text-muted-foreground ">
            Expected <span className="font-mono">room</span> and{" "}
            <span className="font-mono">roomQR</span>.
          </div>
        </div>
      </ClientLayout>
    );
  }

  const sessionCookie = (await cookies()).get(SCAN_SESSION_TOKEN);

  if (!sessionCookie) {
    const bootstrapParams = new URLSearchParams({
      room: params.room,
      roomQR: params.roomQR,
    });

    if (params.category) {
      bootstrapParams.set("category", params.category);
    }

    const nextParams = new URLSearchParams({
      room: params.room,
      roomQR: params.roomQR,
    });

    if (params.category) {
      nextParams.set("category", params.category);
    }

    bootstrapParams.set("next", `/menu?${nextParams.toString()}`);

    redirect(`/api/scan-session?${bootstrapParams.toString()}`);
  }

  const menuItems = await getMenuItemsForCustomers({
    room: params.room,
    roomQR: params.roomQR,
    category: params.category || "all",
  });

  if (menuItems.error) {
    return (
      <ClientLayout>
        <div className="rounded-lg border bg-background text-red-500 p-4 text-sm">
          <div className="font-medium flex items-center">
            <BiError className="inline-block mr-2 size-4" />
            <span>Failed to load menu</span>
          </div>
          <div className="mt-3 text-muted-foreground">{menuItems.error}</div>
        </div>
      </ClientLayout>
    );
  }

  const requestedCategory =
    params.category?.trim().toLowerCase() === "all"
      ? "all"
      : (params.category?.trim() ?? "all");

  const availableCategoryNames = new Set(
    menuItems.data?.categories.map((c: any) => c.name),
  );
  const activeCategory =
    requestedCategory !== "all" &&
    !availableCategoryNames.has(requestedCategory)
      ? "all"
      : requestedCategory;

  return (
    <ClientShell roomQR={params.roomQR}>
      <ClientLayout>
        <div className="w-full overflow-hidden">
          <MenuTabs
            categories={menuItems.data?.categories ?? []}
            activeCategory={activeCategory}
          />
        </div>
      </ClientLayout>
    </ClientShell>
  );
};

export default MenuItem;
