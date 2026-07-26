"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DeleteAccountDialog() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!password.trim()) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.delete(
        "/api/user/account",
        {
          data: {
            password,
          },
        }
      );

      toast.success(response.data.message);

      await signOut({
        callbackUrl: "/sign-in",
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ??
          "Failed to delete account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog >
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          Delete Account
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent >
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Account
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone.
            Your account will be permanently
            deactivated and your personal
            information will be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}