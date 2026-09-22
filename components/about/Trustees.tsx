import type { TeamBlock as TeamBlockType } from "@/types/content";
import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";
import { Photo } from "@/components/home/Photo";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Chapter 06, the board. One row per trustee: the portrait on the left four
 * columns and the name, role and full biography on the right seven. On large
 * screens the portrait is the grid cell itself, so it is exactly as tall as
 * its own row's text, whatever that row's biography runs to; on small screens
 * it is square above the text. It arrives with a plain fade so its height
 * never reads as anything but the row's. The biographies are the best-written
 * copy on the site, so they are on the page rather than behind a click.
 */
export function Trustees({ block }: { block: TeamBlockType }) {
  return (
    <Chapter tone="light" id="trustees">
      {block.title && <ChapterMark number="06" label={block.title} />}
      {block.subtitle && <SplitHeading text={block.subtitle} className="display-2 mt-6 max-w-[22ch]" />}
      {block.content && <p className="body-lg mt-6 max-w-[58ch] text-ink-soft">{block.content}</p>}
      <ol className="m-0 mt-14 list-none border-t border-line p-0 md:mt-20">
        {block.items.map((member) => (
          <li key={member.name} className="border-b border-line py-10 md:py-14 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-x-8">
            <Photo
              image={member.image}
              sizes="(max-width:1024px) 100vw, 33vw"
              className="aspect-square lg:col-span-4 lg:aspect-auto lg:min-h-[20rem]"
              drift={3}
              scale={1.08}
              reveal="fade"
            />
            <Reveal className="mt-8 lg:col-span-7 lg:col-start-6 lg:mt-0" delay={0.1}>
              <h3 className="m-0 font-display font-medium text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.1] tracking-[-0.01em]">
                {member.name}
              </h3>
              <p className="eyebrow m-0 mt-3">{member.role}</p>
              <p className="body-lg m-0 mt-6 max-w-[60ch] text-ink-soft">{member.bio}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}
