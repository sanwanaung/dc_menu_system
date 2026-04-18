"use client";

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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useNewAddonMutation } from "@/hooks/mutations/addon/use-new-addon";
import { AddonCategory } from "@/types/addon-category";
import { getAddon } from "@/actions/addon";
import { AddonDTO } from "@/types/addon";
import { useUpdateAddonMutation } from "@/hooks/mutations/addon/use-update-addon";

const NewAddonForm = () => {
  const { isOpen, onClose, mode, id } = useNewAddon();
  const newAddonMutation = useNewAddonMutation();
  const updateAddonMutation = useUpdateAddonMutation();
  const session = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [addonCategories, setAddonCategories] = useState<AddonCategory[]>([]);
  const [addon, setAddon] = useState<AddonDTO | null>(null);
  const form = useForm<FormInput>({
    resolver: zodResolver(addonFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      addonCategoryId: null,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset({
        name: "",
        price: 0,
        addonCategoryId: null,
      });
      setAddon(null);
    }
  }, [isOpen, form]);

  useEffect(() => {
    (async () => {
      if (!isOpen) return;
      if (mode === "edit" && !id) return;
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

  useEffect(() => {
    (async () => {
      if (!isOpen || mode !== "edit" || !id) return;
      setIsLoading(true);
      const res = mode === "edit" ? await getAddon(id) : "";
      setIsLoading(false);
      if (typeof res !== "string" && (res.error || !res.data)) {
        toast.error(res.error);
      }
      if (typeof res === "object" && res.data) {
        setAddon(res.data);
      }
    })();
  }, [isOpen, mode, id]);

  useEffect(() => {
    if (!isOpen || mode !== "edit" || !addon) return;
    form.reset({
      name: addon.name ?? "",
      price: addon.price ?? 0,
      addonCategoryId: "",
    });
  }, [addon, form, isOpen, mode]);

  const isFree = form.watch("price") === 0;

  const handleSumitAddon = async (data: FormInput) => {
    if (!data.addonCategoryId)
      return toast.error("Addon category is required!");
    if (session.data?.user.role !== "admin")
      return toast.error("You don't have permission!");
    if (mode === "edit") {
      if (!id) return;
      updateAddonMutation.mutate({ id, form: data });
      if (!updateAddonMutation.isPending) onClose();
      return;
    }
    newAddonMutation.mutate({ form: data });
    if (!newAddonMutation.isPending) {
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => !newAddonMutation.isPending && onClose()}
    >
      <DialogContent
        className="sm:max-w-lg"
        showCloseButton={!newAddonMutation.isPending}
        onEscapeKeyDown={(e) => {
          if (newAddonMutation.isPending) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (newAddonMutation.isPending) e.preventDefault();
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
          onSubmit={form.handleSubmit(handleSumitAddon)}
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
                    disabled={newAddonMutation.isPending || isLoading}
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
                    disabled={newAddonMutation.isPending || isLoading}
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
                      step={100}
                      disabled={
                        newAddonMutation.isPending || isFree || isLoading
                      }
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
                  disabled={newAddonMutation.isPending || isLoading}
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
              disabled={newAddonMutation.isPending || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={newAddonMutation.isPending || isLoading}
            >
              {newAddonMutation.isPending ? (
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
