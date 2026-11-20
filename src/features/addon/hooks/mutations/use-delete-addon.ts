import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteAddonResponse } from "@/features/addon/types";
import { deleteAddon } from "@/features/addon/actions";

type Vars = { id: string };

export const useDeleteAddonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteAddonResponse, Error, Vars>({
    mutationFn: ({ id }) => deleteAddon({ id }),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["addon"] });
      toast.success("Deleted Successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
