"use client";

import * as React from "react";
import { z } from "zod";
import { toast } from "sonner";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldDescription as FieldHelp,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";

import type { DemoRoom } from "../../../../demo";

const roomSchema = z.object({
  name: z.string().min(1, "Room name is required."),
  roomQR: z.string().min(1, "Room QR code is required."),
  type: z.string().min(1, "Room type is required."),
  floor: z.string().min(1, "Floor is required."),
  imgUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || v.length === 0 || /^https?:\/\//i.test(v),
      "Image URL must start with http(s)://",
    ),
});

type RoomDraft = z.infer<typeof roomSchema>;

function toDraft(room?: DemoRoom | null): RoomDraft {
  return {
    name: room?.name ?? "",
    roomQR: room?.roomQR ?? "",
    type: room?.type ?? "",
    floor: room?.floor ?? "",
    imgUrl: room?.imgUrl ?? "",
  };
}

export function RoomFormDrawer({
  open,
  onOpenChange,
  room,
  mode,
  onSave,
  reservedQrCodes,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: DemoRoom | null;
  mode: "create" | "edit";
  onSave: (draft: RoomDraft) => void;
  reservedQrCodes: Set<string>;
}) {
  const [draft, setDraft] = React.useState<RoomDraft>(() => toDraft(room));
  const [errors, setErrors] = React.useState<Partial<Record<keyof RoomDraft, string>>>(
    {},
  );

  React.useEffect(() => {
    if (open) {
      setDraft(toDraft(room));
      setErrors({});
    }
  }, [open, room]);

  function validate(next: RoomDraft) {
    const parsed = roomSchema.safeParse(next);
    const nextErrors: Partial<Record<keyof RoomDraft, string>> = {};

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof RoomDraft | undefined;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      }
    }

    const qr = next.roomQR.trim();
    if (qr && mode === "create" && reservedQrCodes.has(qr)) {
      nextErrors.roomQR = "This QR code is already used by another room.";
    }
    if (qr && mode === "edit" && room?.roomQR !== qr && reservedQrCodes.has(qr)) {
      nextErrors.roomQR = "This QR code is already used by another room.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-dvh p-0">
        <DrawerHeader className="border-b">
          <DrawerTitle>{mode === "create" ? "Create room" : "Edit room"}</DrawerTitle>
          <DrawerDescription>
            Demo-only UI. Changes are kept in memory and reset on refresh.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <FieldGroup>
            <Field>
              <FieldLabel>
                <FieldTitle>Room name</FieldTitle>
                <FieldContent>
                  <Input
                    value={draft.name}
                    onChange={(e) => setDraft((v) => ({ ...v, name: e.target.value }))}
                    placeholder="e.g. Room 508"
                  />
                </FieldContent>
              </FieldLabel>
              <FieldError>{errors.name}</FieldError>
            </Field>

            <Field orientation="responsive">
              <FieldLabel>
                <FieldTitle>Floor</FieldTitle>
                <FieldContent>
                  <Input
                    value={draft.floor}
                    onChange={(e) => setDraft((v) => ({ ...v, floor: e.target.value }))}
                    placeholder="e.g. 5"
                    inputMode="numeric"
                  />
                </FieldContent>
              </FieldLabel>
              <FieldError>{errors.floor}</FieldError>

              <FieldLabel>
                <FieldTitle>Room type</FieldTitle>
                <FieldContent>
                  <Input
                    value={draft.type}
                    onChange={(e) => setDraft((v) => ({ ...v, type: e.target.value }))}
                    placeholder="e.g. Executive Suite"
                  />
                </FieldContent>
              </FieldLabel>
              <FieldError>{errors.type}</FieldError>
            </Field>

            <Field>
              <FieldLabel>
                <FieldTitle>Room QR code</FieldTitle>
                <FieldContent>
                  <Input
                    value={draft.roomQR}
                    onChange={(e) =>
                      setDraft((v) => ({ ...v, roomQR: e.target.value }))
                    }
                    placeholder="e.g. QR-RM-508"
                    autoCapitalize="characters"
                  />
                </FieldContent>
              </FieldLabel>
              <FieldHelp>
                This maps to the Prisma field `Room.roomQR`. Keep it stable once printed.
              </FieldHelp>
              <FieldError>{errors.roomQR}</FieldError>
            </Field>

            <Field>
              <FieldLabel>
                <FieldTitle>Image URL (optional)</FieldTitle>
                <FieldContent>
                  <Input
                    value={draft.imgUrl ?? ""}
                    onChange={(e) => setDraft((v) => ({ ...v, imgUrl: e.target.value }))}
                    placeholder="https://…"
                  />
                </FieldContent>
              </FieldLabel>
              <FieldError>{errors.imgUrl}</FieldError>
            </Field>
          </FieldGroup>
        </div>

        <DrawerFooter className="border-t bg-background">
          <div className="flex items-center justify-end gap-2">
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type="button"
              onClick={() => {
                const next: RoomDraft = {
                  name: draft.name.trim(),
                  roomQR: draft.roomQR.trim(),
                  type: draft.type.trim(),
                  floor: draft.floor.trim(),
                  imgUrl: (draft.imgUrl ?? "").trim(),
                };

                if (!validate(next)) {
                  toast.error("Fix the highlighted fields.");
                  return;
                }

                onSave(next);
                onOpenChange(false);
                toast.success(mode === "create" ? "Room created." : "Room updated.");
              }}
            >
              {mode === "create" ? "Create room" : "Save changes"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

