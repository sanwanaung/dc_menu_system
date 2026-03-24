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
import { editRoomSchema } from "@/schemas/rooms";
import { useEditRoom } from "@/hooks/use-edit-room";
import { getRoom, updateRoom } from "@/actions/room";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { floors } from "@/utils";

type EditRoomValues = z.infer<typeof editRoomSchema>;

function suggestRoomQr(name: string) {
  const cleaned = name.trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  return `QR-RN-${cleaned
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

export const EditRoomForm = () => {
  const { isOpen, onClose, id } = useEditRoom();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: EditRoomValues = {
    name: "",
    floor: "",
    type: "",
    roomQR: "",
  };

  const form = useForm<EditRoomValues>({
    resolver: zodResolver(editRoomSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen || !id) return;
    (async () => {
      setIsLoading(true);
      const res = await getRoom({ id });
      if (res.error || !res.data) return toast.error(res.error);
      form.reset({
        name: res.data.name ?? "",
        floor: res.data.floor ?? "",
        type: res.data.type ?? "",
        roomQR: res.data.roomQR ?? "",
      });
      setIsLoading(false);
    })();
  }, [isOpen, id, form]);

  React.useEffect(() => {
    if (!isOpen) form.reset(defaultValues);
  }, [isOpen, form]);

  const handleDialogOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open && !isSubmitting) onClose();
    },
    [onClose, isSubmitting],
  );

  const onSubmit = async (values: EditRoomValues) => {
    if (!form.formState.isDirty)
      return toast.error("Same values are not allowed!");
    if (!id) return;
    setIsSubmitting(true);
    const room = await updateRoom(values, id);
    if (room.error) return toast.error(room.error);
    toast.success(room.message);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          className="sm:max-w-lg"
          showCloseButton={false}
          onEscapeKeyDown={(e) => {
            if (isSubmitting) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (isSubmitting) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Update room</DialogTitle>
            <DialogDescription>Change your room infos.</DialogDescription>
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
                      disabled={isSubmitting || isLoading}
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
                        disabled={isSubmitting || isLoading}
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
                        disabled={isSubmitting || isLoading}
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
                        disabled={isSubmitting || isLoading}
                        onClick={() => {
                          if (field.value.trim()) return;
                          form.setValue("roomQR", "");
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
                      disabled={isSubmitting || isLoading}
                      autoComplete="off"
                    />
                    <FieldDescription>
                      Use a stable, unique code you’ll encode into the printed
                      QR.
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
                disabled={isSubmitting || isLoading}
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
