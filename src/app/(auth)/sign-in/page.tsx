"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { signInSchema } from "@/schemas/signInSchema";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const router = useRouter();

  const form = useForm<
    z.infer<typeof signInSchema>
  >({
    resolver: zodResolver(signInSchema),

    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (
    data: z.infer<typeof signInSchema>
  ) => {
    setIsSubmitting(true);

    try {
      const result = await signIn(
        "credentials",
        {
          redirect: false,
          identifier: data.identifier,
          password: data.password,
        }
      );

      if (result?.error) {
        toast.error(
          "Invalid email/username or password"
        );
        return;
      }

      toast.success(
        "Signed in successfully"
      );

      router.replace("/dashboard");
    } catch {
      toast.error(
        "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="w-full max-w-md rounded-lg border bg-background p-8 shadow">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-2 text-muted-foreground">
            Sign in to AidLink
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>
                    Email or Username
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter email or username"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>
                    Password
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="flex justify-between items-center text-sm">
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto"
                onClick={() =>
                  router.push(
                    "/forgot-password"
                  )
                }
              >
                Forgot Password?
              </Button>

              <Button
                type="button"
                variant="link"
                className="p-0 h-auto"
                onClick={() =>
                  router.push("/sign-up")
                }
              >
                Sign Up
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}