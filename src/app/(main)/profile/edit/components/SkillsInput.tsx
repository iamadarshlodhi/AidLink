"use client";

import { useState } from "react";
import {
  Control,
  useController,
} from "react-hook-form";

import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { z } from "zod";
import { updateProfileSchema } from "@/schemas/UpdateProfileSchema";

type FormData = z.infer<typeof updateProfileSchema>;

interface SkillsInputProps {
  control: Control<FormData>;
}

export default function SkillsInput({
  control,
}: SkillsInputProps) {
  const { field } = useController({
    name: "skills",
    control,
  });

  const [skill, setSkill] = useState("");

  const skills = field.value ?? [];

  const addSkill = () => {
    const value = skill.trim();

    if (!value) return;

    if (skills.includes(value)) return;

    if (skills.length >= 20) return;

    field.onChange([...skills, value]);

    setSkill("");
  };

  const removeSkill = (index: number) => {
    field.onChange(
      skills.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Skills
      </h3>

      <div className="flex gap-2">
        <Input
          value={skill}
          placeholder="Add a skill"
          onChange={(e) =>
            setSkill(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
        />

        <Button
          type="button"
          onClick={addSkill}
        >
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((item, index) => (
          <Badge
            key={`${item}-${index}`}
            className="flex items-center gap-2"
          >
            {item}

            <button
              type="button"
              onClick={() =>
                removeSkill(index)
              }
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}