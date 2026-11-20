"use client";

import { getRoom } from "@/features/room/actions";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDeleteRoom } from "@/hooks/stores/use-delete-room";
import { useEditRoom } from "@/hooks/stores/use-edit-room";
import { allowedUserRole } from "@/lib";
import { authClient } from "@/lib/auth-client";
import { EyeIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ActionProps = {
  id: string;
};

const Actions = ({ id }: ActionProps) => {
  const { onOpen } = useEditRoom();
  const { onOpenDelete } = useDeleteRoom();
  const router = useRouter();
  const session = authClient.useSession();

  if (session.error) return;
  const handlePreviewQR = async (id: string) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    if (!id) return;
    const room = await getRoom({ id });
    if (room.error) return toast.error(room.error);
    router.push(`/admin/rooms/${id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-sm">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            if (session.data?.user.role !== "admin")
              return toast.error("You don't have permission!");
            onOpen(id);
          }}
        >
          <Pencil className="size-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (session.data?.user.role !== "admin")
              return toast.error("You don't have permission!");
            onOpenDelete(id);
          }}
          variant="destructive"
        >
          <Trash2 className="size-4 mr-2 " />
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handlePreviewQR(id)}>
          <EyeIcon className="size-4 mr-2" />
          Preview QR
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
