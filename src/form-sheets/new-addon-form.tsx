"use client";

import * as z from "zod";
import {
  getAvailableAddonCategories,
  getAvailableAddonCategoriesById,
} from "@/actions/addon-category";
import { AddonCategoryCombobox } from "@/components/admin/addon/addon-category-combobox";
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
import { useNewAddon } from "@/hooks/use-new-addon";
import { addonFormSchema, FormInput } from "@/schemas/addon";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddonCategory } from "generated/prisma/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { createNewAddon } from "@/actions/addon";

const NewAddonForm = () => {
  const { isOpen, onClose, mode, id } = useNewAddon();
  const session = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addonCategories, setAddonCategories] = useState<AddonCategory[]>([]);
  const form = useForm<FormInput>({
    resolver: zodResolver(addonFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      addonCategoryId: null,
    },
  });

  useEffect(() => {
    if (!isOpen)
      form.reset({
        name: "",
        price: 0,
        addonCategoryId: null,
      });
  }, [isOpen, form]);

  useEffect(() => {
    (async () => {
      if (!isOpen) return;
      setIsLoading(true);
      const res =
        mode === "create"
          ? await getAvailableAddonCategories()
          : await getAvailableAddonCategoriesById(id!);
      setIsLoading(false);
      if (res.error || !res.data) return toast.error(res.error);
      setAddonCategories(res.data);
    })();
  }, [isOpen, mode, id]);

  const isFree = form.watch("price") === 0;

  const handleCreateNewAddon = async (data: FormInput) => {
    if (!data.addonCategoryId)
      return toast.error("Addon category is required!");
    if (session.data?.user.role !== "admin")
      return toast.error("You don't have permission!");
    setSubmitting(true);
    const res = await createNewAddon(data);
    setSubmitting(false);
    if (res.error || !res.data) return toast.error(res.error);
    toast.success(res.message ?? "Addon created successfully!");
    onClose();
    console.log("data: ", res.data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(next) => !submitting && onClose()}>
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

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(handleCreateNewAddon)}
        >
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
                    disabled={submitting || isLoading}
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
                    categories={addonCategories}
                    value={field.value ?? null}
                    onValueChange={field.onChange}
                    disabled={submitting || isLoading}
                  />
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
                      step={1}
                      disabled={submitting || isFree || isLoading}
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
                  disabled={submitting || isLoading}
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
              onClick={() => onClose()}
              disabled={submitting || isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || isLoading}>
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
};

export default NewAddonForm;
