"use client";

import { getMenuCategoriesForMenu } from "@/actions/menu-category";
import { DropzoneField } from "@/components/admin/form-dropzone";
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
import { Textarea } from "@/components/ui/textarea";
import { useMenuItem } from "@/hooks/use-menu-item";
import { FormInput, menuItemFormSchema } from "@/schemas/menu-item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { getAddonCategoriesForMenu } from "@/actions/addon-category";
import { getVariantOptionsForMenu } from "@/actions/variant-option";

type OptionType = {
  label: string;
  value: string;
};

const animatedComponents = makeAnimated();

const defaultValues: FormInput = {
  name: "",
  displayOrder: 0,
  price: 0,
  isAvailable: true,
  menuCategories: [],
  addonCategories: [],
  variantOptions: [],
  description: "",
  imageFile: undefined,
};

const NewMenuItemForm = () => {
  const { isOpen, onClose } = useMenuItem();
  const [menuCategories, setMenuCategories] = useState<OptionType[] | []>([]);
  const [addonCategories, setAddonCategories] = useState<OptionType[] | []>([]);
  const [variantOptions, setVariantOptions] = useState<OptionType[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<FormInput>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues,
    shouldUnregister: true,
  });

  const handleOpenChange = useCallback(() => {
    if (!isOpen) {
      form.reset(defaultValues);
    }
    onClose();
  }, [isOpen, onClose, form]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const [
        menuCategoriesResult,
        addonCategoriesResult,
        variantOptionsResult,
      ] = await Promise.all([
        getMenuCategoriesForMenu(),
        getAddonCategoriesForMenu(),
        getVariantOptionsForMenu(),
      ]);
      setIsLoading(false);
      if (menuCategoriesResult.error) {
        toast.error(menuCategoriesResult.error);
        setMenuCategories([]);
      } else {
        setMenuCategories(
          (menuCategoriesResult.data ?? []).map((item) => ({
            value: item.id,
            label: item.name,
          })),
        );
      }
      if (addonCategoriesResult.error) {
        toast.error(addonCategoriesResult.error);
        setAddonCategories([]);
      } else {
        setAddonCategories(
          (addonCategoriesResult.data ?? []).map((item) => ({
            value: item.id,
            label: item.name,
          })),
        );
      }
      if (variantOptionsResult.error) {
        toast.error(variantOptionsResult.error);
        setVariantOptions([]);
      } else {
        setVariantOptions(
          (variantOptionsResult.data ?? []).map((item) => ({
            value: item.id,
            label: item.name,
          })),
        );
      }
    })();
  }, [form]);

  const handleCreateMenuItem = (data: FormInput) => {
    console.log("data: ", data);
  };
  console.log("test");
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="w-[95vw] sm:max-w-3xl md:max-w-6xl max-h-[90vh] overflow-y-auto p-4"
        // showCloseButton={!create.isPending}
        onEscapeKeyDown={(e) => {
          //   if (create.isPending) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          //   if (create.isPending) e.preventDefault();
        }}
      >
        <div className="">
          <DialogHeader className="px-4 mb-6 mt-3">
            <DialogTitle>Create Menu Item</DialogTitle>
            <DialogDescription>
              Add a new item to your menu. Fill the details in below.
            </DialogDescription>
          </DialogHeader>

          <form
            className="w-full px-4"
            onSubmit={form.handleSubmit(handleCreateMenuItem)}
          >
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
                          autoFocus
                          disabled={isLoading}
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
                            step={1500}
                            placeholder="Price"
                            aria-invalid={fieldState.invalid}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            disabled={isLoading}
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
                            placeholder="Displayorder"
                            aria-invalid={fieldState.invalid}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            disabled={isLoading}
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
                        <Select
                          placeholder="Select MenuCategory"
                          components={animatedComponents}
                          isMulti={true}
                          value={field.value}
                          options={menuCategories}
                          onChange={field.onChange}
                          className="select-border"
                          isDisabled={isLoading}
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
                        <FieldLabel>Description *</FieldLabel>
                        <Textarea
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="Short description shown to guests."
                          disabled={isLoading}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
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
                          onCheckedChange={(checked) =>
                            field.onChange(!!checked)
                          }
                          disabled={isLoading}
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
                <div className="space-y-2">
                  <Controller
                    control={form.control}
                    name="addonCategories"
                    render={({ field, fieldState }) => (
                      <Field aria-invalid={fieldState.invalid}>
                        <FieldLabel>AddonCategories *</FieldLabel>
                        <Select
                          placeholder="Select AddonCategory"
                          components={animatedComponents}
                          isMulti={true}
                          value={field.value}
                          options={addonCategories}
                          onChange={field.onChange}
                          className="select-border"
                          isDisabled={isLoading}
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
                        <FieldLabel>Variant Options *</FieldLabel>
                        <Select
                          placeholder="Select VariantOption"
                          components={animatedComponents}
                          isMulti={true}
                          value={field.value}
                          options={variantOptions}
                          onChange={field.onChange}
                          className="select-border"
                          isDisabled={isLoading}
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
                        <FieldLabel>Upload image</FieldLabel>
                        <DropzoneField
                          value={field.value}
                          onChange={field.onChange}
                          error={fieldState.error}
                          disabled={isLoading}
                        />
                      </Field>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleOpenChange}
                >
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </FieldGroup>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMenuItemForm;
