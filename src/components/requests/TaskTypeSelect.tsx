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

interface TaskTypeSelectProps {
  control: Control<HelpRequestFormValues>;
}

const taskTypes = [
  {
    value: "volunteer",
    label: "Volunteer",
  },
  {
    value: "paid",
    label: "Paid",
  },
] as const;

export default function TaskTypeSelect({
  control,
}: TaskTypeSelectProps) {
  return (
    <FormField
      control={control}
      name="taskType"
      render={({ field } : { field: any }) => (
        <FormItem>
          <FormLabel>Task Type</FormLabel>

          <Select
            value={field.value}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {taskTypes.map((type) => (
                <SelectItem
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
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