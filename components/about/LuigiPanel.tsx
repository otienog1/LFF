import { SmartImage } from "@/components/ui/SmartImage";

const LUIGI_IMAGE = {
  url: "https://api.theluigifootprints.org/wp-content/uploads/2022/01/Luigi.webp",
  alt: "Luigi Francescon",
};

export function LuigiPanel() {
  return (
    <section className="bg-ink text-paper border-b border-paper/10 py-24 md:py-36">
      <div className="container flex flex-col items-center text-center">
        <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden mb-10 ring-1 ring-paper/20">
          <SmartImage image={LUIGI_IMAGE} sizes="224px" />
        </div>
        <blockquote className="font-display italic text-xl md:text-2xl lg:text-[1.75rem] text-paper/80 max-w-[34ch] leading-[1.45]">
          &ldquo;He believed that protecting wildlife and uplifting communities were never opposing
          forces — only two sides of the same footprint.&rdquo;
        </blockquote>
        <div className="mt-8 w-8 h-px bg-paper/20" />
        <p className="mt-5 text-[11px] tracking-[0.2em] uppercase text-paper/40">
          Luigi Francescon &nbsp;&middot;&nbsp; 1948 – 2016
        </p>
      </div>
    </section>
  );
}
