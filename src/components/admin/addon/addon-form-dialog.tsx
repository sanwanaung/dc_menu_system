"use client";

import * as React from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { AddonCategoryCombobox } from "./addon-category-combobox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AddonDTO } from "@/types/addon";
import { AddonCategoryDTO } from "@/types/addon-category";

const addonFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(60, "Name is too long."),
  price: z.coerce.number().min(0, "Price must be 0 or greater.").default(0),
  addonCategoryId: z.string().nullable().optional(),
});

type FormInput = z.input<typeof addonFormSchema>;

function toDefaultValues(addon?: AddonDTO | null): FormInput {
  return {
    name: addon?.name ?? "",
    price: addon?.price ?? 0,
    addonCategoryId: addon?.addonCategoryId ?? null,
  };
}

export function AddonFormDialog({
  open,
  mode,
  addon,
  categories,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  addon?: AddonDTO | null;
  categories: AddonCategoryDTO[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    name: string;
    price: number;
    addonCategoryId: string | null;
  }) => Promise<void> | void;
}) {
  const [submitting, setSubmitting] = React.useState(false);
  const form = useForm<FormInput>({
    resolver: zodResolver(addonFormSchema),
    defaultValues: toDefaultValues(addon),
  });

  React.useEffect(() => {
    if (!open) form.reset(toDefaultValues(null));
  }, [open, form]);

  React.useEffect(() => {
    if (!open) return;
    form.reset(toDefaultValues(addon ?? null));
  }, [open, addon, form]);

  const isFree = form.watch("price") === 0;

  const handleSubmit = async (values: FormInput) => {
    setSubmitting(true);
    try {
      await onSubmit({
        name: values.name,
        price: Number.isFinite(values.price)
          ? (values.price as unknown as number)
          : 0,
        addonCategoryId: values.addonCategoryId ?? null,
      });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !submitting && onOpenChange(next)}
    >
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
          <DialogTitle>
            {mode === "create" ? "Create Addon" : "Edit Addon"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new addon that can be attached to menu items."
              : "Update addon details."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="addon-name">Name *</FieldLabel>
                  <Input
                    {...field}
                    id="addon-name"
                    placeholder="Extra noodles"
                    autoComplete="off"
                    disabled={submitting}
                    aria-invalid={fieldState.invalid}
                    autoFocus
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="addonCategoryId"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Addon category</FieldLabel>
                  <AddonCategoryCombobox
                    categories={categories}
                    value={field.value ?? null}
                    onValueChange={field.onChange}
                    disabled={submitting}
                  />
                  <FieldDescription>
                    Optional, but recommended for better organization.
                  </FieldDescription>
                </Field>
              )}
            />

            <div className="grid gap-2 sm:grid-cols-3 sm:items-end">
              <Controller
                control={form.control}
                name="price"
                render={({ field, fieldState }) => (
                  <Field
                    className="sm:col-span-2"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="addon-price">Price</FieldLabel>
                    <Input
                      {...field}
                      id="addon-price"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={0.01}
                      disabled={submitting || isFree}
                      value={(field.value as number) ?? 0}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      Set to 0 for free addons.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field orientation="horizontal" className="sm:col-span-1">
                <Checkbox
                  id="addon-free"
                  checked={isFree}
                  onCheckedChange={(checked) => {
                    const nextFree = !!checked;
                    form.setValue("price", nextFree ? 0 : 1);
                  }}
                  disabled={submitting}
                />
                <div className="grid gap-0.5 leading-snug">
                  <FieldLabel htmlFor="addon-free">Free</FieldLabel>
                  <FieldDescription>Disables price input.</FieldDescription>
                </div>
              </Field>
            </div>
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
