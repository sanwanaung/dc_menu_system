"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { MenuCategory } from "generated/prisma/client";
import { addonCategoryFormSchema } from "@/schemas/addon-category";
import { useNewAddonCategory } from "@/hooks/use-new-addon-category";
import { getAddonCategory } from "@/actions/addon-category";
import { useUpdateAddonCategoryMutation } from "@/hooks/mutations/addon-category/use-update-addoncategory";
import { useNewAddonCategoryMutation } from "@/hooks/mutations/addon-category/use-new-addoncategory";

type FormInput = z.input<typeof addonCategoryFormSchema>;

const defaultValues: FormInput = {
  name: "",
  displayOrder: 0,
  isAvailable: true,
};

export const NewAddonCategoryForm = () => {
  const { isOpen, onClose, mode, id } = useNewAddonCategory();
  const update = useUpdateAddonCategoryMutation();
  const create = useNewAddonCategoryMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [addonId, setAddonId] = useState<string>("");
  const [defaultACVs, setDefaultACVs] =
    useState<Pick<MenuCategory, "name" | "displayOrder" | "isAvailable">>();

  const form = useForm<FormInput>({
    resolver: zodResolver(addonCategoryFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) form.reset(defaultValues);
  }, [isOpen, form]);

  useEffect(() => {
    if (!isOpen || !id || mode === "create") return;
    (async () => {
      setIsLoading(true);
      const res = await getAddonCategory(id);
      if (res.error || !res.data) return toast.error(res.error);
      form.reset({
        name: res.data.name ?? "",
        displayOrder: res.data.displayOrder,
        isAvailable: res.data.isAvailable,
      });
      setAddonId(res.data.id);
      setIsLoading(false);
      setDefaultACVs({
        name: res.data.name,
        displayOrder: res.data.displayOrder,
        isAvailable: res.data.isAvailable,
      });
    })();
  }, [isOpen, id, form, mode]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open && !create.isPending) onClose();
    },
    [onClose, create.isPending],
  );

  const handleCreateAddonCategory = async (data: FormInput) => {
    create.mutate({ form: data });
    form.reset({
      name: "",
      isAvailable: false,
      displayOrder: 0,
    });
  };

  const handleEditAddonCategory = async (data: FormInput) => {
    if (!addonId) return;
    const isValid =
      (defaultACVs && defaultACVs.name !== data.name) ||
      defaultACVs?.displayOrder !== data.displayOrder ||
      defaultACVs?.isAvailable !== data.isAvailable;
    if (!isValid) return toast.error("Nothing hasn't changed yet!");
    update.mutate({ id: addonId, form: data });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        showCloseButton={!create.isPending}
        onEscapeKeyDown={(e) => {
          if (create.isPending) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (create.isPending) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create New AddonCategory"
              : "Edit AddonCategory"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "add new addoncategory"
              : "change addonCategory"}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={
            mode === "create"
              ? form.handleSubmit(handleCreateAddonCategory)
              : form.handleSubmit(handleEditAddonCategory)
          }
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="addon-category-name">Name *</FieldLabel>
                  <Input
                    {...field}
                    id="addon-category-name"
                    placeholder="eg. more spicy or less spicy"
                    autoComplete="off"
                    disabled={create.isPending}
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
              name="displayOrder"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="addon-category-order">
                    Display order
                  </FieldLabel>
                  <Input
                    {...field}
                    id="addon-category-order"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    disabled={create.isPending}
                    value={(field.value as number) ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Lower numbers appear first in the menu.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <Field orientation="horizontal">
                  <Checkbox
                    id="addon-category-available"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                    disabled={create.isPending}
                    aria-label="Available"
                  />
                  <div className="grid gap-0.5 leading-snug">
                    <FieldLabel htmlFor="addon-category-available">
                      Available
                    </FieldLabel>
                    <FieldDescription>
                      Hide/unhide this category for guests.
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
              onClick={() => onClose()}
              disabled={create.isPending || update.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={create.isPending || isLoading || update.isPending}
            >
              {create.isPending || update.isPending ? (
                <Loader2 className="animate-spin size-4" />
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
};
