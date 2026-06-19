"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const prefix = locale === "en" ? "" : "/" + locale;

  const LINKS = useMemo(() => [
    { href: prefix + "/about", label: t("about") },
    { href: prefix + "/our-work", label: t("ourWork") },
    { href: prefix + "/projects", label: t("projects") },
    { href: prefix + "/impact", label: t("impact") },
    { href: prefix + "/get-involved", label: t("getInvolved") },
  ], [prefix, t]);

  const pathname = usePathname();
  // Pages with a light background at the top need the navbar always solid
  const alwaysSolid = /\/(donate|contact)$/.test(pathname);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = alwaysSolid || scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-100 transition-colors duration-300",
        solid
          ? "bg-paper/95 backdrop-blur border-b border-line"
          : "bg-transparent"
      )}
    >
      <nav className="container flex items-center justify-between py-2.5">
        {/* Logo */}
        <Link href={prefix || "/"} className={cn("font-display text-xl transition-colors duration-300", solid ? "text-ink" : "text-paper")}>
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
          <Link href={prefix + "/donate"} className={buttonVariants()}>{t("donate")}</Link>
          <LocaleSwitcher solid={solid} />
        </div>

        {/* Mobile hamburger + Sheet */}
        <div className={cn("md:hidden transition-colors duration-300", solid ? "text-ink" : "text-paper")}>
          <Sheet>
            <SheetTrigger aria-label={t("openMenu")}>
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
                <Link href={prefix + "/donate"} className={buttonVariants()}>{t("donate")}</Link>
                <LocaleSwitcher solid={true} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
