"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Siren } from "lucide-react";
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

interface SOSButtonProps {
  requestId: string;
}

export default function SOSButton({
  requestId,
}: SOSButtonProps) {
  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSOS = async () => {
    try {
      setIsSending(true);

      const response = await axios.post("/api/sos", {
        requestId,
      });

      toast.success(
        response.data.message || "SOS alert sent successfully."
      );

      setOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send SOS alert."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Siren className="h-4 w-4" />
        SOS
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Send SOS alert?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will send an emergency alert to your
              saved emergency contacts. Only continue if
              you genuinely need emergency assistance.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleSOS}
              disabled={isSending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSending ? "Sending..." : "Send SOS"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}