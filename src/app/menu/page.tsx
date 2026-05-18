import { getMenuItemsForCustomers } from "@/actions/client/menu";
import ClientLayout from "@/components/client/client-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MenuItem = async ({
  searchParams,
}: {
  searchParams: Promise<{ room: string; roomQR: string }>;
}) => {
  const params = await searchParams;
  console.log("Received params:", params);
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
  });

  return (
    <ClientLayout>
      <div className="w-full ">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="">
            <TabsTrigger value="all">All</TabsTrigger>
            {menuItems.data?.categories.map((item) => {
              return (
                <TabsTrigger key={item.id} value={item.name}>
                  {item.name}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              Something
            </div>
          </TabsContent>
          {menuItems.data?.categories.map((item) => {
            return (
              <TabsContent key={item.id} value={item.name}>
                {item.items.map((item) => {
                  return (
                    <div key={item.id}>
                      <div>{item.name}</div>
                      <div>{item.description}</div>
                    </div>
                  );
                })}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default MenuItem;
