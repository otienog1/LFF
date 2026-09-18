import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { locales } from "@/i18n/config";
import { localePath } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { ErrorChapter } from "@/components/errors/ErrorChapter";
import { RouteIndex, siteRoutes } from "@/components/errors/RouteIndex";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/**
 * The one 404 page of the static export, served for any unknown URL in any
 * language. All three languages are rendered; the root layout's head script
 * sets <html lang> from the URL before first paint, and the stylesheet shows
 * only that language's block (see `[data-lang]` in globals.css).
 */
export default async function NotFound() {
  const blocks = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      t: await getTranslations({ locale, namespace: "notFound" }),
      nav: await getTranslations({ locale, namespace: "nav" }),
    })),
  );
  return (
    <>
      {blocks.map(({ locale, t, nav }) => (
        <div key={locale} data-lang={locale} lang={locale}>
          <ErrorChapter
            code="404"
            label={t("label")}
            heading={t("title")}
            body={t("body")}
            actions={
              <Link href={localePath(locale, "/")} className={cn(buttonVariants({ size: "lg" }), "text-[13px]")}>
                {t("cta")}
              </Link>
            }
            aside={<RouteIndex locale={locale} title={t("trails")} items={siteRoutes((key) => nav(key))} />}
          />
        </div>
      ))}
    </>
  );
}
