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

import { Input } from "@/components/ui/input";

type HelpRequestFormValues = z.infer<
  typeof helpRequestSchema
>;

interface PaymentInputProps {
  control: Control<HelpRequestFormValues>;
}

export default function PaymentInput({
  control,
}: PaymentInputProps) {
  return (
    <FormField
      control={control}
      name="tentativePayment"
      render={({ field } : { field: any }) => (
        <FormItem>
          <FormLabel>
            Tentative Payment (₹)
          </FormLabel>

          <FormControl>
            <Input
              type="number"
              min={0}
              placeholder="Enter payment amount"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === ""
                    ? undefined
                    : Number(e.target.value)
                )
              }
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}