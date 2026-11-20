"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useNewRoom } from "@/hooks/stores/use-new-room";

export const AdminLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  const [clientPathname, setClientPathname] = useState("");
  const { onOpen } = useNewRoom();

  useEffect(() => {
    setClientPathname(pathname.split("/")[2]);
  }, [pathname]);

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="capitalize">{clientPathname}</CardTitle>
          <CardDescription>Manage your {clientPathname}.</CardDescription>
          {clientPathname === "rooms" && (
            <CardAction>
              <Button type="button" size="sm" onClick={onOpen}>
                <Plus className="mr-1.5 size-4" />
                Add room
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </>
  );
};
