import { cn } from "@/lib/utils";

export function Section({
  children, variant = "light", className, id,
}: { children: React.ReactNode; variant?: "light" | "deep" | "inverse"; className?: string; id?: string; }) {
  const bg = { light: "bg-paper text-ink", deep: "bg-paper-deep text-ink", inverse: "bg-ink text-paper" }[variant];
  return (
    <section id={id} className={cn(bg, "py-16 md:py-28 lg:py-32")}>
      <div className={cn("container", className)}>{children}</div>
    </section>
  );
}
