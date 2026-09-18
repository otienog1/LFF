import type { Locale } from "@/i18n/config";
import type { ContactBlock, CtaBlock as CtaBlockType } from "@/types/content";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/site";
import { InteriorHero } from "@/components/shared/InteriorHero";
import { Lede } from "@/components/home/Lede";
import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import ContactForm from "@/components/contact/ContactForm";

export interface ContactLabels {
  writeLabel: string;
  writeHeading: string;
  writeIntro: string;
  emailLabel: string;
  followLabel: string;
  whereLabel: string;
  location: string;
  social: Record<(typeof SOCIAL_LINKS)[number]["key"], string>;
}

const DT = "text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft";

/**
 * Contact: the hero and opening line from the page's own block, then one
 * chapter with the ways to reach the foundation on the left and the letter
 * on the right, and the home page's invitation to close.
 */
export function ContactPage({ hero, cta, labels }: { hero: ContactBlock | undefined; cta: CtaBlockType | undefined; labels: ContactLabels; locale: Locale }) {
  return (
    <>
      <InteriorHero block={{ title: hero?.title, subtitle: hero?.subtitle, image: hero?.image }} />
      {hero?.content && <Lede number="01" text={hero.content} />}

      <Chapter tone="light" id="write">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4">
            <ChapterMark number="02" label={labels.writeLabel} />
            <SplitHeading text={labels.writeHeading} className="display-2 mt-6 max-w-[12ch]" />
            <p className="body-lg mt-6 max-w-[38ch] text-ink-soft">{labels.writeIntro}</p>

            <Reveal className="mt-12">
              <dl className="m-0 space-y-8 border-t border-ink/15 pt-8">
                <div>
                  <dt className={DT}>{labels.emailLabel}</dt>
                  <dd className="m-0 mt-2">
                    <a href={`mailto:${CONTACT_EMAIL}`} className="link-draw font-display text-xl text-ink hover:text-green">{CONTACT_EMAIL}</a>
                  </dd>
                </div>
                <div>
                  <dt className={DT}>{labels.followLabel}</dt>
                  <dd className="m-0 mt-2 flex flex-wrap gap-x-6 gap-y-2">
                    {SOCIAL_LINKS.map((link) => (
                      <a key={link.key} href={link.href} target="_blank" rel="noopener noreferrer" className="link-draw text-[15px] text-ink hover:text-green">
                        {labels.social[link.key]}
                      </a>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className={DT}>{labels.whereLabel}</dt>
                  <dd className="m-0 mt-2 text-[15px] text-ink">{labels.location}</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <div className="mt-14 lg:col-span-7 lg:col-start-6 lg:mt-0">
            <ContactForm />
          </div>
        </div>
      </Chapter>

      {/* The home invitation without its portraits: one of them is already this page's hero. */}
      {cta && <CtaBlock block={{ ...cta, images: undefined }} />}
    </>
  );
}
