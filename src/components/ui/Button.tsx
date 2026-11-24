import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "sm";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-strong disabled:bg-accent/50",
  secondary: "bg-surface text-ink border border-line hover:bg-canvas disabled:text-ink-2",
  ghost: "text-accent hover:bg-accent-soft disabled:text-ink-2",
  danger: "bg-danger text-white hover:bg-danger/90 disabled:bg-danger/50",
};

/** Tombol dasar. Ukuran `md` memenuhi target sentuh 44 px. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors disabled:cursor-not-allowed",
        size === "md" ? "min-h-11 px-4 text-sm" : "min-h-8 px-3 text-xs",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
