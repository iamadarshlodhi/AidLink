import { Badge } from "@/components/ui/badge";
import { HelpRequestStatus } from "@/types/help-request";

interface StatusBadgeProps {
  status: HelpRequestStatus;
}

const variants: Record<
  HelpRequestStatus,
  string
> = {
  open: "bg-green-100 text-green-700",
  "in-progress":
    "bg-blue-100 text-blue-700",
  completed:
    "bg-gray-100 text-gray-700",
  cancelled:
    "bg-red-100 text-red-700",
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <Badge className={variants[status]}>
      {status}
    </Badge>
  );
}