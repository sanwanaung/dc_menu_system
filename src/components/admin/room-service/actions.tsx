"use client";

import { updateRoomServiceStatus } from "@/actions/room-service";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useCancelRs } from "@/hooks/use-cancel-rs";
import { useDeleteRs } from "@/hooks/use-delete-rs";
import { useViewRsNotes } from "@/hooks/use-view-rs";
import { allowedUserRole } from "@/lib";
import { authClient } from "@/lib/auth-client";
import { RoomServiceStatus } from "@/utils";
import { RoomServiceOrder } from "generated/prisma/client";

import {
  CheckCircle2,
  ClipboardCheck,
  MoreHorizontal,
  Trash2,
  View,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

type RoomServiceWithRoom = RoomServiceOrder & {
  room: {
    name: string;
  };
};

type Props = {
  t: RoomServiceWithRoom;
};

const Actions = ({ t }: Props) => {
  const { onOpenCancel } = useCancelRs();
  const { onOpenDelete } = useDeleteRs();
  const { onOpenViewNote } = useViewRsNotes();
  const session = authClient.useSession();

  const handleAccept = async (id: string, status: RoomServiceStatus) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    const result = await updateRoomServiceStatus(id, status);
    if (result.error) return toast.error(result.error);
    toast.success(`Marked as ${status}`);
  };

  const handleFinish = async (id: string, status: RoomServiceStatus) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    const result = await updateRoomServiceStatus(id, status);
    if (result.error) return toast.error(result.error);
    toast.success(`Marked as ${status}`);
  };

  const handleCancel = async (id: string, status: RoomServiceStatus) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    onOpenCancel(id, status);
  };

  const handleDelete = (id: string) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    onOpenDelete(id);
  };

  const handleViewNote = (id: string) => {
    onOpenViewNote(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-sm">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuItem
          disabled={t.status !== "PENDING"}
          onClick={() => handleAccept(t.id, "ACCEPTED")}
        >
          <ClipboardCheck className="mr-2 size-4" />
          Accepted
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={t.status !== "ACCEPTED"}
          onClick={() => handleFinish(t.id, "FINISHED")}
        >
          <CheckCircle2 className="mr-2 size-4" />
          Finished
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={t.status === "ACCEPTED" || t.status === "FINISHED"}
          className="hover:text-red-300"
          onClick={() => handleCancel(t.id, "CANCELED")}
        >
          <XCircle className="mr-2 size-4" />
          Canceled
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={t.status !== "PENDING" && t.status !== "ACCEPTED"}
          onClick={() => handleViewNote(t.id)}
        >
          <View className="mr-2 size-4" />
          View Notes
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => handleDelete(t.id)}
        >
          <Trash2 className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
