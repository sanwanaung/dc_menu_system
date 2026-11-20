"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAcceptRsMutation } from "@/features/room-service/hooks/mutations/use-accept-rs";
import { useFinishRsMutation } from "@/features/room-service/hooks/mutations/use-finish-rs";
import { useCancelRs } from "@/hooks/stores/use-cancel-rs";
import { useDeleteRs } from "@/hooks/stores/use-delete-rs";
import { useViewRsNotes } from "@/hooks/stores/use-view-rs";
import { allowedUserRole } from "@/lib";
import { authClient } from "@/lib/auth-client";
import { RoomServiceDTO, RoomServiceDTOStatus } from "@/features/room-service/types";

import {
  CheckCircle2,
  ClipboardCheck,
  MoreHorizontal,
  Trash2,
  View,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

type RoomServiceWithRoom = RoomServiceDTO & {
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
  const acceptMutation = useAcceptRsMutation();
  const finishMutation = useFinishRsMutation();
  const session = authClient.useSession();

  const handleAccept = async (id: string, status: RoomServiceDTOStatus) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    acceptMutation.mutate({ id, status });
  };

  const handleFinish = async (id: string, status: RoomServiceDTOStatus) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    finishMutation.mutate({ id, status });
  };

  const handleCancel = async (id: string, status: RoomServiceDTOStatus) => {
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
          disabled={
            t.status === "ACCEPTED" ||
            t.status === "FINISHED" ||
            t.status === "CANCELED"
          }
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
