import { AuthGuard } from "@/src/components/layout/AuthGuard";
import { DashboardShell } from "@/src/components/layout/DashboardShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
