"use client";

import { DropzoneField } from "@/components/admin/form-dropzone";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateMenuItemMutation } from "@/features/menu-item/hooks/mutations/use-update-menu-item";
import { FormInput, menuItemFormSchema } from "@/features/menu-item/schema";
import { SerializeMenuItemDetails } from "@/features/menu-item/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";

type OptionType = {
  label: string;
  value: string;
};

const animatedComponents = makeAnimated();

const menuItemTypes = [
  {
    label: "BASE",
    value: "BASE_IMAGE",
  },
  {
    label: "VARIANT",
    value: "VARIANT_IMAGE",
  },
] as const;

export default function MenuItemEditForm({
  menuItemId,
  initialMenuItem,
  menuCategories,
  addonCategories,
  variantOptions,
}: {
  menuItemId: string;
  initialMenuItem: SerializeMenuItemDetails;
  menuCategories: { id: string; name: string }[];
  addonCategories: { id: string; name: string }[];
  variantOptions: { id: string; name: string }[];
}) {
  const router = useRouter();
  const mutation = useUpdateMenuItemMutation();

  const menuCategoryOptions = useMemo<OptionType[]>(
    () => menuCategories.map((c) => ({ value: c.id, label: c.name })),
    [menuCategories],
  );
  const addonCategoryOptions = useMemo<OptionType[]>(
    () => addonCategories.map((a) => ({ value: a.id, label: a.name })),
    [addonCategories],
  );
  const variantOptionOptions = useMemo<OptionType[]>(
    () => variantOptions.map((v) => ({ value: v.id, label: v.name })),
    [variantOptions],
  );

  const defaultValues = useMemo<FormInput>(() => {
    return {
      name: initialMenuItem.name ?? "",
      displayOrder: initialMenuItem.displayOrder ?? 0,
      price: initialMenuItem.price ?? 0,
      isAvailable: initialMenuItem.isAvailable ?? true,
      menuCategories: (initialMenuItem.menuCategoryMenuItems ?? []).map(
        (item) => ({
          value: item.menuCategory.id,
          label: item.menuCategory.name,
        }),
      ),
      addonCategories: (initialMenuItem.menuItemAddonCategories ?? []).map(
        (item) => ({
          value: item.addonCategory.id,
          label: item.addonCategory.name,
        }),
      ),
      variantOptions: (initialMenuItem.menuItemVariantOptions ?? []).map(
        (item) => ({
          value: item.variantOption.id,
          label: item.variantOption.name,
        }),
      ),
      description: initialMenuItem.description ?? "",
      imageFile: undefined,
      imageType: initialMenuItem.imageType,
    };
  }, [initialMenuItem]);

  const form = useForm<FormInput>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues,
    shouldUnregister: true,
  });

  const imageType = useWatch({ control: form.control, name: "imageType" });
  const currentImageUrl = useMemo(() => {
    if (imageType === "BASE_IMAGE") return initialMenuItem.baseImage ?? null;

    const selected =
      initialMenuItem.selectedVariant ??
      initialMenuItem.menuItemVariantOptions[0];
    return selected?.variantImage?.[0]?.url ?? null;
  }, [imageType, initialMenuItem]);

  const currentVariantLabel =
    initialMenuItem.selectedVariant?.variantOption?.name ??
    initialMenuItem.menuItemVariantOptions[0]?.variantOption?.name ??
    null;

  const handleUpdate = (data: FormInput) => {
    mutation.mutate(
      { menuItemId, form: data },
      {
        onSuccess: (res) => {
          if (res.error) return;
          form.reset({ ...data, imageFile: undefined });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Edit Menu Item</div>
          <div className="text-sm text-muted-foreground">
            Update fields and save your changes.
          </div>
        </div>
        <div>
          <Button variant="link" onClick={() => router.back()}>
            Back to menu-items
          </Button>
        </div>
      </div>

      <form className="w-full" onSubmit={form.handleSubmit(handleUpdate)}>
        <FieldGroup className="w-full">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Name *</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      placeholder="Fried Noodles..."
                      disabled={mutation.isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="flex items-center gap-x-2">
                <Controller
                  control={form.control}
                  name="price"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Price *</FieldLabel>
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        placeholder="Price"
                        aria-invalid={fieldState.invalid}
                        value={(field.value as unknown as number) ?? 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={mutation.isPending}
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
                    <Field>
                      <FieldLabel>Display Order *</FieldLabel>
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={1}
                        placeholder="Display order"
                        aria-invalid={fieldState.invalid}
                        value={(field.value as unknown as number) ?? 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={mutation.isPending}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                control={form.control}
                name="menuCategories"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel>MenuCategories *</FieldLabel>
                    <ReactSelect
                      placeholder="Select MenuCategory"
                      components={animatedComponents}
                      isMulti={true}
                      value={field.value}
                      options={menuCategoryOptions}
                      onChange={field.onChange}
                      className="select-border"
                      isDisabled={mutation.isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Short description shown to guests."
                      disabled={mutation.isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="imageType"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Select Type</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectSeparator />
                        {menuItemTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="isAvailable"
                render={({ field, fieldState }) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      id="isAvailable"
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                      disabled={mutation.isPending}
                    />
                    <div className="grid gap-0.5 leading-snug flex-1">
                      <FieldLabel htmlFor="menuitem-available">
                        Available
                      </FieldLabel>
                      <FieldDescription>
                        Hide/unhide this option for guests.
                      </FieldDescription>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="space-y-3">
              {currentImageUrl ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Current Image{" "}
                    {imageType === "VARIANT_IMAGE" && currentVariantLabel
                      ? `(Variant: ${currentVariantLabel})`
                      : null}
                  </div>
                  <div className="relative overflow-hidden rounded-lg border bg-muted">
                    <Image
                      src={currentImageUrl}
                      alt="menu item image"
                      width={1200}
                      height={800}
                      className="h-44 w-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No image uploaded yet.
                </div>
              )}

              <Controller
                control={form.control}
                name="addonCategories"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel>AddonCategories *</FieldLabel>
                    <ReactSelect
                      placeholder="Select AddonCategory"
                      components={animatedComponents}
                      isMulti={true}
                      value={field.value}
                      options={addonCategoryOptions}
                      onChange={field.onChange}
                      className="select-border"
                      isDisabled={mutation.isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="variantOptions"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel>Variant Options</FieldLabel>
                    <ReactSelect
                      placeholder="Select VariantOption"
                      components={animatedComponents}
                      isMulti={true}
                      value={field.value}
                      options={variantOptionOptions}
                      onChange={field.onChange}
                      className="select-border"
                      isDisabled={
                        mutation.isPending || imageType === "BASE_IMAGE"
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="imageFile"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Upload new image</FieldLabel>
                    <DropzoneField
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error}
                      disabled={mutation.isPending}
                    />
                  </Field>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
