"use client";

import { getUser } from "@/actions/user";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUserRole } from "@/hooks/mutations/user/use-update-user-role";
import { useChangeUserRole } from "@/hooks/user-change-user-role";
import { USER_ROLE_VALUES, UserRoles } from "@/utils";
import { User } from "generated/prisma/client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const getFirstName = (name: string) => {
  return name.split(" ")[0];
};

export const ChageUserRoleForm = () => {
  const { isOpen, onClose, id } = useChangeUserRole();
  const [isLoading, setIsLoading] = useState(false);
  const mutation = useUpdateUserRole();
  const [userRole, setUserRole] = useState<string | undefined>("");
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
      setUserRole(rs.data.role as string | undefined);
      setIsLoading(false);
    })();
  }, [id]);

  const handleUpdateUserRole = async () => {
    if (!userRole || !id) return null;
    mutation.mutate({ id, role: userRole });
    if (!mutation.isPending) return onClose();
  };

  if (!user) return null;
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
            <DialogDescription>{`Change the ${getFirstName(user.name)}'s role.`}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              Role
            </div>
            <Select
              defaultValue={userRole}
              value={userRole}
              onValueChange={(v) => setUserRole(v as UserRoles)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent align="start">
                {USER_ROLE_VALUES.filter((item) => user.role !== item).map(
                  (role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isLoading || mutation.isPending}
              onClick={() => {
                handleUpdateUserRole();
              }}
            >
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
