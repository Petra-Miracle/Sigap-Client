import type { ReactNode } from "react";
import { Tooltip as HeroTooltip } from "@heroui/react";
import { cn } from "@/lib/format";

/** Tooltip sederhana: hover/focus menampilkan `content`. */
export function Tooltip({
  content,
  children,
  placement = "top",
  className,
}: {
  content: ReactNode;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
}) {
  return (
    <HeroTooltip>
      <HeroTooltip.Trigger className={cn(className)}>{children}</HeroTooltip.Trigger>
      <HeroTooltip.Content placement={placement}>{content}</HeroTooltip.Content>
    </HeroTooltip>
  );
}
