import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteAddonCategoryResponse } from "@/types/addon-category";
import { deleteAddonCategory } from "@/actions/addon-category";

type Vars = { id: string };

export const useDeleteAddonCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteAddonCategoryResponse, Error, Vars>({
    mutationFn: ({ id }) => deleteAddonCategory(id),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["addon-category"] });
      toast.success("Deleted Successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
