import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
//@ts-ignore
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { VariantOptionDTO } from "@/features/variant-option/types";
import { cn } from "@/lib/utils";
import { formatedCurrency } from "./variant-option-utils";

type Props = {
  variantOpt: VariantOptionDTO;
  onDelete: (value: VariantOptionDTO) => void;
  onEdit: (value: VariantOptionDTO) => void;
  onToggleAvailability: (value: VariantOptionDTO) => void;
};

function AvailabilityPill({ isAvailable }: { isAvailable: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        isAvailable
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200"
          : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200",
      )}
    >
      {isAvailable ? "Available" : "Unavailable"}
    </span>
  );
}

const VariantOptionCard = ({
  variantOpt,
  onDelete,
  onEdit,
  onToggleAvailability,
}: Props) => {
  const formated = formatedCurrency(variantOpt.price);

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate w-full text-wrap">
              {variantOpt.name}
            </CardTitle>
            <div className="my-2 flex flex-wrap items-center gap-2">
              <AvailabilityPill isAvailable={variantOpt.isAvailable} />
              <span className="text-xs text-muted-foreground">
                Order: {variantOpt.displayOrder}
              </span>
            </div>
            <div className="text-muted-foreground mt-2 text-sm">
              Price: <span className="">{formated}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon-sm">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-sm">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(variantOpt)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleAvailability(variantOpt)}
              >
                {variantOpt.isAvailable ? (
                  <>
                    <EyeOff className="mr-2 size-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 size-4" />
                    Make available
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(variantOpt)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Updated {format(variantOpt.updatedAt, "dd MMM yyyy")}
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onToggleAvailability(variantOpt)}
          >
            {variantOpt.isAvailable ? "Disable" : "Enable"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VariantOptionCard;
