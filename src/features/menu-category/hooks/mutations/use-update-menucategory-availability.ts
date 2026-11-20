import { updateAvailablility } from "@/features/menu-category/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateMenuCategoryAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => updateAvailablility(id),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["menu-category"] });
      const alterText = data.data?.isAvailable
        ? `Marked as available`
        : `Marked as unavailable`;
      toast.success(alterText);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
