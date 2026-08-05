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

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { CalendarIcon } from "lucide-react";

import { format } from "date-fns";
import { Input } from "@/components/ui/input";

type HelpRequestFormValues = z.infer<
  typeof helpRequestSchema
>;

interface DeadlinePickerProps {
  control: Control<HelpRequestFormValues>;
}

export default function DeadlinePicker({
  control,
}: DeadlinePickerProps) {
  return (
    <FormField
      control={control}
      name="deadline"
      render={({ field } : { field: any }) => (
        <FormItem>
          <FormLabel>Deadline</FormLabel>

          <div className="space-y-3">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />

                    {field.value ? (
                      format(
                        field.value,
                        "PPP"
                      )
                    ) : (
                      <span>
                        Select date
                      </span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    if (!date) return;

                    const current =
                      field.value ??
                      new Date();

                    date.setHours(
                      current.getHours()
                    );

                    date.setMinutes(
                      current.getMinutes()
                    );

                    field.onChange(date);
                  }}
                  disabled={(date) =>
                    date <
                    new Date(
                      new Date().setHours(
                        0,
                        0,
                        0,
                        0
                      )
                    )
                  }
                />
              </PopoverContent>
            </Popover>

            <Input
              type="time"
              value={
                field.value
                  ? `${field.value
                      .getHours()
                      .toString()
                      .padStart(
                        2,
                        "0"
                      )}:${field.value
                      .getMinutes()
                      .toString()
                      .padStart(
                        2,
                        "0"
                      )}`
                  : ""
              }
              onChange={(e) => {
                const date =
                  field.value ??
                  new Date();

                const [hours, minutes] =
                  e.target.value
                    .split(":")
                    .map(Number);

                date.setHours(hours);
                date.setMinutes(
                  minutes
                );

                field.onChange(
                  new Date(date)
                );
              }}
            />
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}