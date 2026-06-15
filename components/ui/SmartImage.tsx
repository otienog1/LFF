import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ImageRef } from "@/types/content";

export function SmartImage({ image, className, sizes, priority }: { image: ImageRef; className?: string; sizes?: string; priority?: boolean; }) {
  return (
    <Image src={image.url} alt={image.alt} fill sizes={sizes ?? "100vw"} priority={priority}
      className={cn("object-cover", className)} />
  );
}
