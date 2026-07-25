"use client";

import Link from "next/link";
import { ArrowRight, HandHelping, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Request Help */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <HandHelping className="h-6 w-6 text-primary" />
        </div>

        <h3 className="text-xl font-semibold">
          Request Help
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a new help request and connect with volunteers who are ready to
          assist you.
        </p>

        <Button asChild className="mt-6">
          <Link href="/requests/create">
            Create Request
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Browse Requests */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Search className="h-6 w-6 text-primary" />
        </div>

        <h3 className="text-xl font-semibold">
          Browse Requests
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Explore nearby requests and volunteer to help people in your
          community.
        </p>

        <Button asChild variant="secondary" className="mt-6">
          <Link href="/requests">
            Explore Requests
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}