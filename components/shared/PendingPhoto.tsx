import type { ImageRef } from "@/types/content";
import { cn } from "@/lib/utils";

/** The file every entry points at until the foundation supplies its photograph (see data/data.json). */
export const PENDING_PHOTO = "/projects/placeholder.svg";

export function isPending(image?: ImageRef | null): boolean {
  return Boolean(image && image.url === PENDING_PHOTO);
}

/**
 * The visible label is the alt text's lead, "Photograph to come" in the page's language; the rest of the
 * alt text is a sourcing note for the foundation and stays with screen readers.
 */
function labelOf(alt: string): string {
  const i = alt.indexOf(":");
  return i > 0 ? alt.slice(0, i) : alt;
}

/**
 * A frame still waiting for its photograph, set like a plate in a printed catalogue rather than a
 * wireframe: the deep paper ground inside a hairline, "Photograph to come" as a caption under a short rule,
 * and, where given, the entry's own opening line in the display face, so each plate says something of its
 * own instead of repeating one empty box. `size="row"` is the thumbnail in a field-project row: ground and
 * hairline only, too small for words. The whole plate carries the image's alt text as its accessible name.
 */
export function PendingPhoto({
  image,
  text,
  size = "card",
  className,
}: {
  image: ImageRef;
  text?: string;
  size?: "row" | "card" | "panel";
  className?: string;
}) {
  const label = labelOf(image.alt);
  return (
    <div role="img" aria-label={image.alt} className={cn("relative overflow-hidden bg-paper-deep", className)}>
      <span aria-hidden="true" className={cn("pointer-events-none absolute border border-ink/10", size === "row" ? "inset-1" : "inset-2.5")} />
      {size !== "row" && (
        <div aria-hidden="true" className={cn("absolute inset-0 flex flex-col justify-between", size === "panel" ? "p-8 md:p-10" : "p-6 md:p-7")}>
          <p className="m-0 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-soft">
            <span className="h-px w-6 bg-ink/25" />
            {label}
          </p>
          {text && (
            <p
              className={cn(
                "m-0 font-display font-light text-ink/80 text-pretty",
                size === "panel"
                  ? "max-w-[24ch] text-[clamp(1.375rem,2vw,1.875rem)] leading-[1.3]"
                  : "line-clamp-4 max-w-[28ch] text-[clamp(1.0625rem,1.3vw,1.25rem)] leading-[1.35]",
              )}
            >
              {text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
