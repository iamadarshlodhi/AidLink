import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif } from "next/font/google";
import "./globals.css";

import AuthProvider from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/QueryProvider";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AidLink",
  description:
    "Connect, help, and make a difference with AidLink.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        notoSerif.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}