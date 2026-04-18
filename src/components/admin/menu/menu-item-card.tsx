"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { MenuCategory, MenuItem } from "./types";
import { formatMoney, getCategoryName } from "./menu-utils";
import { Pill } from "./pill";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function Media({ item }: { item: MenuItem }) {
  const src = item.imageUrls?.[0];
  if (!src) {
    return (
      <div className="grid aspect-[16/10] w-full place-items-center rounded-md border bg-muted/30">
        <div className="text-center">
          <div className="text-sm font-medium text-foreground">No image</div>
          <div className="text-xs text-muted-foreground">
            Add one in Edit
          </div>
        </div>
      </div>
    );
  }
  return (
    // Using <img> keeps this demo page independent of next/image remotePatterns.
    // In production, consider switching to next/image and whitelisting image hosts.
    <img
      src={src}
      alt={item.name}
      className="aspect-[16/10] w-full rounded-md border object-cover"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}

export function MenuItemCard({
  item,
  categories,
  onEdit,
  onDelete,
  onToggleAvailability,
}: {
  item: MenuItem;
  categories: MenuCategory[];
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
}) {
  const categoryName = getCategoryName(categories, item.categoryId);
  const subtitle = item.description?.trim() ? item.description.trim() : null;

  return (
    <Card
      className={cn(
        "transition-shadow hover:shadow-sm",
        !item.isAvailable && "opacity-90",
      )}
    >
      <CardContent className="p-4 space-y-3">
        <Media item={item} />

        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="truncate text-sm font-semibold">{item.name}</div>
              <Pill className="text-muted-foreground">{categoryName}</Pill>
              {!item.isAvailable ? (
                <Pill className="border-destructive/30 bg-destructive/10 text-destructive">
                  Hidden
                </Pill>
              ) : null}
            </div>
            {subtitle ? (
              <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {subtitle}
              </div>
            ) : (
              <div className="mt-1 text-sm text-muted-foreground">
                No description
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold">{formatMoney(item.price)}</div>
          <div className="flex items-center gap-2">
            <Checkbox
              id={`available-${item.id}`}
              checked={item.isAvailable}
              onCheckedChange={() => onToggleAvailability()}
              aria-label="Toggle availability"
            />
            <label
              htmlFor={`available-${item.id}`}
              className="text-sm text-muted-foreground select-none"
            >
              Available
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
