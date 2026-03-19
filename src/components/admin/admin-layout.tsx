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

export const AdminLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  const [clientPathname, setClientPathname] = useState("");

  useEffect(() => {
    setClientPathname(pathname.split("/")[2]);
  }, [pathname]);

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="capitalize">{clientPathname}</CardTitle>
          <CardDescription>Manage your {clientPathname}.</CardDescription>
          <CardAction>
            <Button type="button" size="sm">
              <Plus className="mr-1.5 size-4" />
              Add room
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </>
  );
};

{
  /* <div className="flex flex-col gap-3 md:flex-row md:items-center">
  <div className="relative md:flex-1">
    <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    <Input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search rooms by name, floor, type, or QR…"
      className="pl-9"
    />
  </div>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button type="button" variant="outline" size="sm">
        <SlidersHorizontal className="mr-1.5 size-4" />
        Filters
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-[280px]">
      <DropdownMenuLabel>Floor</DropdownMenuLabel>
      <DropdownMenuRadioGroup>
        {" "}
        value={floor} onValueChange={setFloor}
        <DropdownMenuRadioItem value="all">All floors</DropdownMenuRadioItem>
        {["1", "2", "3"].map((f) => (
          <DropdownMenuRadioItem key={f} value={f}>
            Floor {f}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>

      <DropdownMenuSeparator />

      <DropdownMenuLabel>Type</DropdownMenuLabel>
      <DropdownMenuRadioGroup>
        {" "}
        value={type} onValueChange={setType}
        <DropdownMenuRadioItem value="all">All types</DropdownMenuRadioItem>
        {types.map((t) => (
                    <DropdownMenuRadioItem key={t} value={t}>
                      {t}
                    </DropdownMenuRadioItem>
                  ))}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>

  {(floor !== "all" || type !== "all") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFloor("all");
                  setType("all");
                }}
              >
                Reset
              </Button>
            )}
</div>; */
}
