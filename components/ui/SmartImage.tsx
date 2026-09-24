'use client';
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ImageRef } from "@/types/content";

/**
 * A photograph filling its frame. One still loading when it first shows is marked, so it fades in on arrival
 * (see `.smart-img` in globals.css) rather than popping into a frame the reader is already looking at; one that
 * is already complete, from the cache or decoded under the page transition's curtain, shows at once. The mark is
 * set in a layout effect, before paint, and never in the server HTML, so without scripts every image simply shows.
 */
export function SmartImage({ image, className, sizes, priority }: { image: ImageRef; className?: string; sizes?: string; priority?: boolean; }) {
  const ref = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const img = ref.current;
    if (!img || (img.complete && img.naturalWidth > 0)) return;
    img.dataset.loading = "";
    const arrived = () => { delete img.dataset.loading; };
    img.addEventListener("load", arrived, { once: true });
    img.addEventListener("error", arrived, { once: true });
    return () => {
      img.removeEventListener("load", arrived);
      img.removeEventListener("error", arrived);
      delete img.dataset.loading;
    };
  }, [image.url]);

  return (
    <Image ref={ref} src={image.url} alt={image.alt} fill sizes={sizes ?? "100vw"} priority={priority}
      className={cn("smart-img object-cover", className)} style={image.focus ? { objectPosition: image.focus } : undefined} />
  );
}
