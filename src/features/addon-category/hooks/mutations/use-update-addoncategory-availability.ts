import { updateAvailable } from "@/features/addon-category/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateAddonCategoryAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => updateAvailable(id),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["addon-category"] });
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
