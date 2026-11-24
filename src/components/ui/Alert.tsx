import type { ReactNode } from "react";
import { Alert as HeroAlert } from "@heroui/react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/format";

/** Pesan error/peringatan yang jelas untuk pengguna, dengan aksi opsional. */
export function Alert({
  tone = "danger",
  children,
  action,
  className,
}: {
  tone?: "danger" | "warning";
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <HeroAlert status={tone} className={cn(className)}>
      <HeroAlert.Indicator>
        <AlertTriangle aria-hidden className="size-4" />
      </HeroAlert.Indicator>
      <HeroAlert.Content>{children}</HeroAlert.Content>
      {action ? <div className="ml-auto flex items-center gap-1">{action}</div> : null}
    </HeroAlert>
  );
}
