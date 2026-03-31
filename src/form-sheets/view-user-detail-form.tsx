"use client";

import { getUser } from "@/actions/user";
import { Tag } from "@/components/admin/shared/tag";
import { roleLabel, roleVariant } from "@/components/admin/user/user-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useViewUserDetail } from "@/hooks/use-view-user-detail";
import { useChangeUserRole } from "@/hooks/user-change-user-role";
import { format } from "date-fns";
import { User } from "generated/prisma/client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const getFallbackName = (name: string) => {
  return name.split("")[0].toLocaleUpperCase();
};

const getFirstName = (name: string) => {
  return name.split(" ")[0];
};

export const ViewUserDeailForm = () => {
  const { isOpen, onClose, id } = useViewUserDetail();
  const { onOpenChangeUserRole } = useChangeUserRole();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<Pick<
    User,
    | "id"
    | "name"
    | "email"
    | "role"
    | "banned"
    | "createdAt"
    | "updatedAt"
    | "image"
  > | null>(null);

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    (async () => {
      if (!id) return;
      setIsLoading(true);
      const rs = await getUser(id);
      if (rs.error || !rs.data) return toast.error(rs.error);
      setUser(rs.data);
      setIsLoading(false);
    })();
  }, [id]);

  if (!user) return null;
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          className="sm:max-w-lg rounded-sm p-8"
          showCloseButton={false}
        >
          {!isLoading ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-semibold text-muted-foreground ">
                  {`${getFirstName(user.name)}'s Details`}
                </DialogTitle>
                <DialogDescription>
                  View account details and manage user role.
                </DialogDescription>
              </DialogHeader>
              <div>
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarImage
                      src={user?.image as string | undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {getFallbackName(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="truncate text-sm font-semibold">
                        {user.name}
                      </div>
                    </div>
                    <div className="truncate text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      UserID:
                    </div>
                    <div className="mt-1 break-all text-xs">{user.id}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Role
                    </div>
                    <Tag
                      className="mt-1 text-xs"
                      variant={roleVariant(`${user.role}`)}
                    >
                      {roleLabel(`${user.role}`)}
                    </Tag>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Created
                    </div>
                    <div className="mt-1 text-xs">
                      {format(user.createdAt, "MMM dd, yyyy")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Updated
                    </div>
                    <div className="mt-1 text-xs">
                      {format(user.createdAt, "MMM dd, yyyy")}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      Ban
                    </div>
                    <div className="mt-1 text-xs">Not Banned</div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onOpenChangeUserRole(user.id);
                    onClose();
                  }}
                >
                  Change role
                </Button>
                <Button
                  type="button"
                  title={self ? "You can't ban yourself" : undefined}
                  className="w-20"
                  variant={"destructive"}
                  onClick={() => {
                    return toast.error(
                      "This feature isn't availabe now.Try later!",
                    );
                  }}
                >
                  Ban
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-semibold text-muted-foreground ">
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-300" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-35 bg-gray-300 " />
                  <Skeleton className="h-4 w-50 bg-gray-300" />
                </div>
              </div>
              <Separator />
              <div className="flex gap-2">
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-4 w-50 bg-gray-300" />
                  <Skeleton className="h-4 w-50 bg-gray-300" />
                  <Skeleton className="h-4 w-50 bg-gray-300" />
                </div>
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-4 w-50 bg-gray-300" />
                  <Skeleton className="h-4 w-50 bg-gray-300" />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
