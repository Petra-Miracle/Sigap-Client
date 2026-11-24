"use client";

import type { ReactNode } from "react";
import { I18nProvider, Toast } from "@heroui/react";

/**
 * Provider klien HeroUI v3. v3 tidak butuh HeroUIProvider; I18nProvider dipakai
 * agar komponen React Aria (HeroUI) memakai locale Indonesia. Toast.Provider
 * dipasang agar primitive Toast bisa dipakai dari mana saja.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider locale="id-ID">
      {children}
      <Toast.Provider placement="bottom end" />
    </I18nProvider>
  );
}
