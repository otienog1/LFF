import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Arrow for a primary call to action. Slides 4px to the right while the
 * parent button (`group/button`, set by `buttonVariants`) is hovered; still
 * under prefers-reduced-motion.
 */
export function CtaArrow({ className }: { className?: string }) {
  return (
    <ArrowRight
      aria-hidden="true"
      className={cn(
        "transition-transform duration-200 ease-out group-hover/button:translate-x-1 motion-reduce:transition-none",
        className,
      )}
    />
  );
}
