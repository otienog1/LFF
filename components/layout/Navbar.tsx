"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/our-work", label: "Our Work" },
  { href: "/impact", label: "Impact" },
  { href: "/get-involved", label: "Get Involved" },
];

export default function Navbar() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? "bg-paper/95 backdrop-blur border-b border-line"
          : "bg-transparent"
      )}
    >
      <nav className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="font-display text-xl">
          Luigi Footprints
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7 text-[13px]">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-ink-soft hover:text-ink transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/donate" className={buttonVariants()}>Donate</Link>
        </div>

        {/* Mobile hamburger + Sheet */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger aria-label="Open menu">
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="bg-paper">
              <div className="flex flex-col gap-6 mt-10 text-lg px-6">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-ink-soft hover:text-ink transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link href="/donate" className={buttonVariants()}>Donate</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
