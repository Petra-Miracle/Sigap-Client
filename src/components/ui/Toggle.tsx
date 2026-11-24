"use client";

import { Label, Switch } from "@heroui/react";

/** Saklar on/off yang aksesibel (HeroUI Switch). */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <Switch isSelected={checked} onChange={onChange} className="min-h-11 items-center gap-2 px-1 text-sm text-ink-2 hover:text-ink">
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Content>
        <Label className="text-sm">{label}</Label>
      </Switch.Content>
    </Switch>
  );
}
