"use client";

import { Control } from "react-hook-form";
import { z } from "zod";

import { helpRequestSchema } from "@/schemas/helpRequestSchema";

type HelpRequestFormValues = z.infer<typeof helpRequestSchema>;

type Test = HelpRequestFormValues["helpersRequired"];

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

type HelpRequestFormInput = z.infer<
  typeof helpRequestSchema
>;

interface CategorySelectProps {
  control: Control<HelpRequestFormInput>;
}

const categories = [
  {
    value: "medical",
    label: "Medical",
  },
  {
    value: "food",
    label: "Food",
  },
  {
    value: "education",
    label: "Education",
  },
  {
    value: "transport",
    label: "Transport",
  },
  {
    value: "shelter",
    label: "Shelter",
  },
  {
    value: "other",
    label: "Other",
  },
] as const;

export default function CategorySelect({
  control,
}: CategorySelectProps) {
  return (
    <FormField
      control={control}
      name="category"
      render={({ field } : { field: any }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>

          <Select
            value={field.value}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {categories.map((category) => (
                <SelectItem
                  key={category.value}
                  value={category.value}
                >
                  {category.label}
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