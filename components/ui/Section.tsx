import { cn } from "@/lib/utils";

export function Section({
  children, variant = "light", className, id,
}: { children: React.ReactNode; variant?: "light" | "deep" | "inverse" | "green" | "green-deep"; className?: string; id?: string; }) {
  const bg = {
    light:      "bg-paper text-ink border-b border-line",
    deep:       "bg-paper-deep text-ink border-b border-line",
    inverse:    "bg-ink text-paper border-b border-paper/10",
    green:      "bg-green text-paper border-b border-green-deep",
    "green-deep": "bg-green-deep text-paper border-b border-paper/10",
  }[variant];
  return (
    <section id={id} className={cn(bg, "py-16 md:py-28 lg:py-32")}>
      <div className={cn("container", className)}>{children}</div>
    </section>
  );
}
