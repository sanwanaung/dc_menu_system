import { updateUserRole } from "@/features/user/actions";
import {} from "@/features/room-service/types";
import { UpdateUserRoleResponse } from "@/features/user/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Vars = { id: string; role: string };

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserRoleResponse, Error, Vars>({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(`User role have been updated successfully!`);
    },
    onError: (error) => {
      console.log("error: ", error);
      toast.error(`${error.message}`);
    },
  });
};
