import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface BioCardProps {
  bio?: string;
}

export default function BioCard({
  bio,
}: BioCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          About
        </CardTitle>
      </CardHeader>

      <CardContent>
        {bio ? (
          <p className="whitespace-pre-wrap leading-7 text-muted-foreground">
            {bio}
          </p>
        ) : (
          <p className="italic text-muted-foreground">
            No bio added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}