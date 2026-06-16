import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const TIERS = [
  {
    amount: "$25",
    label: "Seedling",
    impact: "Plants 10 indigenous trees in the Olchani nursery",
  },
  {
    amount: "$50",
    label: "Scholar",
    impact: "Funds a full school term kit for one student",
  },
  {
    amount: "$100",
    label: "Guardian",
    impact: "Equips a community conservation ranger for one month",
  },
  {
    amount: "$250",
    label: "Steward",
    impact: "Sustains a Maasai women's enterprise for one full season",
  },
];

export function DonationTiers() {
  return (
    <section className="bg-paper-deep border-b border-line py-20 md:py-28">
      <div className="container">
        <p className="eyebrow mb-10">Your Impact</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line">
          {TIERS.map((tier) => (
            <div key={tier.amount} className="bg-paper p-8 flex flex-col gap-4">
              <p className="font-display text-[3rem] leading-none font-medium text-ink">
                {tier.amount}
              </p>
              <p className="eyebrow text-green">{tier.label}</p>
              <p className="text-ink-soft text-sm leading-[1.7] flex-1">{tier.impact}</p>
              <Link href="/donate" className={buttonVariants({ variant: "link" })}>
                Give now →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
