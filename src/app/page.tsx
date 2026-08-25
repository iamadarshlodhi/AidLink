"use client";

import Link from "next/link";
import {
  HeartHandshake,
  HandHelping,
  ShieldCheck,
  Users,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="AidLink logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-bold tracking-tight">
              AidLink
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Link
              href="/sign-in"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <HeartHandshake className="h-8 w-8 text-primary" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Help when you need it.
            <br />
            <span className="text-primary">
              Help when you can give it.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            AidLink connects people who need help with people who
            are ready to help. Request assistance, offer your skills,
            and build a stronger community together.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>

            <Link
              href="/sign-in"
              className="rounded-lg border px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <HandHelping className="h-5 w-5 text-primary" />
            </div>

            <h2 className="text-lg font-semibold">
              Request Help
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Post a help request and connect with people who
              can assist you.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>

            <h2 className="text-lg font-semibold">
              Help Others
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Discover requests and use your time, skills, or
              resources to make a difference.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>

            <h2 className="text-lg font-semibold">
              Build Trust
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Profiles, ratings, reviews, and verification help
              create a trusted community.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-16 text-center">
        <h2 className="text-2xl font-bold">
          Ready to make a difference?
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Join AidLink and start connecting with people who
          need help or are ready to provide it.
        </p>

        <Link
          href="/sign-up"
          className="mt-6 inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Join AidLink
        </Link>
      </section>
    </main>
  );
}