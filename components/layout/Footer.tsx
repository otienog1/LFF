"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations, useLocale } from "next-intl";
import { SITE_NAME, CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Same pages as the header, in the same order. */
const PAGES = [
  { href: "/about", key: "about" },
  { href: "/our-work", key: "ourWork" },
  { href: "/projects", key: "projects" },
  { href: "/impact", key: "impact" },
  { href: "/get-involved", key: "getInvolved" },
  { href: "/donate", key: "donate" },
  { href: "/contact", key: "contact" },
] as const;

const label = "text-[11px] font-medium uppercase tracking-[0.2em] text-paper/50";
const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-light";
const link = `link-draw inline-block py-1 text-[15px] leading-snug text-paper/70 hover:text-paper transition-colors duration-200 ${focus}`;

/**
 * Site footer. Its three columns rise once as it arrives; links draw an
 * underline on hover like the nav. Static under prefers-reduced-motion.
 */
export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const prefix = locale === "en" ? "" : "/" + locale;
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-col]", {
        opacity: 0, y: 16, duration: 0.8, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
      });
    });
  }, { scope: root });

  return (
    <footer ref={root} className="bg-ink text-paper border-t border-paper/15">
      <div className="container pt-16 pb-14 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20">
        <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-8 lg:gap-x-12">

          {/* Wordmark and tagline */}
          <div data-col className="md:col-span-12 md:row-start-1 lg:col-span-5">
            <p className="font-display font-medium text-2xl md:text-[1.75rem] leading-tight">{SITE_NAME}</p>
            <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-paper/60">{t("tagline")}</p>
          </div>

          {/* Contact: ahead of the page list on phones, where the email is the action that matters */}
          <address data-col className="not-italic md:col-span-6 md:col-start-7 md:row-start-2 lg:col-span-4 lg:col-start-9 lg:row-start-1">
            <p className={label}>{t("getInTouch")}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={`mt-4 inline-block py-1 font-display text-lg md:text-xl leading-snug text-paper hover:text-green-light transition-colors duration-200 break-all ${focus}`}
            >
              {CONTACT_EMAIL}
            </a>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                    {t(s.key)}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-paper/50">{t("location")}</p>
          </address>

          {/* Pages */}
          <nav data-col aria-label={t("navLabel")} className="md:col-span-6 md:col-start-1 md:row-start-2 lg:col-span-3 lg:col-start-6 lg:row-start-1">
            <p className={label}>{t("navLabel")}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1">
              {PAGES.map((p) => (
                <li key={p.href}>
                  <Link href={prefix + p.href} className={link}>{tNav(p.key)}</Link>
                </li>
              ))}
            </ul>
          </nav>

        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-paper/10">
        <div className="container py-6">
          <p className="text-xs leading-relaxed text-paper/50">
            &copy; {new Date().getFullYear()} {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
