"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { AddonCategory } from "generated/prisma/client";
import { useMemo, useState } from "react";

export function AddonCategoryCombobox({
  categories,
  value,
  onValueChange,
  placeholder = "Select category…",
  disabled,
}: {
  categories: AddonCategory[];
  value?: string | null;
  onValueChange: (next: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => categories.find((c) => c.id === value) ?? null,
    [categories, value],
  );

  const available = useMemo(
    () =>
      [...categories]
        .filter((c) => c.isAvailable)
        .sort(
          (a, b) =>
            a.displayOrder - b.displayOrder || a.name.localeCompare(b.name),
        ),
    [categories],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between",
            !selected && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          {selected ? selected.name : placeholder}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search categories…" />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="__uncategorized__"
                data-checked={!value}
                onSelect={() => {
                  onValueChange(null);
                  setOpen(false);
                }}
              >
                Uncategorized
              </CommandItem>
              {available.map((c) => (
                <CommandItem
                  key={c.id}
                  value={c.name}
                  data-checked={c.id === value}
                  onSelect={() => {
                    onValueChange(c.id);
                    setOpen(false);
                  }}
                >
                  {c.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
