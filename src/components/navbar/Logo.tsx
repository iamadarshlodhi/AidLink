"use client";

import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3 transition-opacity hover:opacity-80"
    >
      <Image
        src="/logo.svg"
        alt="AidLink Logo"
        width={40}
        height={40}
        priority
        className="h-10 w-10"
      />

      <div className="hidden sm:flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight">
          AidLink
        </span>

        <span className="text-xs text-muted-foreground">
          Connecting Communities
        </span>
      </div>
    </Link>
  );
}