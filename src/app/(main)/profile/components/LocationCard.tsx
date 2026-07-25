import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, MapPinned, Building2 } from "lucide-react";

interface LocationCardProps {
  location: {
    area: string;
    city: string;
    state: string;
  };
}

export default function LocationCard({
  location,
}: LocationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Location
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-center gap-3">
          <MapPinned className="h-5 w-5 text-primary" />

          <div>
            <p className="text-sm text-muted-foreground">
              Area
            </p>

            <p className="font-medium">
              {location.area || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-primary" />

          <div>
            <p className="text-sm text-muted-foreground">
              City
            </p>

            <p className="font-medium">
              {location.city || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary" />

          <div>
            <p className="text-sm text-muted-foreground">
              State
            </p>

            <p className="font-medium">
              {location.state || "-"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}