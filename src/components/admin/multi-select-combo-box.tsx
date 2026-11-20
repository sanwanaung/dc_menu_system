"use client";

import * as React from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

import { MenuCategoryDTO } from "@/features/menu-category/types";

type Option = Pick<MenuCategoryDTO, "id" | "name">;

export function RHFMultiSelectCombobox<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select…",
  disabled,
}: {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const anchor = useComboboxAnchor();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedIds: string[] = field.value ?? [];

        const selectedItems = options.filter((opt) =>
          selectedIds.includes(opt.id),
        );

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>{label}</FieldLabel>

            <Combobox
              multiple
              autoHighlight
              items={options}
              value={selectedItems}
              onValueChange={(items: Option[]) => {
                const ids = items.map((i) => i.id);
                console.log("selected ids:", ids);
                field.onChange(ids);
              }}
              itemToStringLabel={(item) => item.name}
              itemToStringValue={(item) => item.id}
              disabled={disabled}
            >
              <ComboboxChips ref={anchor} className="w-full">
                <ComboboxValue>
                  {() => (
                    <>
                      {selectedItems.map((item) => (
                        <ComboboxChip key={item.id}>{item.name}</ComboboxChip>
                      ))}
                      <ComboboxChipsInput placeholder={placeholder} />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>

              <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item: Option) => (
                    <ComboboxItem key={item.id} value={item}>
                      {item.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
