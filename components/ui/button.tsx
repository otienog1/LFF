import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Site buttons: sharp corners, a small tracked uppercase label, 44px tall.
 *
 * Filled and ghost variants fill in from the left on hover (`btn-wipe`, colour
 * from `--wipe`), the same draw the nav underline uses; the arrow in `CtaArrow`
 * slides with it. The `link` variant is a plain sentence-case text link whose
 * underline draws in the same way over a faint resting hairline.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding text-[12px] tracking-[0.14em] uppercase font-medium whitespace-nowrap h-11 px-7 transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] motion-reduce:active:scale-100 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-green text-paper btn-wipe [--wipe:var(--color-green-deep)]",
        outline:
          "border border-line bg-transparent text-ink hover:bg-ink/5",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
        ghost:
          "border border-ink text-ink btn-wipe [--wipe:var(--color-ink)] hover:text-paper focus-visible:text-paper",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "relative h-auto px-0 py-0 normal-case tracking-normal text-[13px] font-normal text-ink border-0 border-b border-b-current/30 hover:text-green active:scale-100 after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-current after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-(--ease-out) hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none",
      },
      size: {
        default: "gap-2",
        xs: "h-6 gap-1 px-2 text-[10px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-3 text-[10px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 px-9 gap-2",
        icon: "size-8 px-0",
        "icon-xs": "size-6 px-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 px-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-9 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
