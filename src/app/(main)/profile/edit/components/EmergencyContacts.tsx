"use client";

import { Control, useFieldArray } from "react-hook-form";
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
import { Button } from "@/components/ui/button";

import { Trash2, Plus } from "lucide-react";

type FormData = z.infer<typeof updateProfileSchema>;

interface EmergencyContactsProps {
  control: Control<FormData>;
}

export default function EmergencyContacts({
  control,
}: EmergencyContactsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "emergencyContacts",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Emergency Contacts
        </h3>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              name: "",
              email: "",
              relationship: "",
            })
          }
          disabled={fields.length >= 5}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No emergency contacts added.
        </p>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-lg border p-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium">
                Contact {index + 1}
              </h4>

              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={control}
                name={
                  `emergencyContacts.${index}.name` as any
                }
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={
                  `emergencyContacts.${index}.email` as any
                }
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={
                  `emergencyContacts.${index}.relationship` as any
                }
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>
                      Relationship
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Brother"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}