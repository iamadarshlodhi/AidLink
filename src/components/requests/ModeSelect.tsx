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

interface ModeSelectProps {
  control: Control<HelpRequestFormValues>;
}

const modes = [
  {
    value: "online",
    label: "Online",
  },
  {
    value: "offline",
    label: "Offline",
  },
] as const;

export default function ModeSelect({
  control,
}: ModeSelectProps) {
  return (
    <FormField
      control={control}
      name="mode"
      render={({ field } : { field: any }) => (
        <FormItem>
          <FormLabel>Mode</FormLabel>

          <Select
            value={field.value}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {modes.map((mode) => (
                <SelectItem
                  key={mode.value}
                  value={mode.value}
                >
                  {mode.label}
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