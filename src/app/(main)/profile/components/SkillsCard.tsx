import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

interface SkillsCardProps {
  skills: string[];
}

export default function SkillsCard({
  skills,
}: SkillsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Skills
        </CardTitle>
      </CardHeader>

      <CardContent>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-3 py-1 text-sm"
              >
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="italic text-muted-foreground">
            No skills added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
