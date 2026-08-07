import { Badge } from "@/components/ui/badge";
import { HelpRequestTaskType } from "@/types/help-request";

interface TaskTypeBadgeProps {
  taskType: HelpRequestTaskType;
}

const variants: Record<
  HelpRequestTaskType,
  string
> = {
  paid: "bg-blue-600 text-white",
  volunteer:
    "border border-green-600 text-green-700",
};

export default function TaskTypeBadge({
  taskType,
}: TaskTypeBadgeProps) {
  return (
    <Badge className={variants[taskType]}>
      {taskType === "paid"
        ? "Paid"
        : "Volunteer"}
    </Badge>
  );
}