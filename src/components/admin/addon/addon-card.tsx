"use client";

import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { Addon, AddonCategory } from "./types";
import { formatMoney } from "./addon-utils";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tag } from "@/components/admin/shared/tag";
import { AddonWithAddonCategoryDTO } from "@/types/addon";

export function AddonCard({ addon }: { addon: AddonWithAddonCategoryDTO }) {
  const categoryName = addon.addonCategory?.name;
  const isFree = addon.price === 0;
  const updatedAt = new Date(addon.updatedAt);

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className={cn("w-full truncate text-wrap")}>
              {addon.name}
            </CardTitle>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Tag variant={isFree ? "success" : "info"}>
                {isFree ? "Free" : formatMoney(addon.price)}
              </Tag>
              <Tag className="max-w-[220px] truncate">{categoryName}</Tag>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon-sm">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-sm">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
              // onClick={() => onEdit(addon)}
              >
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                // onClick={() => onDelete(addon)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-xs text-muted-foreground">
          Updated {format(updatedAt, "dd MMM yyyy")}
        </div>
      </CardContent>
    </Card>
  );
}
