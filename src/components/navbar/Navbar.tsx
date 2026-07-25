"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

import Logo from "./Logo";
import UserNav from "./UserNav";
import ThemeToggle from "../ThemeToggle";
import MobileMenu from "./MobileMenu";
import NotificationDropdown from "./NotificationDropdown";

const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Requests",
    href: "/requests",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-2">
            <MobileMenu />
            <Logo />
        </div>

        {/* Center */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
          </div>
            
          <NotificationDropdown />

          <UserNav />
        </div>
      </div>
    </header>
  );
}