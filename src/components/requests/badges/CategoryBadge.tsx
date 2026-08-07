import { Badge } from "@/components/ui/badge";
import { HelpRequestCategory } from "@/types/help-request";

interface CategoryBadgeProps {
  category: HelpRequestCategory;
}

const variants: Record<
  HelpRequestCategory,
  string
> = {
  medical: "bg-red-100 text-red-700",
  food: "bg-orange-100 text-orange-700",
  education: "bg-blue-100 text-blue-700",
  transport: "bg-purple-100 text-purple-700",
  shelter: "bg-green-100 text-green-700",
  other: "bg-gray-100 text-gray-700",
};

export default function CategoryBadge({
  category,
}: CategoryBadgeProps) {
  return (
    <Badge className={variants[category]}>
      {category.charAt(0).toUpperCase() +
        category.slice(1)}
    </Badge>
  );
}