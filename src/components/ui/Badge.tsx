import type { ReactNode } from "react";
import { Chip } from "@heroui/react";
import { cn } from "@/lib/format";

export type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

const COLOR_MAP: Record<Tone, "default" | "accent" | "success" | "warning" | "danger"> = {
  neutral: "default",
  accent: "accent",
  success: "success",
  warning: "warning",
  danger: "danger",
};

/** Label kecil bergaya chip (HeroUI). */
export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <Chip color={COLOR_MAP[tone]} variant="soft" size="sm" className={cn("whitespace-nowrap", className)}>
      {children}
    </Chip>
  );
}
