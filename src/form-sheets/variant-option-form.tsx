import { Button } from "@/components/ui/button";
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
import { useVariantOption } from "@/hooks/use-variant-option";
import {
  VariantOptionFormSchema,
  variantOptionSchema,
} from "@/schemas/variant-option";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { allowedUserRole } from "@/lib";
import { toast } from "sonner";
import { useNewVariantOptionMutation } from "@/hooks/mutations/variant-option/use-new-variant-option";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getVariantOption } from "@/actions/variant-option";
import { VariantOptionDTO } from "@/types/variant-option";
import { useUpdateVariantOption } from "@/hooks/mutations/variant-option/use-update-variant-option";

const defaultValues: VariantOptionFormSchema = {
  name: "",
  displayOrder: 0,
  isAvailable: true,
  price: 0,
};

const VariantOptionForm = () => {
  const { isOpen, onClose, mode, id } = useVariantOption();
  const createMutation = useNewVariantOptionMutation();
  const updateMutation = useUpdateVariantOption();
  const session = authClient.useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentVariantOpt, setCurrentVariantOpt] =
    useState<VariantOptionDTO | null>(null);

  const form = useForm<VariantOptionFormSchema>({
    resolver: zodResolver(variantOptionSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset(defaultValues);
    }
  }, [form, isOpen]);

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open && !createMutation.isPending && !isLoading) onClose();
    },
    [onClose, createMutation.isPending, isLoading],
  );

  useEffect(() => {
    (async () => {
      if (!id || !isOpen || mode !== "edit") return;
      setIsLoading(true);
      const result = await getVariantOption({ id });
      setIsLoading(false);
      if (result.error) toast.error(result.error);
      setCurrentVariantOpt(result.data);
    })();
  }, [id, isOpen, mode]);

  useEffect(() => {
    (async () => {
      if (!isOpen || mode !== "edit" || !currentVariantOpt) return;
      form.reset({
        name: currentVariantOpt?.name ?? "",
        displayOrder: currentVariantOpt?.displayOrder ?? 0,
        price: currentVariantOpt?.price ?? 0,
        isAvailable: currentVariantOpt?.isAvailable ?? true,
      });
    })();
  }, [isOpen, mode, currentVariantOpt, form]);

  const handleSubmitVariantOption = (data: VariantOptionFormSchema) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    if (mode === "edit") {
      if (!id) return;
      updateMutation.mutate({ id, form: data });
      return;
    }
    createMutation.mutate({ form: data });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        showCloseButton={!createMutation.isPending}
        onEscapeKeyDown={(e) => {
          if (createMutation.isPending) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (createMutation.isPending) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create Variant Option"
              : "Edit Variant Option"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new menu variant option."
              : "Update variant details."}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmitVariantOption)}
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
                    id="name"
                    placeholder="Extra noodles"
                    autoComplete="off"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
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
              name="price"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Price *</FieldLabel>
                  <Input
                    {...field}
                    id="price"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={100}
                    aria-invalid={fieldState.invalid}
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    autoFocus
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                    {...field}
                    id="displayOrder"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    aria-invalid={fieldState.invalid}
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    autoFocus
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                  />
                  <div className="grid gap-0.5 leading-snug flex-1">
                    <FieldLabel htmlFor="addon-category-available">
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
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose()}
              disabled={
                createMutation.isPending ||
                isLoading ||
                updateMutation.isPending
              }
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createMutation.isPending ||
                isLoading ||
                updateMutation.isPending
              }
            >
              {createMutation.isPending ? (
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

export default VariantOptionForm;
