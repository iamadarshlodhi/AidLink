import { Badge } from "@/components/ui/badge";
import { HelpRequestUrgency } from "@/types/help-request";

interface UrgencyBadgeProps {
  urgency: HelpRequestUrgency;
}

const variants: Record<
  HelpRequestUrgency,
  string
> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

export default function UrgencyBadge({
  urgency,
}: UrgencyBadgeProps) {
  return (
    <Badge className={variants[urgency]}>
      {urgency.charAt(0).toUpperCase() +
        urgency.slice(1)}
    </Badge>
  );
}