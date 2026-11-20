import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteMenuCategoryResponse } from "@/features/menu-category/types";
import { deleteMenuCategory } from "@/features/menu-category/actions";

type Vars = { id: string };

export const useDeleteMenuCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteMenuCategoryResponse, Error, Vars>({
    mutationFn: ({ id }) => deleteMenuCategory(id),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["menu-category"] });
      toast.success("Deleted Successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
