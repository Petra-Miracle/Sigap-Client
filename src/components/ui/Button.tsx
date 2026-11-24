import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { Button as HeroButton } from "@heroui/react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "sm";

const VARIANT_MAP: Record<Variant, "primary" | "secondary" | "ghost" | "danger"> = {
  primary: "primary",
  secondary: "secondary",
  ghost: "ghost",
  danger: "danger",
};

const SIZE_MAP: Record<Size, "sm" | "md"> = {
  md: "md",
  sm: "sm",
};

/** Tombol dasar. Ukuran `md` memenuhi target sentuh 44 px. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; children?: ReactNode }) {
  return (
    <HeroButton
      type={type}
      variant={VARIANT_MAP[variant]}
      size={SIZE_MAP[size]}
      className={cn("min-h-11", size === "sm" && "min-h-8", className)}
      {...(props as unknown as ComponentProps<typeof HeroButton>)}
    >
      {children}
    </HeroButton>
  );
}
