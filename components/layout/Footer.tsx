"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

const NAV_HREFS = ["/about", "/our-work", "/impact", "/get-involved", "/donate", "/contact"];
const NAV_KEYS = ["about", "ourWork", "impact", "getInvolved", "donate", "contact"] as const;

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const prefix = locale === "en" ? "" : "/" + locale;

  return (
    <footer className="bg-ink text-paper">
      <div className="container py-12 md:py-16 flex flex-col md:flex-row md:items-center gap-10">

        {/* Brand */}
        <div className="shrink-0 max-w-65">
          <p className="font-display text-lg">Luigi Footprints Foundation</p>
          <p className="mt-2 text-paper/50 text-xs max-w-[34ch] leading-relaxed">
            {t("tagline")}
          </p>
        </div>

        {/* Nav */}
        <nav aria-label="Footer" className="flex-1 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-paper/50">
          {NAV_HREFS.map((href, i) => (
            <Link key={href} href={prefix + href} className="hover:text-paper transition-colors">
              {tNav(NAV_KEYS[i])}
            </Link>
          ))}
        </nav>

        {/* Contact */}
        <div className="shrink-0 flex flex-col gap-1 md:text-right">
          <p className="text-[10px] uppercase tracking-[0.18em] text-paper/25">{t("getInTouch")}</p>
          <a href="mailto:info@theluigifootprints.org"
            className="text-xs text-paper/40 hover:text-paper transition-colors">
            info@theluigifootprints.org
          </a>
          <div className="mt-2 flex gap-3 md:justify-end text-xs text-paper/30">
            <a href="https://www.facebook.com/ManiagoSafarisEastAfrica" target="_blank" rel="noopener noreferrer" className="hover:text-paper/80 transition-colors">{t("facebook")}</a>
            <a href="https://www.instagram.com/maniagosafaris/" target="_blank" rel="noopener noreferrer" className="hover:text-paper/80 transition-colors">{t("instagram")}</a>
            <a href="https://www.youtube.com/channel/UCVmNdFZ3SvfszacIMCfpPHg" target="_blank" rel="noopener noreferrer" className="hover:text-paper/80 transition-colors">{t("youtube")}</a>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-paper/10">
        <div className="container py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-paper/25">
          <span>&copy; {new Date().getFullYear()} {t("rights")}</span>
          <span>{t("motto")}</span>
        </div>
      </div>
    </footer>
  );
}
