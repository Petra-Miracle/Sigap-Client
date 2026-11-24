import { Skeleton as HeroSkeleton } from "@heroui/react";

/** Placeholder loading (HeroUI). */
export function Skeleton({ className, animationType }: { className?: string; animationType?: "shimmer" | "pulse" | "none" }) {
  return <HeroSkeleton animationType={animationType} className={className} />;
}
