"use client";

import * as React from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNewRoom } from "@/hooks/stores/use-new-room";
import { createRoomSchema } from "@/features/room/schema";
import { toast } from "sonner";
import { floors } from "@/utils";
import { useNewRoomMutation } from "@/features/room/hooks/mutations/use-new-room";
import { authClient } from "@/lib/auth-client";
import { allowedUserRole } from "@/lib";
import { useCallback, useEffect } from "react";

type CreateRoomValues = z.infer<typeof createRoomSchema>;

const defaultValues: CreateRoomValues = {
  name: "",
  floor: "",
  type: "",
  roomQR: "",
};

function suggestRoomQr(name: string) {
  const cleaned = name.trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  return `QR-RN-${cleaned
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

export const NewRoomForm = () => {
  const { isOpen, onClose } = useNewRoom();
  const mutation = useNewRoomMutation();
  const session = authClient.useSession();

  const form = useForm<CreateRoomValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) form.reset(defaultValues);
  }, [isOpen, form]);

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open && !mutation.isPending) onClose();
    },
    [onClose, mutation.isPending],
  );

  const onSubmit = async (values: CreateRoomValues) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    mutation.mutate({ form: values });
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        showCloseButton={false}
        onEscapeKeyDown={(e) => {
          if (mutation.isPending) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (mutation.isPending) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Create room</DialogTitle>
          <DialogDescription>Add a new room record.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="room-name">Room name *</FieldLabel>
                  <Input
                    {...field}
                    id="room-name"
                    placeholder="Room 101"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    disabled={mutation.isPending}
                    autoFocus
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="floor"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Floor *</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger
                        id="form-rhf-select-language"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectSeparator />
                        {floors.map((item) => (
                          <SelectItem key={item.label} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="type"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Type *</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger
                        id="form-rhf-select-language"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="Superior">Superior</SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              control={form.control}
              name="roomQR"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between gap-2">
                    <FieldLabel htmlFor="room-qr">Room QR *</FieldLabel>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={mutation.isPending}
                      onClick={() => {
                        if (field.value.trim()) return;
                        const next = suggestRoomQr(form.getValues("name"));
                        if (next) {
                          form.setValue("roomQR", `${next}`, {
                            shouldValidate: true,
                          });
                        }
                      }}
                    >
                      <Wand2 className="mr-1.5 size-4" />
                      Suggest
                    </Button>
                  </div>
                  <Input
                    {...field}
                    id="room-qr"
                    placeholder="QR-RN-101"
                    aria-invalid={fieldState.invalid}
                    disabled={mutation.isPending}
                    autoComplete="off"
                    readOnly={true}
                  />
                  <FieldDescription>
                    Use a stable, unique code you’ll encode into the printed QR.
                  </FieldDescription>
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
              disabled={mutation.isPending}
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Create room"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
