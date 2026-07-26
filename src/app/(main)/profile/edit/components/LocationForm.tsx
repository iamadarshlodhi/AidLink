"use client";

import { Control } from "react-hook-form";
import { z } from "zod";

import { updateProfileSchema } from "@/schemas/UpdateProfileSchema";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

type FormData = z.infer<typeof updateProfileSchema>;

interface LocationFormProps {
  control: Control<FormData>;
}

export default function LocationForm({
  control,
}: LocationFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Location
      </h3>

      <div className="grid gap-6 md:grid-cols-3">
        <FormField
          control={control}
          name="location.state"
          render={({ field } : { field: any }) => (
            <FormItem>
              <FormLabel>
                State
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Madhya Pradesh"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="location.city"
          render={({ field } : { field: any }) => (
            <FormItem>
              <FormLabel>
                City
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Bhopal"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="location.area"
          render={({ field } : { field: any }) => (
            <FormItem>
              <FormLabel>
                Area
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="MP Nagar"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}