import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";

const TIERS = [
  { amount: "$25",  key: "seedling" },
  { amount: "$50",  key: "scholar" },
  { amount: "$100", key: "guardian" },
  { amount: "$250", key: "steward" },
] as const;

export async function DonationTiers() {
  const t = await getTranslations('getInvolved');
  return (
    <section className="bg-paper-deep border-b border-line py-20 md:py-28">
      <div className="container">
        <p className="eyebrow mb-10">{t('yourImpact')}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line">
          {TIERS.map((tier) => (
            <div key={tier.amount} className="bg-paper p-8 flex flex-col gap-4">
              <p className="font-display text-[3rem] leading-none font-medium text-ink">
                {tier.amount}
              </p>
              <p className="eyebrow text-green">{t(`${tier.key}Label`)}</p>
              <p className="text-ink-soft text-sm leading-[1.7] flex-1">{t(`${tier.key}Impact`)}</p>
              <Link href="/donate" className={buttonVariants({ variant: "link" })}>
                {t('giveNow')}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
