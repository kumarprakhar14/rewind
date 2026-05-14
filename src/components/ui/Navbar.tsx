"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, PlusCircle, User } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Feed", href: "/", icon: Home },
    { name: "Upload", href: "/upload", icon: PlusCircle },
    { name: "Profile", href: "/profile/me", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-paper-dark border-t border-ink/10 md:bottom-auto md:top-0 md:border-t-0 md:border-b shadow-md md:shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="hidden md:flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-accent" />
              <span className="font-caveat text-3xl text-ink font-bold tracking-wider pt-1">
                ReWind
              </span>
            </Link>
          </div>

          <div className="flex flex-1 justify-around md:justify-end md:gap-8 items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center w-full md:w-auto h-full px-2 transition-colors ${
                    isActive
                      ? "text-accent border-t-2 md:border-t-0 md:border-b-2 border-accent"
                      : "text-ink-light hover:text-ink"
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1 md:mb-0 md:mr-2 md:inline" />
                  <span className="text-xs md:text-sm font-medium">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
