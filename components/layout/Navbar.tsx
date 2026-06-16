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
  { href: "/projects", label: "Projects" },
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
        "fixed inset-x-0 top-0 z-100 transition-colors duration-300",
        solid
          ? "bg-paper/95 backdrop-blur border-b border-line"
          : "bg-transparent"
      )}
    >
      <nav className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className={cn("font-display text-xl transition-colors duration-300", solid ? "text-ink" : "text-paper")}>
          The Luigi Footprints Foundation
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7 text-[12px] tracking-[0.1em] uppercase">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn("transition-colors duration-300", solid ? "text-ink-soft hover:text-ink" : "text-paper/80 hover:text-paper")}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/donate" className={buttonVariants()}>Donate</Link>
        </div>

        {/* Mobile hamburger + Sheet */}
        <div className={cn("md:hidden transition-colors duration-300", solid ? "text-ink" : "text-paper")}>
          <Sheet>
            <SheetTrigger aria-label="Open menu">
              <Menu aria-hidden="true" />
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
