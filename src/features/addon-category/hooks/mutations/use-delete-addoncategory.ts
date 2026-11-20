import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteAddonCategoryResponse } from "@/features/addon-category/types";
import { deleteAddonCategory } from "@/features/addon-category/actions";

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
