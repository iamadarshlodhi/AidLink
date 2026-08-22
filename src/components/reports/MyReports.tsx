"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import ReportCard from "./ReportCard";
import type { Report } from "@/types/report";

export default function MyReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        "/api/report/my-reports?page=1&limit=20"
      );

      setReports(response.data.data || []);
    } catch (error: any) {
      console.error(
        "Fetch reports:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load reports."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-sm text-muted-foreground">
          Loading reports...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          My Reports
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View the reports you have submitted and
          their current status.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="font-medium">
            No reports submitted
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Reports you submit will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <ReportCard
              key={report._id}
              report={report}
            />
          ))}
        </div>
      )}
    </div>
  );
}