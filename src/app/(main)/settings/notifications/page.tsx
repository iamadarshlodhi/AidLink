"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";

export default function NotificationSettingsPage() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axios.get(
          "/api/settings/notifications"
        );

        setEnabled(
          response.data.data.notificationsEnabled
        );
      } catch (error) {
        console.error(
          "Failed to load notification settings:",
          error
        );

        toast.error(
          "Failed to load notification settings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = async (value: boolean) => {
    const previousValue = enabled;

    setEnabled(value);
    setSaving(true);

    try {
      await axios.patch(
        "/api/settings/notifications",
        {
          notificationsEnabled: value,
        }
      );

      toast.success(
        value
          ? "Notifications enabled."
          : "Notifications disabled."
      );
    } catch (error) {
      console.error(
        "Failed to update notification settings:",
        error
      );

      setEnabled(previousValue);

      toast.error(
        "Failed to update notification settings."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Notification Settings
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Control whether you receive AidLink
          notifications.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-card p-5">
        <div className="space-y-1">
          <p className="font-medium">
            Notifications
          </p>

          <p className="text-sm text-muted-foreground">
            {loading
              ? "Loading..."
              : enabled
                ? "You will receive notifications."
                : "Notifications are turned off."}
          </p>
        </div>

        <Switch
          checked={enabled}
          onCheckedChange={handleChange}
          disabled={loading || saving}
        />
      </div>
    </div>
  );
}