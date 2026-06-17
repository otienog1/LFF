import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import DonateClient from "@/components/donate/DonateClient";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "pt" }];
}

export const metadata: Metadata = { title: "Donate" };

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);

  return <DonateClient />;
}
