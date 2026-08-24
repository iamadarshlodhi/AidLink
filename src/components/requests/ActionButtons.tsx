"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

import ApplyButton from "./ApplyButton";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ActionButtonsProps {
  requestId: string;
  isOwner?: boolean;
  isAdmin?: boolean;
  hasApplied?: boolean;
  status?: string;
}

export default function ActionButtons({
  requestId,
  isOwner = false,
  isAdmin = false,
  hasApplied = false,
  status = "open",
}: ActionButtonsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] = useState("");

  const isOwnerOrAdmin = isOwner || isAdmin;
  const canModify = status === "open";

  /*
   * OWNER / ADMIN
   */
  if (isOwnerOrAdmin) {
    const handleDelete = async () => {
      try {
        setIsDeleting(true);
        setError("");

        await axios.delete(
          `/api/help-request/${requestId}`
        );

        queryClient.removeQueries({
          queryKey: ["help-request", requestId],
        });

        await queryClient.invalidateQueries({
          queryKey: ["help-requests"],
        });

        router.push("/help-request");
        router.refresh();
      } catch (error: any) {
        setError(
          error?.response?.data?.message ||
            "Failed to delete help request."
        );
      } finally {
        setIsDeleting(false);
        setDeleteDialogOpen(false);
      }
    };

    return (
      <>
        <div className="flex flex-wrap gap-3">
          {/* Applications - ALWAYS AVAILABLE */}
          <Button asChild variant="outline">
            <Link
              href={`/help-request/${requestId}/applications`}
            >
              Applications
            </Link>
          </Button>

          {/* Edit - ONLY WHEN OPEN */}
          {canModify && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(
                  `/help-request/${requestId}/edit`
                )
              }
            >
              Edit
            </Button>
          )}

          {/* Delete - ONLY WHEN OPEN */}
          {canModify && (
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                setDeleteDialogOpen(true)
              }
              disabled={isDeleting}
            >
              Delete
            </Button>
          )}
        </div>

        {!canModify && (
          <p className="mt-2 text-sm text-muted-foreground">
            This request can no longer be edited or
            deleted.
          </p>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}

        <AlertDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete this help request?
              </AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be undone. All
                pending applications for this request
                will also be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isDeleting}
              >
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete Request"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  /*
   * ALREADY APPLIED
   */
  if (hasApplied) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled
      >
        Already Applied
      </Button>
    );
  }

  /*
   * NORMAL USER
   */
  return <ApplyButton requestId={requestId} />;
}