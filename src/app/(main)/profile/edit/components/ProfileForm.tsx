"use client";

import { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateProfileSchema } from "@/schemas/UpdateProfileSchema";

import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import ProfileImageUpload from "./ProfileImageUpload";
import SkillsInput from "./SkillsInput";
import LocationForm from "./LocationForm";
import EmergencyContacts from "./EmergencyContacts";

import { ProfileUser } from "@/types/profile";

type FormData = z.infer<typeof updateProfileSchema>;

interface ProfileFormProps {
  user: ProfileUser;
  onSubmit: (
    values: FormData,
    image?: File
  ) => Promise<void>;
}

export default function ProfileForm({
  user,
  onSubmit,
}: ProfileFormProps) {
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState(user.profilePicture ?? "");

  useEffect(() => {
    if(!image) return;

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return()=>{
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);


  const form = useForm<FormData>({
    resolver: zodResolver(updateProfileSchema) as Resolver<FormData>,

    defaultValues: {
      name: user.name,
      username: user.username,
      phone: user.phone,
      bio: user.bio ?? "",

      gender: user.gender,

      dateofBirth: user.dateofBirth ? new Date(user.dateofBirth) : undefined,

      notificationsEnabled:
        user.notificationsEnabled,

      skills: user.skills ?? [],

      location: {
        state: user.location?.state ?? "",
        city: user.location?.city ?? "",
        area: user.location?.area ?? "",
      },

      emergencyContacts:
        user.emergencyContacts ?? [],
    },
  });

  const submit = async (
    values: FormData
  ) => {
    await onSubmit(values, image);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="space-y-8"
      >
        <ProfileImageUpload
          image={preview}
          name={user.name}
          onImageSelect={setImage}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field } : { field: any }) => (
              <FormItem>
                <FormLabel>
                  Name
                </FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field } : { field: any }) => (
              <FormItem>
                <FormLabel>
                  Username
                </FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field } : { field: any }) => (
              <FormItem>
                <FormLabel>
                  Phone
                </FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field } : { field: any }) => (
            <FormItem>
              <FormLabel>
                Bio
              </FormLabel>

              <FormControl>
                <Textarea
                  rows={5}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <SkillsInput
          control={form.control}
        />

        <LocationForm
          control={form.control}
        />

        <EmergencyContacts
          control={form.control}
        />

        <div className="flex justify-end">
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}