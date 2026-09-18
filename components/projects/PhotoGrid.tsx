import type { ImageRef } from "@/types/content";
import { Photo } from "@/components/home/Photo";
import { cn } from "@/lib/utils";

/**
 * The photographs from a write-up as one row, cover-cropped to a single
 * ratio so originals of mixed sizes sit level. Each is unmasked as it arrives.
 */
export function PhotoGrid({ images, className }: { images: ImageRef[]; className?: string }) {
  if (images.length === 0) return null;
  const cols = images.length >= 5 ? "lg:grid-cols-5" : images.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <ul className={cn("m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3", cols, className)}>
      {images.map((image, i) => (
        <li key={image.url + i}>
          <Photo
            image={image}
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
            className="aspect-4/5"
            drift={3}
            scale={1.08}
          />
        </li>
      ))}
    </ul>
  );
}
