"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wand2 } from "lucide-react";

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
import { useNewMenuCategory } from "@/hooks/use-new-menucategory";
import { Checkbox } from "@/components/ui/checkbox";
import { menuCategoryFormSchema } from "@/schemas/menu-category";
import { useCallback, useEffect, useState } from "react";
import {
  createNewMenuCategory,
  getMenuCategory,
  updateMenuCategory,
} from "@/actions/menu-category";
import { toast } from "sonner";
import { MenuCategory } from "generated/prisma/client";

type FormInput = z.input<typeof menuCategoryFormSchema>;

const defaultValues: FormInput = {
  name: "",
  displayOrder: 0,
  isAvailable: true,
};

export const NewMenuCategory = () => {
  const { isOpen, onClose, mode, id } = useNewMenuCategory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMenuCId, setEditMenuCId] = useState<string>("");
  const [defaultMCVs, setDefaultMCVs] =
    useState<Pick<MenuCategory, "name" | "displayOrder" | "isAvailable">>();

  const form = useForm<FormInput>({
    resolver: zodResolver(menuCategoryFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) form.reset(defaultValues);
  }, [isOpen, form]);

  useEffect(() => {
    if (!isOpen || !id) return;
    (async () => {
      setIsLoading(true);
      const res = await getMenuCategory(id);
      if (res.error || !res.data) return toast.error(res.error);
      form.reset({
        name: res.data.name ?? "",
        displayOrder: res.data.displayOrder,
        isAvailable: res.data.isAvailable,
      });
      setEditMenuCId(res.data.id);
      setIsLoading(false);
      setDefaultMCVs({
        name: res.data.name,
        displayOrder: res.data.displayOrder,
        isAvailable: res.data.isAvailable,
      });
    })();
  }, [isOpen, id, form]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open && !isSubmitting) onClose();
    },
    [onClose, isSubmitting],
  );

  const handleCreateNewMenuCategory = async (data: FormInput) => {
    setIsSubmitting(true);
    const result = await createNewMenuCategory(data);
    setIsSubmitting(false);
    form.reset({
      name: "",
      isAvailable: false,
      displayOrder: 0,
    });
    if (result.error) return toast.error(result.error);
    toast.success(result.message);
  };

  const handleEidtMenuCategory = async (data: FormInput) => {
    if (!editMenuCId) return;
    const isValid =
      (defaultMCVs && defaultMCVs.name !== data.name) ||
      defaultMCVs?.displayOrder !== data.displayOrder ||
      defaultMCVs?.isAvailable !== data.isAvailable;
    if (!isValid) return toast.error("Nothing hasn't changed yet!");
    setIsEditing(true);
    const result = await updateMenuCategory(editMenuCId, data);
    setIsEditing(false);
    if (result.error) return toast.error(result.error);
    toast.success(result.message);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        showCloseButton={!isSubmitting}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create New MenuCategory"
              : "Edit MenuCategory"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" ? "add new menucategory" : "change menucategory"}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={
            mode === "create"
              ? form.handleSubmit(handleCreateNewMenuCategory)
              : form.handleSubmit(handleEidtMenuCategory)
          }
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="menu-category-name">Name *</FieldLabel>
                  <Input
                    {...field}
                    id="menu-category-name"
                    placeholder="Breakfast"
                    autoComplete="off"
                    disabled={isSubmitting}
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
                  <FieldLabel htmlFor="menu-category-order">
                    Display order
                  </FieldLabel>
                  <Input
                    {...field}
                    id="menu-category-order"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    disabled={isSubmitting}
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
                    id="menu-category-available"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                    disabled={isSubmitting}
                    aria-label="Available"
                  />
                  <div className="grid gap-0.5 leading-snug">
                    <FieldLabel htmlFor="menu-category-available">
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
              disabled={isSubmitting || isEditing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading || isEditing}
            >
              {isSubmitting || isEditing ? (
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
