import { AppNav } from "@/components/layout/AppNav";

/** Layout halaman operasional: navigasi atas + konten penuh. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppNav />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
