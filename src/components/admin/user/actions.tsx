"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useViewUserDetail } from "@/hooks/stores/use-view-user-detail";
import { useChangeUserRole } from "@/hooks/stores/user-change-user-role";
import { authClient } from "@/lib/auth-client";
import { MoreHorizontal, ShieldAlert, User2, UserLock } from "lucide-react";
import { toast } from "sonner";

type ActionProps = {
  id: string;
};

const Actions = ({ id }: ActionProps) => {
  const { onOpenViewUserDetail } = useViewUserDetail();
  const { onOpenChangeUserRole } = useChangeUserRole();
  const session = authClient.useSession();

  if (!session) return;

  const handleBanUser = () => {
    toast.error("This feature isn't availabe now.Try later!");
  };

  const handleViewUserDeialt = (id: string) => {
    if (session.data?.user.role !== "admin")
      return toast.error("You don't have permission!");
    onOpenViewUserDetail(id);
  };

  const handleUpdateUserRole = (id: string) => {
    if (session.data?.user.role !== "admin")
      return toast.error("You don't have permission!");
    onOpenChangeUserRole(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-sm">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleViewUserDeialt(id)}>
          <User2 className="size-4 mr-2" />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleUpdateUserRole(id)}>
          <UserLock className="size-4 mr-2" />
          Change role
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleBanUser}>
          <ShieldAlert className="size-4 mr-2" />
          Ban User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
