import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/site";

/** The ways through the site, as a hairline index in the page's language. */
export function RouteIndex({ locale, title, items }: { locale: Locale; title: string; items: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <p className="eyebrow text-paper/70!">{title}</p>
      <ul className="m-0 mt-4 list-none border-t border-paper/20 p-0">
        {items.map((item) => (
          <li key={item.href} className="border-b border-paper/20">
            <Link
              href={localePath(locale, item.href)}
              className="group flex items-center justify-between gap-4 py-3.5 text-paper transition-colors duration-200 hover:text-paper/70 focus-visible:text-paper/70 focus-visible:outline-offset-[-2px]"
            >
              <span className="font-display text-lg leading-none">{item.label}</span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 text-paper/50 transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The routes an index offers, labelled from the `nav` messages. */
export function siteRoutes(nav: (key: string) => string) {
  return [
    { href: "/", label: nav("home") },
    { href: "/about", label: nav("about") },
    { href: "/our-work", label: nav("ourWork") },
    { href: "/projects", label: nav("projects") },
    { href: "/impact", label: nav("impact") },
    { href: "/get-involved", label: nav("getInvolved") },
    { href: "/donate", label: nav("donate") },
    { href: "/contact", label: nav("contact") },
  ];
}
