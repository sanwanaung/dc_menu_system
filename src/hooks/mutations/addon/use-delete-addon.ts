import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteAddonResponse } from "@/types/addon";
import { deleteAddon } from "@/actions/addon";

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
