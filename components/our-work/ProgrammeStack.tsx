'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { ImageRef } from '@/types/content';
import { SmartImage } from '@/components/ui/SmartImage';
import { useLenis } from '@/components/layout/Layout';
import { fade, fadeFrom, START, STAGGER, unmask } from '@/components/motion/presets';
import { onArrival } from '@/components/motion/arrive';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Distance from the viewport top at which the stack holds: the chapter's
 * scroll margin, the same line in-page navigation scrolls to, which clears
 * the fixed header once the page has compacted it.
 */
const holdOffset = (el: HTMLElement) =>
  parseFloat(getComputedStyle(el.closest('section') ?? el).scrollMarginTop) || 96;

/**
 * The programmes as one spread: the photographs stacked in a single column
 * on the left, the texts one after another in the middle, and a rail of
 * square thumbnails fixed at the far right on the header's line, shown while
 * the column is pinned, that shows which programme is on and jumps to one on
 * click.
 *
 * On large screens the texts start one beat below the column, so the
 * photograph reaches the top first; the column is then pinned below the
 * header, exactly where it arrives, while the texts scroll past. The frame
 * wipes in from the bottom as the section arrives, the first photograph
 * settling from a slight zoom in step. As each later programme's text comes
 * into view its photograph is wiped in from the bottom over the one before
 * (a GSAP clip-path tween that plays through once triggered, about a second,
 * and reverses on the way back), settling from a slight zoom in step with the
 * wipe, while the one before recedes under a shade on the same curve. While a
 * programme is being read its photograph keeps settling slowly to rest, its
 * thumbnail is marked current, and the outgoing text fades as the next takes
 * over. Everything releases when the last text ends; the grid keeps its own
 * height (no pin spacing). At every size each text's chapter mark and body
 * rise in once as the block arrives.
 *
 * Without JavaScript the first photograph shows and the others stay clipped
 * away. On small screens, and on large ones under prefers-reduced-motion,
 * neither the column nor the rail is rendered and each programme carries its
 * own photograph above its text.
 */
export function ProgrammeStack({
  images,
  blocks,
  navLabel,
}: {
  images: (ImageRef | null)[];
  blocks: { id: string; title: string; content: React.ReactNode }[];
  navLabel: string;
}) {
  const lenis = useLenis();
  const root = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLElement>(null);
  const text = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Text entrances, at every size.
    mm.add('(prefers-reduced-motion: no-preference)', (context) => {
      const articles = gsap.utils.toArray<HTMLElement>('[data-block]', text.current);
      articles.forEach((article) => {
        const parts = article.querySelectorAll('[data-mark], [data-body]');
        if (!parts.length) return;
        gsap.set(parts, fadeFrom());
        onArrival(article, START.block, (d) => context.add(() => {
          gsap.to(parts, fade({ stagger: STAGGER.blocks, delay: d }));
        }));
      });
    });

    // The pinned column, the rail and their choreography, large screens only.
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', (context) => {
      const pinEl = pin.current;
      const railEl = rail.current;
      const textEl = text.current;
      if (!pinEl || !textEl) return;
      const frame = pinEl.querySelector<HTMLElement>('[data-frame]');
      const slides = gsap.utils.toArray<HTMLElement>('[data-slide]', pinEl);
      const articles = gsap.utils.toArray<HTMLElement>('[data-block]', textEl);
      const thumbs = railEl ? gsap.utils.toArray<HTMLElement>('[data-thumb]', railEl) : [];
      if (!frame || slides.length === 0) return;

      // Rest: the first photograph in view, the others clipped away entirely.
      slides.forEach((slide, i) => gsap.set(slide, { clipPath: i === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }));

      const activate = (index: number) => {
        thumbs.forEach((thumb, i) => {
          const on = i === index;
          thumb.dataset.active = on ? 'true' : 'false';
          if (on) thumb.setAttribute('aria-current', 'true');
          else thumb.removeAttribute('aria-current');
        });
      };
      activate(0);

      // The frame wipes in from the bottom once as the section arrives, the same wipe the later
      // programmes get, and the first photograph settles from a slight zoom in step with it.
      const firstZoom = slides[0].querySelector<HTMLElement>('[data-zoom]');
      gsap.set(frame, { clipPath: 'inset(100% 0% 0% 0%)' });
      if (firstZoom) gsap.set(firstZoom, { scale: 1.15 });
      onArrival(pinEl, START.block, (d) => context.add(() => {
        gsap.timeline({ delay: d })
          .to(frame, unmask({ clipPath: 'inset(0% 0% 0% 0%)' }), 0)
          .to(firstZoom, unmask({ scale: 1.04 }), 0);
      }));

      // The column holds below the header while the text column scrolls past.
      const start = () => `top top+=${holdOffset(pinEl)}`;
      const end = () => `bottom top+=${holdOffset(pinEl) + pinEl.offsetHeight}`;
      ScrollTrigger.create({
        trigger: pinEl, start, endTrigger: textEl, end,
        pin: pinEl, pinSpacing: false, invalidateOnRefresh: true,
      });

      // The rail is fixed to the viewport on the header's line; it is shown for exactly the stretch the
      // column is pinned. Thumbnail opacity itself belongs to the stylesheet (40%, full when current).
      if (railEl) {
        gsap.set(railEl, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: pinEl, start, endTrigger: textEl, end, invalidateOnRefresh: true,
          onToggle: (self) => gsap.to(railEl, { autoAlpha: self.isActive ? 1 : 0, duration: 0.35, ease: 'power2.out', overwrite: true }),
        });
      }

      articles.forEach((article, i) => {
        const slide = slides[i];
        if (!slide) return;
        const zoom = slide.querySelector<HTMLElement>('[data-zoom]');
        const next = articles[i + 1];

        // Wipe: once the programme's text comes into view the wipe plays through on its own. The
        // clip edge rises, the incoming photograph settles from a slight zoom, and the previous one
        // recedes under a shade, all on one duration and one curve so they read as a single move.
        // Scrolling back above that line reverses it.
        const previous = slides[i - 1];
        if (i > 0 && previous) {
          gsap.timeline({
            defaults: { duration: 1, ease: 'power3.inOut' },
            scrollTrigger: { trigger: article, start: 'top 85%', toggleActions: 'play none none reverse', invalidateOnRefresh: true },
          })
            .fromTo(slide, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)' }, 0)
            .fromTo(zoom, { scale: 1.15 }, { scale: 1.04 }, 0)
            .fromTo(previous.querySelector('[data-recede]'), { scale: 1 }, { scale: 1.08 }, 0)
            .fromTo(previous.querySelector('[data-shade]'), { opacity: 0 }, { opacity: 0.35 }, 0);
        }

        // Drift: while this programme is read, its photograph keeps settling, slowly, from where the
        // wipe left it to rest, until the next wipe begins.
        if (zoom) {
          gsap.fromTo(zoom, { scale: 1.04 }, {
            scale: 1, ease: 'none', immediateRender: false, overwrite: 'auto',
            scrollTrigger: {
              trigger: article, start: 'top 35%',
              endTrigger: next ?? article, end: next ? 'top 85%' : 'bottom 35%',
              scrub: true, invalidateOnRefresh: true,
            },
          });
        }

        // The rail marks the programme whose text is on: from the middle of its wipe until the next one's.
        ScrollTrigger.create({
          trigger: article,
          start: 'top 60%',
          end: 'bottom 60%',
          onEnter: () => activate(i),
          onEnterBack: () => activate(i),
        });

        // The outgoing text fades as the next one takes over; the last one leaves with the column.
        if (next) {
          gsap.to(article, {
            opacity: 0.15, ease: 'none',
            scrollTrigger: { trigger: article, start: 'bottom 45%', end: 'bottom 15%', scrub: true, invalidateOnRefresh: true },
          });
        }
      });
    });
  }, { scope: root });

  /** Scroll to a programme. Lenis is resynced first because a native scroll may have just moved the page. */
  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 96;
      const y = target.getBoundingClientRect().top + window.scrollY - margin;
      lenis.scrollTo(window.scrollY, { immediate: true });
      lenis.scrollTo(y);
    } else {
      target.scrollIntoView({ block: 'start' });
    }
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <div ref={root} className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
      {/* The photographs: one column, pinned, on large screens with motion. */}
      <div className="hidden lg:block motion-reduce:lg:hidden lg:col-span-5 lg:row-start-1 bleed-left">
        <div ref={pin} className="h-[calc(100svh-8rem)]">
          <div data-frame className="relative h-full overflow-hidden bg-paper-deep">
            {images.map((image, i) => (
              <div
                key={image ? image.url + i : i}
                data-slide
                className="absolute inset-0 will-change-[clip-path]"
                style={i > 0 ? { clipPath: 'inset(100% 0% 0% 0%)' } : undefined}
              >
                <div data-recede className="absolute inset-0 will-change-transform">
                  <div data-zoom className="absolute inset-0 will-change-transform">
                    {image && <SmartImage image={image} sizes="(max-width:1024px) 100vw, 45vw" />}
                  </div>
                </div>
                <div data-shade aria-hidden="true" className="absolute inset-0 bg-ink opacity-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The texts, set one beat below the column on large screens so the photograph reaches the top first.
          Under reduced motion on large screens they take the middle of the grid, with their own photographs. */}
      <div
        ref={text}
        className="space-y-24 lg:col-span-5 lg:col-start-7 lg:row-start-1 lg:space-y-[24svh] lg:pt-[24svh] motion-reduce:lg:col-span-8 motion-reduce:lg:col-start-3 motion-reduce:lg:pt-0"
      >
        {blocks.map((block) => (
          <article key={block.id} id={block.id} data-block className="scroll-mt-24">
            {block.content}
          </article>
        ))}
      </div>

      {/* The rail: square thumbnails fixed at the far right, 2rem from the edge like the header's controls, centred on
          the pinned column (which runs from 6rem to 2rem above the bottom), shown while the column is pinned. */}
      <nav
        ref={rail}
        aria-label={navLabel}
        className="invisible fixed right-8 top-[calc(50svh+2rem)] z-30 hidden -translate-y-1/2 flex-col gap-3 opacity-0 lg:flex motion-reduce:lg:hidden"
      >
        {blocks.map((block, i) => {
          const image = images[i];
          return (
            <a
              key={block.id}
              href={`#${block.id}`}
              aria-label={block.title}
              data-thumb
              data-active={i === 0 ? 'true' : 'false'}
              onClick={(e) => go(e, block.id)}
              className="relative block size-12 overflow-hidden opacity-40 outline-offset-4 transition-opacity duration-200 ease-out hover:opacity-100 focus-visible:opacity-100 data-[active=true]:opacity-100 data-[active=true]:outline-1 data-[active=true]:outline-green xl:size-14"
            >
              {image && <SmartImage image={{ url: image.url, alt: '', focus: image.focus }} sizes="56px" />}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
