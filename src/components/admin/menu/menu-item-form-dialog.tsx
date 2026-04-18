"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { MenuCategory, MenuItem, MenuItemUpsertInput } from "./types";
import {
  menuItemUpsertSchema,
  type MenuItemUpsertFormInput,
} from "./menu-item-schema";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaults: MenuItemUpsertFormInput = {
  name: "",
  description: "",
  price: 0,
  displayOrder: 0,
  categoryId: "",
  isAvailable: true,
  imageUrl: "",
};

function toInput(values: MenuItemUpsertFormInput): MenuItemUpsertInput {
  return {
    name: values.name.trim(),
    description: values.description?.trim() ? values.description.trim() : null,
    price: Number(values.price) || 0,
    displayOrder: Number(values.displayOrder) || 0,
    categoryId: values.categoryId,
    isAvailable: !!values.isAvailable,
    imageUrl: values.imageUrl?.trim() ? values.imageUrl.trim() : null,
  };
}

export function MenuItemFormDialog({
  open,
  mode,
  categories,
  initialItem,
  onOpenChange,
  onCreate,
  onUpdate,
}: {
  open: boolean;
  mode: "create" | "edit";
  categories: MenuCategory[];
  initialItem?: MenuItem | null;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: MenuItemUpsertInput) => void;
  onUpdate: (id: string, input: MenuItemUpsertInput) => void;
}) {
  const form = useForm<MenuItemUpsertFormInput>({
    resolver: zodResolver(menuItemUpsertSchema),
    defaultValues: defaults,
  });

  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      form.reset(defaults);
      setSubmitting(false);
      return;
    }
    if (mode === "edit" && initialItem) {
      form.reset({
        name: initialItem.name ?? "",
        description: initialItem.description ?? "",
        price: initialItem.price ?? 0,
        displayOrder: initialItem.displayOrder ?? 0,
        categoryId: initialItem.categoryId ?? "",
        isAvailable: initialItem.isAvailable ?? true,
        imageUrl: initialItem.imageUrls?.[0] ?? "",
      });
    } else if (mode === "create") {
      const first = categories.find((c) => c.isAvailable) ?? categories[0];
      form.reset({ ...defaults, categoryId: first?.id ?? "" });
    }
  }, [open, mode, initialItem, categories, form]);

  const title = mode === "create" ? "Create menu item" : "Edit menu item";
  const description =
    mode === "create"
      ? "Add a new item that guests can order via QR."
      : "Update item details and availability.";

  const handleSubmit = async (values: MenuItemUpsertFormInput) => {
    setSubmitting(true);
    try {
      const input = toInput(values);
      if (mode === "create") onCreate(input);
      else if (initialItem) onUpdate(initialItem.id, input);
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
      <DialogContent
        className="sm:max-w-lg"
        showCloseButton={!submitting}
        onEscapeKeyDown={(e) => {
          if (submitting) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (submitting) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="menu-item-name">Name *</FieldLabel>
                  <Input
                    {...field}
                    id="menu-item-name"
                    placeholder="Club Sandwich"
                    autoComplete="off"
                    disabled={submitting}
                    aria-invalid={fieldState.invalid}
                    autoFocus
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="menu-item-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="menu-item-description"
                    placeholder="Short description shown to guests…"
                    disabled={submitting}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Keep it short and helpful for guests.
                  </FieldDescription>
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <div className="grid gap-2 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="price"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="menu-item-price">Price *</FieldLabel>
                    <Input
                      {...field}
                      id="menu-item-price"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={0.01}
                      disabled={submitting}
                      value={(field.value as number) ?? 0}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="displayOrder"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="menu-item-order">
                      Display order
                    </FieldLabel>
                    <Input
                      {...field}
                      id="menu-item-order"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1}
                      disabled={submitting}
                      value={(field.value as number) ?? 0}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>Lower appears first.</FieldDescription>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category *</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={submitting}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .slice()
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                        .map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                            {!c.isAvailable ? " (Hidden)" : ""}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="imageUrl"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="menu-item-image">Image URL</FieldLabel>
                  <Input
                    {...field}
                    id="menu-item-image"
                    placeholder="https://..."
                    autoComplete="off"
                    disabled={submitting}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Optional. Use your uploaded image URL.
                  </FieldDescription>
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <Field orientation="horizontal">
                  <Checkbox
                    id="menu-item-available"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                    disabled={submitting}
                    aria-label="Available"
                  />
                  <div className="grid gap-0.5 leading-snug">
                    <FieldLabel htmlFor="menu-item-available">
                      Available
                    </FieldLabel>
                    <FieldDescription>
                      Hide/unhide this item for guests.
                    </FieldDescription>
                  </div>
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : mode === "create" ? (
                "Create"
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
