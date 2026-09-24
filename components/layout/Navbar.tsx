"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import { WORDMARK } from "@/lib/site";

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
    { href: prefix + "/contact", label: t("contact") },
  ], [prefix, t]);

  const pathname = usePathname();
  /** The section the page belongs to: the link itself, or any page beneath it (a project under Projects). */
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Every page opens on a photograph or an ink chapter, so the bar starts transparent everywhere and turns solid on scroll.
  const solid = scrolled;

  // The menu closes the moment a page transition starts, under the rising curtain, so the next page never opens with
  // it still sliding away (and its scroll lock is released before that page is placed and measured).
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("page-transition-cover", close);
    return () => window.removeEventListener("page-transition-cover", close);
  }, []);
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-100 transition-colors duration-300",
        solid
          ? "bg-paper/95 backdrop-blur border-b border-line"
          : "bg-transparent"
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:bg-green focus:px-4 focus:py-2 focus:text-[11px] focus:font-medium focus:uppercase focus:tracking-[0.12em] focus:text-paper"
      >
        {t("skip")}
      </a>
      {/* On xl the row leaves the container and sits on the hero frame's grid: 32px in from the
          viewport edges, in a 96px band so the frame's top line is 32px below it. It eases to 80px once solid. */}
      <nav
        className={cn(
          "container flex items-center justify-between py-2.5 xl:max-w-none xl:px-8 xl:py-0 transition-[height] duration-300 ease-(--ease-out) motion-reduce:transition-none",
          solid ? "xl:h-20" : "xl:h-24",
        )}
      >
        {/* Logo */}
        <Link href={prefix || "/"} className={cn("py-2 font-display text-xl transition-colors duration-300 xl:py-0", solid ? "text-ink" : "text-paper")}>
          {WORDMARK}
        </Link>

        {/* Desktop nav: from xl, where the wordmark, five links, the button and the locale fit on one line in every
            language; below that the menu button takes over rather than letting labels wrap. */}
        <div className="hidden xl:flex items-center gap-7 text-[12px] tracking-[0.1em] uppercase">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isCurrent(l.href) ? "page" : undefined}
              className={cn(
                "link-draw whitespace-nowrap py-1 transition-colors duration-300",
                solid ? "text-ink-soft hover:text-ink aria-[current=page]:text-ink" : "text-paper/80 hover:text-paper aria-[current=page]:text-paper",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={prefix + "/donate"}
            aria-current={isCurrent(prefix + "/donate") ? "page" : undefined}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-8 whitespace-nowrap px-5 text-[11px] duration-300",
              solid
                ? "border-ink text-ink [--wipe:var(--color-ink)] hover:text-paper focus-visible:text-paper"
                : "border-paper/70 text-paper [--wipe:var(--color-paper)] hover:text-ink focus-visible:text-ink",
            )}
          >
            {t("donate")}
          </Link>
          <LocaleSwitcher solid={solid} />
        </div>

        {/* Mobile hamburger + Sheet */}
        <div className={cn("xl:hidden transition-colors duration-300", solid ? "text-ink" : "text-paper")}>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            {/* 44px target, pulled into the gutter so the glyph still sits on the container's edge. */}
            <SheetTrigger aria-label={t("openMenu")} className="-mr-2.5 grid size-11 place-items-center">
              <Menu aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" showCloseButton={false} className="bg-ink w-full! max-w-none! border-none">
              <div className="flex flex-col justify-between h-full px-8 pt-24 pb-12">

                {/* Custom close button */}
                <SheetClose className="absolute top-4 right-5 text-paper/50 hover:text-paper border border-paper/20 hover:border-paper/60 rounded-none p-2 transition-colors duration-200">
                  <X size={20} aria-hidden="true" />
                  <span className="sr-only">Close</span>
                </SheetClose>

                {/* Nav links */}
                <nav className="flex flex-col gap-1">
                  {LINKS.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      aria-current={isCurrent(l.href) ? "page" : undefined}
                      className="font-display text-3xl text-paper/60 hover:text-paper aria-[current=page]:text-paper transition-colors duration-200 py-2 border-b border-paper/8"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>

                {/* Bottom: donate + locale */}
                <div className="flex flex-col gap-6">
                  <Link
                    href={prefix + "/donate"}
                    className={cn(buttonVariants({ variant: 'ghost' }), 'self-start border-paper text-paper [--wipe:var(--color-paper)] hover:text-ink focus-visible:text-ink')}
                  >
                    {t("donate")}
                  </Link>
                  <LocaleSwitcher mobile />
                </div>

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
