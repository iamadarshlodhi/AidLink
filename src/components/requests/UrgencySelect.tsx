"use client";

import { Control } from "react-hook-form";
import { z } from "zod";

import { helpRequestSchema } from "@/schemas/helpRequestSchema";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type HelpRequestFormValues = z.infer<
  typeof helpRequestSchema
>;

interface UrgencySelectProps {
  control: Control<HelpRequestFormValues>;
}

const urgencies = [
  {
    value: "low",
    label: "Low",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "high",
    label: "High",
  },
  {
    value: "critical",
    label: "Critical",
  },
] as const;

export default function UrgencySelect({
  control,
}: UrgencySelectProps) {
  return (
    <FormField
      control={control}
      name="urgency"
      render={({ field } : { field: any }) => (
        <FormItem>
          <FormLabel>Urgency</FormLabel>

          <Select
            value={field.value}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {urgencies.map((urgency) => (
                <SelectItem
                  key={urgency.value}
                  value={urgency.value}
                >
                  {urgency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}